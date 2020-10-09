const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const parse = require("csv-parse/lib/sync");

const Users = require("../models/Users");
const users = express.Router();

const columns = ["id", "login", "name", "salary"];

users.get("/", async (req, res) => {
  const {
    minSalary = 0,
    maxSalary = Number.MAX_SAFE_INTEGER,
    offset = 0,
    limit = 30,
    sort = "+id",
  } = req.query;

  const sortCriteria = {};
  if (sort[0] == "+") {
    sortCriteria[sort.slice(1)] = 1;
  } else if (sort[0] == "-") {
    sortCriteria[sort.slice(1)] = -1;
  } else {
    res.status(400).json({ reason: "Invalid sort criteria" });
    return;
  }

  const count = await Users.countDocuments({});
  Users.find({ salary: { $gte: minSalary, $lte: maxSalary } })
    .sort(sortCriteria)
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .then((data) => {
      const results = data.map((d) => {
        const result = {};
        columns.forEach((col) => (result[col] = d[col].toString()));
        return result;
      });
      res.status(200).json({ results, count });
    })
    .catch((err) => res.status(400).json(err));
});

users.post("/new", async (req, res) => {
  Users.updateOne(
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
    .catch((err) => res.status(400).json(err));
});

users.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file.size) {
    res.status(400).json({ reason: "Empty file" });
    return;
  }

  let records;
  try {
    records = await parse(req.file.buffer.toString(), {
      columns: columns,
      comment: "#",
      trim: true,
      skip_empty_lines: true,
    });
  } catch (err) {
    res.status(400).json(err);
    return;
  }

  const session = await mongoose.startSession();
  session
    .withTransaction(() => {
      return Promise.all(
        records.map(async (record) =>
          Users.updateOne({ id: { $eq: record.id } }, record, {
            upsert: true,
            runValidators: true,
            session,
          })
        )
      );
    })
    .then(async (data) => res.status(200).json(data))
    .catch(async (err) => res.status(400).json(err));
});

users.delete("/:id", async (req, res) => {
  Users.findOne({ id: req.params.id }, (err, user) => {
    if (err) {
      res.status(400).json(err).send();
    } else if (!user) {
      res.status(404).send();
    } else {
      Users.deleteOne(user).then((data) => res.status(200).json(data));
    }
  });
});

module.exports = users;
