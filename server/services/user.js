const mongoose = require("mongoose");
const User = require("../models/user");

const getUsers = ({
  minSalary = 0,
  maxSalary = Number.MAX_SAFE_INTEGER,
  offset = 0,
  limit = 30,
  sort = "+id",
}) =>
  new Promise(async (resolve, reject) => {
    const sortCriteria = {};
    if (sort[0] == "+") {
      sortCriteria[sort.slice(1)] = 1;
    } else if (sort[0] == "-") {
      sortCriteria[sort.slice(1)] = -1;
    } else {
      reject({ code: 400, err: "Invalid sort criteria" });
    }

    const count = await User.countDocuments({});
    User.find({ salary: { $gte: minSalary, $lte: maxSalary } })
      .sort(sortCriteria)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .then((data) => {
        const results = data.map((d) => {
          const result = {};
          User.columns.forEach((col) => (result[col] = d[col].toString()));
          return result;
        });
        resolve({ code: 200, results, count });
      })
      .catch((err) => reject({ code: 400, err }));
  });

const createUser = (doc) =>
  new Promise((resolve, reject) => {
    User.create(doc)
      .then((data) => resolve({ code: 200, data }))
      .catch((err) => reject({ code: 400, err }));
  });

const upsertUsers = (users) =>
  new Promise(async (resolve, reject) => {
    const session = await mongoose.startSession();
    session
      .withTransaction(() => {
        return Promise.all(
          users.map(async (user) =>
            User.updateOne({ id: user.id }, user, {
              upsert: true,
              runValidators: true,
              session,
            })
          )
        );
      })
      .then((data) => resolve({ code: 200, data }))
      .catch((err) => reject({ code: 400, err }));
  });

const updateUser = (id, doc) =>
  new Promise((resolve, reject) => {
    User.findOne({ id }, (err, user) => {
      if (err) {
        reject({ code: 400, err });
      } else if (!user) {
        reject({ code: 404, err: "User not found." });
      } else {
        User.updateOne({ id }, doc, { runValidators: true }, (err, result) => {
          if (err) {
            reject({ code: 400, err });
          } else {
            resolve({ code: 200, data: result });
          }
        });
      }
    });
  });

const deleteUser = (id) =>
  new Promise((resolve, reject) => {
    User.findOne({ id }, (err, user) => {
      if (err) {
        reject({ code: 400, err });
      } else if (!user) {
        reject({ code: 404, err: "User not found." });
      } else {
        User.deleteOne(user, (err, result) => {
          if (err) {
            reject({ code: 500, err }); // unknown error
          } else {
            resolve({ code: 200, data: result });
          }
        });
      }
    });
  });

module.exports = { getUsers, createUser, upsertUsers, updateUser, deleteUser };
