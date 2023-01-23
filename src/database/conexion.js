const { Pool } = require("pg");

const joyasDB = new Pool({
    host: "postgresql-mathiasdb.alwaysdata.net",
    user: "mathiasdb_admin",
    password: "18282323",
    database: "mathiasdb_joyas",
    port: 5432,
    allowExitOnIdle: true
})
module.exports = joyasDB;