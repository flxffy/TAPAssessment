const express = require("express");
const employee = express.Router();

const Employee = require("../models/Employee");

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

module.exports = employee;
