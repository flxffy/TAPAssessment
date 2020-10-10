const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const parse = require("csv-parse/lib/sync");

const User = require("../../models/user");
const user = require("../../services/user");
const users = express.Router();

users.get("/", async (req, res) => {
  user
    .getUsers(req.query)
    .then(({ code, ...data }) => res.status(code).json(data))
    .catch(({ code, err }) => res.status(code).json(err));
});

users.post("/new", async (req, res) => {
  user
    .createUser(req.body)
    .then(({ code, data }) => res.status(code).json(data))
    .catch(({ code, err }) => res.status(code).json(err));
});

users.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file.size) {
    res.status(400).json({ err: "Empty file" });
    return;
  }

  let users;
  try {
    users = await parse(req.file.buffer.toString(), {
      columns: User.columns,
      comment: "#",
      trim: true,
      skip_empty_lines: true,
    });
  } catch (err) {
    res.status(400).json(err);
    return;
  }

  user
    .upsertUsers(users)
    .then(async ({ code, data }) => res.status(code).json(data))
    .catch(async ({ code, err }) => res.status(code).json(err));
});

users.patch("/:id", async (req, res) => {
  user
    .updateUser(req.params.id, req.body)
    .then(({ code, data }) => res.status(code).json(data))
    .catch(({ code, err }) => res.status(code).json(err));
});

users.delete("/:id", async (req, res) => {
  user
    .deleteUser(req.params.id)
    .then(({ code, data }) => res.status(code).json(data))
    .catch(({ code, err }) => res.status(code).json(err));
});

module.exports = users;
