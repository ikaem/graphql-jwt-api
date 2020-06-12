import dotenv from "dotenv";
dotenv.config();
import { ApolloServer, gql } from "apollo-server-express";

import cors from "cors";
import express from "express";

import pgPool from "./pg/pg-connection";
import restRouter from "./rest-router";
import typeDefs from "./gql/type-defs";
import resolvers from "./gql/resolvers/index";

const PORT = process.env.PORT || 4000;

const res = pgPool.query("select * from countries");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(restRouter);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
        return {
            pgPool
        }
    }
});
server.applyMiddleware({ app, path: "/grapqhl"});

app.listen(PORT, () => {
    console.log(`GraphQL server running on "http://localhost:${PORT}${server.graphqlPath}`);
});