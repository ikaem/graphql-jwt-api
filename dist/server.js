"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var apollo_server_express_1 = require("apollo-server-express");
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var pg_connection_1 = __importDefault(require("./pg/pg-connection"));
var rest_router_1 = __importDefault(require("./rest-router"));
var type_defs_1 = __importDefault(require("./gql/type-defs"));
var index_1 = __importDefault(require("./gql/resolvers/index"));
var PORT = process.env.PORT || 4000;
var res = pg_connection_1.default.query("select * from countries");
var app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(rest_router_1.default);
var server = new apollo_server_express_1.ApolloServer({
    typeDefs: type_defs_1.default,
    resolvers: index_1.default,
    context: function () {
        return {
            pgPool: pg_connection_1.default
        };
    }
});
server.applyMiddleware({ app: app, path: "/grapqhl" });
app.listen(PORT, function () {
    console.log("GraphQL server running on \"http://localhost:" + PORT + server.graphqlPath);
});
