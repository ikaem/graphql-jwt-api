import dotenv from "dotenv";
dotenv.config();
import { ApolloServer, gql } from "apollo-server-express";

import { sign, verify } from "jsonwebtoken";

import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import expressJwt from "express-jwt";

import pgPool from "./pg/pg-connection";
import restRouter from "./rest-router";
import typeDefs from "./gql/type-defs";
import resolvers from "./gql/resolvers/index";

const PORT = process.env.PORT || 4000;

const app = express();

const something: cors.CorsOptions = {

}

app.use(
  cors({
    origin: ["http://localhost:3000"],
    // origin: "https://google.com",
    // origin: "include",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressJwt({
    secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
    algorithms: ["HS256"],
    credentialsRequired: false,
  })
);
app.use(restRouter);
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.name === "UnauthorizedError") {
      //   console.log("error: invalid token");
      req.user = null;
    }
    next();
  }
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context: ({ req, res }) => {
  context: ({ req, res }: { req: express.Request; res: express.Response }) => {
    // console.log("req.user inside context setup:", req.user);

    // console.log(req.headers["authorization"])
    // console.log(req.headers)

    // console.log(req.user);

    return {
      pgPool,
      req,
      res,
    };
  },
});
server.applyMiddleware({ app, path: "/grapqhl", cors: false });

app.listen(PORT, () => {
  console.log(
    `GraphQL server running on "http://localhost:${PORT}${server.graphqlPath}`
  );
});
