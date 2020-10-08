const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT;

const employeeRouter = require("./routes/employees");

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
  console.log("Connected to DB!")
);
mongoose.set("useCreateIndex", true);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text({ defaultCharset: "utf-8" }));

app.use("/employee", employeeRouter);

app.listen(PORT, () => console.log(`Server is listening on Port ${PORT}....`));
