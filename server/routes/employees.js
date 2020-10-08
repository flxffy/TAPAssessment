const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const parse = require("csv-parse/lib/sync");

const Employee = require("../models/Employee");
const employee = express.Router();

employee.get("/", async (req, res) => {
  const {
    minSalary = 0,
    maxSalary = Number.MAX_SAFE_INTEGER,
    offset = 0,
    limit = 0,
    sort = { name: 1 },
  } = req.query;

  Employee.find({ salary: { $gte: minSalary, $lte: maxSalary } })
    .sort(sort)
    .skip(offset)
    .limit(limit)
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
  const records = await parse(req.file.buffer.toString(), {
    columns: ["id", "login", "name", "salary"],
    comment: "#",
    trim: true,
    skip_empty_lines: true,
  });

  const session = await mongoose.startSession();
  session
    .withTransaction(() => {
      return Promise.all(
        records.map(async (record) =>
          Employee.updateOne({ id: { $eq: record.id } }, record, {
            upsert: true,
            runValidators: true,
            session: session,
          })
        )
      );
    })
    .then(async (data) => res.status(200).json(data))
    .catch(async (err) => res.status(400).json(err));
});

employee.delete("/:id", async (req, res) => {
  Employee.deleteOne({ id: { $eq: req.params.id } })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json(err));
});

module.exports = employee;
