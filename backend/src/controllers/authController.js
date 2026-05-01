const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/appError");
const { SECRET } = require("../middleware/authenticate");
const {
  findUserByCredentials,
  createUser,
  logActivity,
} = require("../services/databaseService");

function createAuthPayload(user) {
  const token = jwt.sign(
    { username: user.username, role: user.role },
    SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      username: user.username,
      role: user.role,
    },
    redirectTo: user.role === "customer" ? "/" : "/dashboard",
  };
}

async function login(req, res, next) {
  const { username, password } = req.body;
  const user = await findUserByCredentials(username, password);

  if (!user) {
    return next(new AppError(401, "Invalid credentials"));
  }

  await logActivity({
    actorUsername: user.username,
    action: "auth.login",
    metadata: { role: user.role },
  });

  res.json(createAuthPayload(user));
}

async function signup(req, res, next) {
  const { username, password, role } = req.body;
  const user = await createUser({ username, password, role });

  await logActivity({
    actorUsername: user.username,
    action: "auth.signup",
    metadata: { role: user.role },
  });

  res.status(201).json(createAuthPayload(user));
}

module.exports = {
  login,
  signup,
};
