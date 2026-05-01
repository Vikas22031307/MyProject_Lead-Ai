const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Lead = require("../models/Lead");
const { replaceLeads, getLeads, getUsers } = require("../data/store");
const { buildCsvLeads } = require("./csvLeadService");

const defaultDatabaseUsers = [
  { username: "admin", password: "1234", role: "admin" },
  { username: "agent", password: "1234", role: "sales" },
  { username: "customer", password: "1234", role: "customer" },
];

function seedInMemoryLeadsFromCsv() {
  if (getLeads().length > 0) {
    return;
  }

  const users = getUsers();
  const admin = users.find((user) => user.username === "admin");
  const agent = users.find((user) => user.username === "agent");

  replaceLeads(
    buildCsvLeads({
      createdBy: admin?.username || null,
      assignedTo: agent?.username || null,
    })
  );
}

async function seedDatabaseIfNeeded() {
  const userCount = await User.countDocuments();

  if (userCount > 0) {
    await ensureDefaultDatabaseUsers();

    const leadCount = await Lead.countDocuments();

    if (leadCount === 0) {
      const admin = await User.findOne({ username: "admin" });
      const agent = await User.findOne({ username: "agent" });
      await Lead.create(
        buildCsvLeads({
          createdBy: admin?._id,
          assignedTo: agent?._id,
        }).map(({ id, ...lead }) => lead)
      );
    }

    return;
  }

  const defaultUsers = await Promise.all(
    defaultDatabaseUsers.map(async (user) => ({
      username: user.username,
      passwordHash: await bcrypt.hash(user.password, 10),
      role: user.role,
    }))
  );

  const [admin, agent] = await User.create(defaultUsers);

  await Lead.create(
    buildCsvLeads({
      createdBy: admin._id,
      assignedTo: agent._id,
    }).map(({ id, ...lead }) => lead)
  );
}

async function ensureDefaultDatabaseUsers() {
  await Promise.all(
    defaultDatabaseUsers.map(async (user) => {
      const existingUser = await User.findOne({ username: user.username });

      if (existingUser) {
        return;
      }

      await User.create({
        username: user.username,
        passwordHash: await bcrypt.hash(user.password, 10),
        role: user.role,
      });
    })
  );
}

module.exports = {
  seedDatabaseIfNeeded,
  seedInMemoryLeadsFromCsv,
};
