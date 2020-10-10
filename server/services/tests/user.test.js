const mongoose = require("mongoose");
const service = require("../user");
const User = require("../../models/user");

describe("test getUsers", () => {
  const users = [
    { id: "e1", login: "l1", name: "rick", salary: "5" },
    { id: "e2", login: "l2", name: "morty", salary: "4" },
    { id: "e3", login: "l3", name: "summer", salary: "3" },
    { id: "e4", login: "l4", name: "beth", salary: "2" },
    { id: "e5", login: "l5", name: "jerry", salary: "1" },
  ];

  beforeAll(async () => {
    connection = await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Promise.all(users.map((user) => User.create(user)));
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("get all users", async () => {
    const { code, count, results } = await service.getUsers({});

    expect(code).toBe(200);
    expect(count).toBe(users.length);
    results.forEach((result, i) => {
      User.columns.forEach((column) => {
        expect(result[column]).toBe(users[i][column]);
      });
    });
  });

  it("get users filtered by minSalary only", async () => {
    const minSalary = 2;
    const expected = users.filter(({ salary }) => parseFloat(salary) >= minSalary);
    const { code, count, results } = await service.getUsers({ minSalary });

    expect(code).toBe(200);
    expect(count).toBe(expected.length);
    results.forEach((result, i) => {
      User.columns.forEach((column) => {
        expect(result[column]).toBe(expected[i][column]);
      });
    });
  });

  it("get users filtered by maxSalary only", async () => {
    const maxSalary = 4;
    const expected = users.filter(({ salary }) => parseFloat(salary) <= maxSalary);
    const { code, count, results } = await service.getUsers({ maxSalary });

    expect(code).toBe(200);
    expect(count).toBe(expected.length);
    results.forEach((result, i) => {
      User.columns.forEach((column) => {
        expect(result[column]).toBe(expected[i][column]);
      });
    });
  });

  it("get users filtered by minSalary and maxSalary", async () => {
    const minSalary = 2;
    const maxSalary = 4;
    const expected = users.filter(
      ({ salary }) => parseFloat(salary) >= minSalary && parseFloat(salary) <= maxSalary
    );
    const { code, count, results } = await service.getUsers({ minSalary, maxSalary });

    expect(code).toBe(200);
    expect(count).toBe(expected.length);
    results.forEach((result, i) => {
      User.columns.forEach((column) => {
        expect(result[column]).toBe(expected[i][column]);
      });
    });
  });

  it("get offset users", async () => {
    const offset = 2;
    const expected = users.slice(2);
    const { code, count, results } = await service.getUsers({ offset });

    expect(code).toBe(200);
    expect(count).toBe(users.length);
    results.forEach((result, i) => {
      User.columns.forEach((column) => {
        expect(result[column]).toBe(expected[i][column]);
      });
    });
  });

  it("get limited users", async () => {
    const limit = 2;
    const { code, count, results } = await service.getUsers({ limit });

    expect(code).toBe(200);
    expect(count).toBe(users.length);
    expect(results.length).toBe(limit);
    results.forEach((result, i) => {
      User.columns.forEach((column) => {
        expect(result[column]).toBe(users[i][column]);
      });
    });
  });

  it("get users sorted (asc) by name", async () => {
    const sort = "+name";
    const expected = users.sort((u1, u2) => u1.name.localeCompare(u2.name));
    const { code, count, results } = await service.getUsers({ sort });

    expect(code).toBe(200);
    expect(count).toBe(users.length);
    results.forEach((result, i) => {
      expect(result.name).toBe(expected[i].name);
    });
  });

  it("get users sorted (desc) by name", async () => {
    const sort = "-name";
    const expected = users.sort((u1, u2) => u1.name.localeCompare(u2.name));
    expected.reverse();
    const { code, count, results } = await service.getUsers({ sort });

    expect(code).toBe(200);
    expect(count).toBe(users.length);
    results.forEach((result, i) => {
      expect(result.name).toBe(expected[i].name);
    });
  });
});

describe("test createUser", () => {
  beforeAll(async () => {
    connection = await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("create user success", async () => {
    const user = { id: "id", login: "login", name: "name", salary: "1" };
    const { code } = await service.createUser(user);
    const actual = await User.findOne({ id: { $eq: user.id } });

    expect(code).toBe(200);
    User.columns.forEach((column) => {
      expect(actual[column].toString()).toBe(user[column]);
    });
  });

  describe("create user failure", () => {
    it("invalid salary (below 0)", async () => {
      const user = { id: "id", login: "login", name: "name", salary: "-1" };
      await expect(service.createUser(user)).rejects.toBeTruthy();
    });

    it("duplicate id", async () => {
      const user1 = { id: "id", login: "l1", name: "n1", salary: "1" };
      const user2 = { id: "id", login: "l2", name: "n2", salary: "2" };
      await expect(service.createUser(user1)).resolves.toBeTruthy();
      await expect(service.createUser(user2)).rejects.toBeTruthy();
    });
  });
});

describe.skip("test upsertUsers", () => {
  /**
   * Skipped because of unresolved errors in test
   * db from the use of transactions in upsertUsers()
   */
  beforeAll(async () => {
    connection = await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("upsert users success", () => {
    it("inserts only", async () => {
      const users = [
        { id: "e1", login: "l1", name: "rick", salary: "5" },
        { id: "e2", login: "l2", name: "morty", salary: "4" },
        { id: "e3", login: "l3", name: "summer", salary: "3" },
        { id: "e4", login: "l4", name: "beth", salary: "2" },
        { id: "e5", login: "l5", name: "jerry", salary: "1" },
      ];

      const beforeCount = await User.countDocuments({});
      expect(beforeCount).toBe(0);

      const { code } = await service.upsertUsers(users);
      const afterCount = await User.countDocuments({});
      expect(code).toBe(200);
      expect(afterCount).toBe(users.length);
    });

    it("updates only", async () => {
      const users = [
        { id: "e1", login: "l1", name: "rick", salary: "5" },
        { id: "e2", login: "l2", name: "morty", salary: "4" },
        { id: "e3", login: "l3", name: "summer", salary: "3" },
        { id: "e4", login: "l4", name: "beth", salary: "2" },
        { id: "e5", login: "l5", name: "jerry", salary: "1" },
      ];

      await Promise.all(users.map((user) => User.create(user)));
      const beforeCount = await User.countDocuments({});

      const expected = users.map((user) => (user.name = "a"));
      const { code } = await service.upsertUsers(expected);
      const actual = await User.find({});

      expect(code).toBe(200);
      expect(actual.length).toBe(beforeCount);
      actual.forEach((result, i) => {
        User.columns.forEach((column) => {
          expect(result[column]).toBe(expected[i][column]);
        });
      });
    });

    it("inserts and updates", async () => {
      const users = [
        { id: "e1", login: "l1", name: "rick", salary: "5" },
        { id: "e2", login: "l2", name: "morty", salary: "4" },
        { id: "e3", login: "l3", name: "summer", salary: "3" },
        { id: "e4", login: "l4", name: "beth", salary: "2" },
        { id: "e5", login: "l5", name: "jerry", salary: "1" },
      ];

      await Promise.all(users.slice(0, 3).map((user) => User.create(user)));
      const beforeCount = await User.countDocuments({});

      const expected = users.map((user) => (user.name = "a"));
      const { code } = await service.upsertUsers(expected);
      const actual = await User.find({});

      expect(code).toBe(200);
      expect(actual.length).toBe(users.length);
      actual.forEach((result, i) => {
        User.columns.forEach((column) => {
          expect(result[column]).toBe(expected[i][column]);
        });
      });
    });
  });
});

describe("test updateUser", () => {
  const users = [
    { id: "e1", login: "l1", name: "rick", salary: "5" },
    { id: "e2", login: "l2", name: "morty", salary: "4" },
    { id: "e3", login: "l3", name: "summer", salary: "3" },
    { id: "e4", login: "l4", name: "beth", salary: "2" },
    { id: "e5", login: "l5", name: "jerry", salary: "1" },
  ];

  beforeAll(async () => {
    connection = await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Promise.all(users.map((user) => User.create(user)));
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("update user success", async () => {
    const [user] = users;
    const expected = { ...user, id: "newId" };
    const { code } = await service.updateUser(user.id, expected);
    const actual = await User.findOne({ id: { $eq: expected.id } });

    expect(code).toBe(200);
    User.columns.forEach((column) => {
      expect(actual[column].toString()).toBe(expected[column]);
    });
  });

  describe("update user failure", () => {
    it("invalid salary (below 0)", async () => {
      const [user] = users;
      const test = { ...user, salary: "-1" };
      await expect(service.updateUser(user.id, test)).rejects.toBeTruthy();
    });

    it("duplicate id", async () => {
      const [user1, user2] = users;
      await expect(service.updateUser(user1.id, { ...user1, id: user2.id })).rejects.toBeTruthy();
    });

    it("duplicate login", async () => {
      const [user1, user2] = users;
      await expect(service.updateUser(user1.id, { ...user1, login: user2.login })).rejects.toBeTruthy();
    });

    it("non-existent user", async () => {
      const user = { id: "non existent", login: "b", name: "c", salary: "0" };
      await expect(service.updateUser(user.id, user)).rejects.toBeTruthy();
    });
  });
});
