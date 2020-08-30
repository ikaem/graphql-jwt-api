"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    hello: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, "Hello"];
    }); }); },
    getCountry: function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
        var getCountryRes, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, context.pgPool.query("\n                SELECT country_id, country_name\n                FROM countries \n                WHERE country_id = " + args.id + "\n            ")];
                case 1:
                    getCountryRes = _a.sent();
                    return [2 /*return*/, getCountryRes.rows[0]];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getCountries: function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
        var getCountriesQuery, getCountriesRes, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    getCountriesQuery = "\n                SELECT country_id, country_name\n                FROM countries\n            ";
                    return [4 /*yield*/, context.pgPool.query(getCountriesQuery)];
                case 1:
                    getCountriesRes = _a.sent();
                    return [2 /*return*/, getCountriesRes.rows];
                case 2:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getUsers: function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
        var userQuery, userSelect, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userQuery = "\n                SELECT \n                    users_login.user_id,\n                    users_login.email,\n                    users_info.first_name,\n                    users_info.last_name,\n                    users_info.city,\n                    users_info.website,\n                    users_info.\"age\",\n                    users_info.hobbies,\n                    users_info.avatar_link\n                FROM \n                    users_login\n                \n                JOIN \n                    users_info\n                ON \n                    users_login.user_id = users_info.user_info_id;\n            ";
                    return [4 /*yield*/, context.pgPool.query(userQuery)];
                case 1:
                    userSelect = _a.sent();
                    return [2 /*return*/, userSelect.rows
                        // res.json({data: userSelect.rows});
                    ];
                case 2:
                    error_3 = _a.sent();
                    console.log(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getUser: function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
        var userQuery, userSelect, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userQuery = "\n                SELECT \n                    users_login.user_id,\n                    users_login.email,\n                    users_info.first_name,\n                    users_info.last_name,\n                    users_info.city,\n                    users_info.website,\n                    users_info.\"age\",\n                    users_info.hobbies,\n                    users_info.avatar_link\n                FROM \n                    users_login\n                \n                JOIN \n                    users_info\n                ON \n                    users_login.user_id = users_info.user_info_id\n                WHERE \n                    users_login.user_id = " + args.id + "\n            ";
                    return [4 /*yield*/, context.pgPool.query(userQuery)];
                case 1:
                    userSelect = _a.sent();
                    return [2 /*return*/, userSelect.rows[0]];
                case 2:
                    error_4 = _a.sent();
                    console.log(error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getUserForEdit: function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
        var client, userQuery, userSelect, countriesQuery, countriesSelect, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, context.pgPool.connect()];
                case 1:
                    client = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, 9, 10]);
                    return [4 /*yield*/, client.query("BEGIN")];
                case 3:
                    _a.sent();
                    userQuery = "\n                SELECT \n                    users_login.user_id,\n                    users_login.email,\n                    users_info.first_name,\n                    users_info.last_name,\n                    users_info.city,\n                    users_info.website,\n                    users_info.\"age\",\n                    users_info.hobbies,\n                    users_info.avatar_link\n                FROM \n                    users_login\n                JOIN \n                    users_info\n                ON \n                    users_login.user_id = users_info.user_info_id\n                WHERE \n                    users_login.user_id = " + args.id + "\n            ";
                    return [4 /*yield*/, client.query(userQuery)];
                case 4:
                    userSelect = _a.sent();
                    countriesQuery = "\n                SELECT \n                    country_id,\n                    country_name\n                FROM \n                    countries\n            ";
                    return [4 /*yield*/, client.query(countriesQuery)];
                case 5:
                    countriesSelect = _a.sent();
                    console.log({ user: userSelect.rows[0] });
                    console.log({ countries: countriesSelect.rows });
                    return [4 /*yield*/, client.query("COMMIT")];
                case 6:
                    _a.sent();
                    return [2 /*return*/, {
                            user: userSelect.rows[0],
                            countries: countriesSelect.rows
                        }];
                case 7:
                    error_5 = _a.sent();
                    console.log(error_5);
                    return [4 /*yield*/, client.query("ROLLBACK")];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    client.release();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); },
    getPaginatedCountries: function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
        var limit, client, paginatedCountriesQuery, paginatedCountriesRes, numberOfCountriesQuery, numberOfCountriesRes, hasNextPage, slicedCountries, newCursor, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    limit = 3;
                    return [4 /*yield*/, context.pgPool.connect()];
                case 1:
                    client = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, 9, 10]);
                    return [4 /*yield*/, client.query("BEGIN")];
                case 3:
                    _a.sent();
                    paginatedCountriesQuery = "\n                SELECT \n                    country_id,\n                    country_name\n                FROM \n                    countries\n                WHERE \n                    country_id > " + args.cursor + "\n                LIMIT " + (limit + 1) + ";\n            ";
                    return [4 /*yield*/, client.query(paginatedCountriesQuery)];
                case 4:
                    paginatedCountriesRes = _a.sent();
                    numberOfCountriesQuery = "\n                SELECT \n                    COUNT(country_id)\n                FROM \n                    countries;\n            ";
                    return [4 /*yield*/, client.query(numberOfCountriesQuery)];
                case 5:
                    numberOfCountriesRes = _a.sent();
                    console.log(paginatedCountriesRes.rows);
                    console.log(numberOfCountriesRes.rows[0].count);
                    hasNextPage = paginatedCountriesRes.rows.length > limit;
                    slicedCountries = paginatedCountriesRes.rows.slice(0, limit);
                    newCursor = slicedCountries[slicedCountries.length - 1].country_id;
                    // console.log("new cursor:", newCursor);
                    return [4 /*yield*/, client.query("COMMIT")];
                case 6:
                    // console.log("new cursor:", newCursor);
                    _a.sent();
                    return [2 /*return*/, {
                            countries: slicedCountries,
                            cursor: newCursor,
                            hasNextPage: hasNextPage,
                            totalCountries: numberOfCountriesRes.rows[0].count,
                            countriesPerPage: limit
                        }];
                case 7:
                    error_6 = _a.sent();
                    console.log(error_6);
                    return [4 /*yield*/, client.query("ROLLBACK")];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    client.release();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); },
    getPaginatedUsers: function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
        var limit, client, paginatedUsersQuery, paginatedUsersRes, numberOfUsersQuery, numberOfUsersRes, hasNextPage, slicedUsers, newCursor, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    limit = 3;
                    return [4 /*yield*/, context.pgPool.connect()];
                case 1:
                    client = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, 9, 10]);
                    return [4 /*yield*/, client.query("BEGIN")];
                case 3:
                    _a.sent();
                    paginatedUsersQuery = "\n                SELECT \n                    users_login.user_id,\n                    users_login.email,\n                    users_info.first_name,\n                    users_info.last_name,\n                    users_info.city,\n                    users_info.website,\n                    users_info.\"age\",\n                    users_info.hobbies,\n                    users_info.avatar_link\n                FROM \n                    users_login\n                \n                JOIN \n                    users_info\n                ON \n                    users_login.user_id = users_info.user_info_id\n                WHERE \n                    user_id > " + args.cursor + "\n                ORDER BY users_login.user_id\n                LIMIT " + (limit + 1) + ";\n            ";
                    return [4 /*yield*/, client.query(paginatedUsersQuery)];
                case 4:
                    paginatedUsersRes = _a.sent();
                    numberOfUsersQuery = "\n                SELECT \n                    COUNT(user_id)\n                FROM \n                    users_login;\n            ";
                    return [4 /*yield*/, client.query(numberOfUsersQuery)];
                case 5:
                    numberOfUsersRes = _a.sent();
                    console.log(paginatedUsersRes.rows);
                    hasNextPage = paginatedUsersRes.rows.length > limit;
                    slicedUsers = paginatedUsersRes.rows.slice(0, limit);
                    newCursor = slicedUsers[slicedUsers.length - 1].user_id;
                    return [4 /*yield*/, client.query("COMMIT")];
                case 6:
                    _a.sent();
                    return [2 /*return*/, {
                            users: slicedUsers,
                            cursor: newCursor,
                            hasNextPage: hasNextPage,
                            totalUsers: numberOfUsersRes.rows[0].count,
                            usersPerPage: limit
                        }];
                case 7:
                    error_7 = _a.sent();
                    console.log(error_7);
                    return [4 /*yield*/, client.query("ROLLBACK")];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    client.release();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); }
};
