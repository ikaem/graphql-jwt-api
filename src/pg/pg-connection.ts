import { Pool } from "pg";

const pgPool: Pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "karlo",
    database: "gql",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
});

export default pgPool;