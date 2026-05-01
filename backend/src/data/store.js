const fs = require("fs");
const path = require("path");

const storeDir = path.join(__dirname, "..", "..", "data");
const storeFilePath = path.join(storeDir, "store.json");

const defaultUsers = [
  { id: "mem-admin", username: "admin", password: "1234", role: "admin" },
  { id: "mem-agent", username: "agent", password: "1234", role: "sales" },
  { id: "mem-customer", username: "customer", password: "1234", role: "customer" },
];

const defaultLeads = [
  {
    id: 1,
    name: "Vikas",
    interest: "Looking for a premium apartment close to the central business district.",
    budget: 5000000,
    visits: 5,
    timeSpent: 20,
    urgencyScore: 9,
    score: 90,
    status: "Qualified",
    location: "Delhi",
    source: "Website",
    industry: "Residential",
    tag: "Hot",
    notes: [
      {
        id: 1,
        text: "Requested premium options near central business district.",
        createdAt: "2025-04-01T10:00:00.000Z",
      },
    ],
    date: "2025-04-01",
    converted: 1,
    createdBy: "mem-admin",
    assignedTo: "mem-agent",
  },
  {
    id: 2,
    name: "Rahul",
    interest: "Needs office space with quick possession for a growing team.",
    budget: 2000000,
    visits: 2,
    timeSpent: 10,
    urgencyScore: 5,
    score: 60,
    status: "New",
    location: "Mumbai",
    source: "Facebook",
    industry: "Commercial",
    tag: "Warm",
    notes: [
      {
        id: 1,
        text: "Interested in office space with quick possession.",
        createdAt: "2025-04-05T11:00:00.000Z",
      },
    ],
    date: "2025-04-05",
    converted: 0,
    createdBy: "mem-admin",
    assignedTo: "mem-agent",
  },
];

function createDefaultStore() {
  return {
    users: defaultUsers.map((user) => ({ ...user })),
    leads: defaultLeads.map((lead) => ({
      ...lead,
      notes: Array.isArray(lead.notes) ? lead.notes.map((note) => ({ ...note })) : [],
    })),
    leadScores: [],
    activityLogs: [],
  };
}

function ensureStoreDirectory() {
  if (!fs.existsSync(storeDir)) {
    fs.mkdirSync(storeDir, { recursive: true });
  }
}

function loadStore() {
  if (!fs.existsSync(storeFilePath)) {
    return createDefaultStore();
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(storeFilePath, "utf8"));
    const defaults = createDefaultStore();

    return {
      users: Array.isArray(parsed.users) ? parsed.users : defaults.users,
      leads: Array.isArray(parsed.leads) ? parsed.leads : defaults.leads,
      leadScores: Array.isArray(parsed.leadScores) ? parsed.leadScores : [],
      activityLogs: Array.isArray(parsed.activityLogs) ? parsed.activityLogs : [],
    };
  } catch (error) {
    return createDefaultStore();
  }
}

const store = loadStore();

function saveStore() {
  ensureStoreDirectory();
  fs.writeFileSync(storeFilePath, JSON.stringify(store, null, 2), "utf8");
}

function getUsers() {
  return store.users;
}

function getLeads() {
  return store.leads;
}

function replaceLeads(nextLeads) {
  store.leads.splice(0, store.leads.length, ...nextLeads);
  saveStore();
}

function getLeadScores() {
  return store.leadScores;
}

function getActivityLogs() {
  return store.activityLogs;
}

function getNextLeadId() {
  return store.leads.length
    ? Math.max(...store.leads.map((lead) => Number(lead.id))) + 1
    : 1;
}

module.exports = {
  getUsers,
  getLeads,
  replaceLeads,
  getLeadScores,
  getActivityLogs,
  getNextLeadId,
  saveStore,
};
