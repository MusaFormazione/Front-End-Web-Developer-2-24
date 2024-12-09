const { compare, hash } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const jwtKey = require("../shared/key");
const fs = require("node:fs/promises");
const { v4: uuidv4 } = require("uuid");

module.exports.signup = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Email not valid" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password not valid" });
  }

  try {
    const hashedPassword = await hash(password, 10);
    const file = await fs.readFile("./data/users.json", "utf8");
    const data = JSON.parse(file);

    const userExists = data.users.some((user) => user.email === email);
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = { email, password: hashedPassword, _id: uuidv4() };

    const newUsers = [newUser, ...data.users];

    await fs.writeFile(
      "./data/users.json",
      JSON.stringify({ users: newUsers })
    );

    return res.status(201).json({ user: newUser });
  } catch (err) {
    return res.status(500).json({ error: "User creation failed" });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const file = await fs.readFile("./data/users.json", "utf8");
    const data = JSON.parse(file);
    const user = data.users.find((user) => user.email === email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = sign({ userId: user._id }, jwtKey.KEY, { expiresIn: "1h" });

    return res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
