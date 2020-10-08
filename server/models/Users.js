const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema({
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
    validate: {
      validator: (salary) => parseFloat(salary) >= 0.0,
    },
  },
});

module.exports = mongoose.model("Users", UsersSchema);
