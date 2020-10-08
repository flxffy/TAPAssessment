const mongoose = require("mongoose");

const EmployeeSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  login: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  salary: {
    type: mongoose.Decimal128,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
