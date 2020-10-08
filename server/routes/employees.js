const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const parse = require("csv-parse/lib/sync");

const Employee = require("../models/Employee");
const employee = express.Router();

employee.get("/", async (req, res) => {
  Employee.find()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({ message: err }));
});

employee.post("/new", async (req, res) => {
  Employee.updateOne(
    { id: { $eq: req.body.id } },
    {
      id: req.body.id,
      login: req.body.login,
      name: req.body.name,
      salary: req.body.salary,
    },
    { upsert: true }
  )
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({ message: err }));
});

employee.post("/upload/csv", upload.single("file"), async (req, res) => {
  const b = req.file["buffer"];

  const records = await parse(b.toString(), {
    columns: ["id", "login", "name", "salary"],
    comment: "#",
    trim: true,
    skip_empty_lines: true,
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  Promise.all(
    records.map(async (record) =>
      Employee.updateOne({ id: { $eq: record.id } }, record, {
        upsert: true,
        runValidators: true,
        session: session,
      })
    )
  )
    .then(async (data) => {
      await session.commitTransaction();
      res.status(200).json(data);
    })
    .catch(async (err) => {
      await session.abortTransaction();
      res.status(400).json(err);
    })
    .finally(() => {
      session.endSession();
      res.send();
    });
});

module.exports = employee;
