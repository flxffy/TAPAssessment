const mongoose = require("mongoose");
const service = require("../user");
const User = require("../../models/user");

describe("test getUsers", () => {
  const data = [
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

    await Promise.all(data.map((entry) => User.create(entry)));
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("get all users", async () => {
    const { code, count, results } = await service.getUsers({});

    expect(code).toBe(200);
    expect(count).toBe(data.length);
    results.forEach((result, i) => {
      User.columns.forEach((column) => {
        expect(result[column]).toBe(data[i][column]);
      });
    });
  });

  it("get users filtered by minSalary only", async () => {
    const minSalary = 2;
    const expected = data.filter(({ salary }) => parseFloat(salary) >= minSalary);
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
    const expected = data.filter(({ salary }) => parseFloat(salary) <= maxSalary);
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
    const expected = data.filter(
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
    const expected = data.slice(2);
    const { code, count, results } = await service.getUsers({ offset });

    expect(code).toBe(200);
    expect(count).toBe(data.length);
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
    expect(count).toBe(data.length);
    expect(results.length).toBe(limit);
    results.forEach((result, i) => {
      User.columns.forEach((column) => {
        expect(result[column]).toBe(data[i][column]);
      });
    });
  });

  it("get users sorted (asc) by name", async () => {
    const sort = "+name";
    const expected = data.sort((u1, u2) => u1.name.localeCompare(u2.name));
    const { code, count, results } = await service.getUsers({ sort });

    expect(code).toBe(200);
    expect(count).toBe(data.length);
    results.forEach((result, i) => {
      expect(result.name).toBe(expected[i].name);
    });
  });

  it("get users sorted (desc) by name", async () => {
    const sort = "-name";
    const expected = data.sort((u1, u2) => u1.name.localeCompare(u2.name));
    expected.reverse();
    const { code, count, results } = await service.getUsers({ sort });

    expect(code).toBe(200);
    expect(count).toBe(data.length);
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

  describe("create user failure", async () => {
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
