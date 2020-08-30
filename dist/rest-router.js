"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var bcrypt_1 = require("bcrypt");
var pg_connection_1 = __importDefault(require("./pg/pg-connection"));
var router = express_1.Router();
var rootRoute = router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usersLogin, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, pg_connection_1.default.query("\n            select * from users_login\n        ")];
            case 1:
                usersLogin = _a.sent();
                res.json(usersLogin.rows);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
var newUser = router.post("/newuser", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, first_name, last_name, country, city, website, age, hobbies, client, hashed, users_loginQuery, users_loginInsert, users_infoQuery, users_infoInsert, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, first_name = _a.first_name, last_name = _a.last_name, country = _a.country, city = _a.city, website = _a.website, age = _a.age, hobbies = _a.hobbies;
                return [4 /*yield*/, pg_connection_1.default.connect()];
            case 1:
                client = _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 8, 10, 11]);
                return [4 /*yield*/, bcrypt_1.hash(password, 10)];
            case 3:
                hashed = _b.sent();
                return [4 /*yield*/, client.query("BEGIN")];
            case 4:
                _b.sent();
                users_loginQuery = "\n            INSERT INTO users_login (email, hash)\n            VALUES ('" + email + "', '" + hashed + "')\n            RETURNING user_id, email, hash;\n        ";
                return [4 /*yield*/, client.query(users_loginQuery)];
            case 5:
                users_loginInsert = _b.sent();
                users_infoQuery = "\n            INSERT INTO users_info(\t\n                user_info_id,\n                first_name,\n                last_name,\n                country,\n                city,\n                website,\n                \"age\",\n                hobbies\n            )\n            VALUES (\n                " + users_loginInsert.rows[0].user_id + ",\n                '" + first_name + "',\n                '" + last_name + "',\n                " + +country + ",\n                '" + city + "',\n                '" + website + "',\n                " + +age + ",\n                '{" + hobbies + "}'\n            )\n            RETURNING                 \n                first_name,\n                last_name,\n                country,\n                city,\n                website,\n                \"age\",\n                hobbies;\n        ";
                return [4 /*yield*/, client.query(users_infoQuery)];
            case 6:
                users_infoInsert = _b.sent();
                return [4 /*yield*/, client.query("COMMIT")];
            case 7:
                _b.sent();
                res.json({ data: __assign(__assign({}, users_loginInsert.rows[0]), users_infoInsert.rows[0]) });
                return [3 /*break*/, 11];
            case 8:
                error_2 = _b.sent();
                return [4 /*yield*/, client.query("ROLLBACK")];
            case 9:
                _b.sent();
                console.log(error_2);
                res.json(error_2);
                return [3 /*break*/, 11];
            case 10:
                client.release();
                return [7 /*endfinally*/];
            case 11: return [2 /*return*/];
        }
    });
}); });
var getUsers = router.get("/users", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userQuery, userSelect, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userQuery = "\n            SELECT \n                users_login.user_id,\n                users_login.email,\n                users_info.first_name,\n                users_info.last_name,\n                users_info.city,\n                users_info.website,\n                users_info.\"age\",\n                users_info.hobbies,\n                countries.country_id,\n                countries.country_name\n            FROM \n                users_login\n            \n            JOIN \n                users_info\n            ON \n                users_login.user_id = users_info.user_info_id\n            \n            JOIN \n                countries \n            ON \n                users_info.country = countries.country_id \n        ";
                return [4 /*yield*/, pg_connection_1.default.query(userQuery)];
            case 1:
                userSelect = _a.sent();
                res.json({ data: userSelect.rows });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.log(error_3);
                res.json(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
var login = router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, client, users_loginQuery, users_loginSelect, _b, user_id, loggedEmail, hashedPassword, isPasswordValid, error_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, pg_connection_1.default.connect()];
            case 1:
                client = _c.sent();
                _c.label = 2;
            case 2:
                _c.trys.push([2, 6, 8, 9]);
                return [4 /*yield*/, client.query("BEGIN")];
            case 3:
                _c.sent();
                users_loginQuery = "\n            SELECT user_id, email, hash\n            FROM users_login\n            WHERE email = '" + email + "'\n        ";
                return [4 /*yield*/, client.query(users_loginQuery)];
            case 4:
                users_loginSelect = _c.sent();
                _b = users_loginSelect.rows[0], user_id = _b.user_id, loggedEmail = _b.email, hashedPassword = _b.hash;
                isPasswordValid = bcrypt_1.compare(password, hashedPassword);
                if (!isPasswordValid)
                    throw Error("Invalid Credentials");
                return [4 /*yield*/, client.query("COMMIT")];
            case 5:
                _c.sent();
                res.json({ data: { user_id: user_id, email: loggedEmail } });
                return [3 /*break*/, 9];
            case 6:
                error_4 = _c.sent();
                return [4 /*yield*/, client.query("ROLLBACK")];
            case 7:
                _c.sent();
                console.log(error_4);
                res.json(error_4);
                return [3 /*break*/, 9];
            case 8:
                client.release();
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}); });
var getUser = router.get("/user/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userQuery, userSelect, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.params);
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                userQuery = "\n            SELECT \n                users_login.user_id,\n                users_login.email,\n                users_info.first_name,\n                users_info.last_name,\n                users_info.city,\n                users_info.website,\n                users_info.\"age\",\n                users_info.hobbies,\n                countries.country_id,\n                countries.country_name\n            FROM \n                users_login\n            \n            JOIN \n                users_info\n            ON \n                users_login.user_id = users_info.user_info_id\n            \n            JOIN \n                countries \n            ON \n                users_info.country = countries.country_id \n            \n            WHERE\n                users_login.user_id = " + +id + ";\n    \n        ";
                return [4 /*yield*/, pg_connection_1.default.query(userQuery)];
            case 2:
                userSelect = _a.sent();
                res.json({ data: userSelect.rows[0] });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.log(error_5);
                res.json(error_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
var editUser = router.put("/edituser/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, email, first_name, last_name, country, city, website, age, hobbies, client, users_loginUpdateQuery, users_loginUpdate, users_infoUpdateQuery, users_infoUpdate, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, email = _a.email, first_name = _a.first_name, last_name = _a.last_name, country = _a.country, city = _a.city, website = _a.website, age = _a.age, hobbies = _a.hobbies;
                return [4 /*yield*/, pg_connection_1.default.connect()];
            case 1:
                client = _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 7, 9, 10]);
                return [4 /*yield*/, client.query("BEGIN")];
            case 3:
                _b.sent();
                users_loginUpdateQuery = "\n            UPDATE users_login\n            SET \n                email = '" + email + "'\n            WHERE \n                user_id = " + +id + "\n            RETURNING user_id, email;\n        ";
                return [4 /*yield*/, client.query(users_loginUpdateQuery)];
            case 4:
                users_loginUpdate = _b.sent();
                users_infoUpdateQuery = "\n            UPDATE users_info\n            SET \n                first_name = '" + first_name + "',\n                last_name = '" + last_name + "',\n                country = " + +country + ",\n                city = '" + city + "',\n                website = '" + website + "',\n                \"age\" = " + +age + ",\n                hobbies = '{" + hobbies + "}'\n            WHERE \n                user_info_id = " + +id + "\n            RETURNING \n                first_name, \n                last_name,\n                country,\n                city,\n                website,\n                \"age\",\n                hobbies\n        ";
                return [4 /*yield*/, client.query(users_infoUpdateQuery)];
            case 5:
                users_infoUpdate = _b.sent();
                return [4 /*yield*/, client.query("COMMIT")];
            case 6:
                _b.sent();
                res.json({ data: __assign(__assign({}, users_loginUpdate.rows[0]), users_infoUpdate.rows[0]) });
                return [3 /*break*/, 10];
            case 7:
                error_6 = _b.sent();
                return [4 /*yield*/, client.query("ROLLBACK")];
            case 8:
                _b.sent();
                console.log(error_6);
                res.json(error_6);
                return [3 /*break*/, 10];
            case 9:
                client.release();
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); });
var deleteUser = router.delete("/deleteuser/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userDeleteQuery, userDelete, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                userDeleteQuery = "\n            DELETE FROM users_login\n            WHERE user_id = " + +id + "\n        ";
                return [4 /*yield*/, pg_connection_1.default.query(userDeleteQuery)];
            case 2:
                userDelete = _a.sent();
                console.log(userDelete);
                res.json(userDelete);
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                console.log(error_7);
                res.json(error_7);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = [
    rootRoute,
    getUser,
    getUsers,
    newUser,
    login,
    editUser,
    deleteUser,
];
