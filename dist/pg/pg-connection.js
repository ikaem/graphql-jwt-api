"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var pgPool = new pg_1.Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "karlo",
    database: "gql",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
});
exports.default = pgPool;
