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
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = require("bcrypt");
exports.default = {
    addCountry: function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
        var newCountryQuery, newCountryRes, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    newCountryQuery = "\n                INSERT INTO countries(country_name)\n                VALUES('" + args.country_name + "')\n                RETURNING country_id, country_name;\n            ";
                    return [4 /*yield*/, context.pgPool.query(newCountryQuery)];
                case 1:
                    newCountryRes = _a.sent();
                    return [2 /*return*/, newCountryRes.rows[0]];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    deleteUser: function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
        var userDeleteQuery, userDelete, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userDeleteQuery = "\n                DELETE FROM users_login\n                WHERE user_id = " + args.user_id + "\n            ";
                    return [4 /*yield*/, context.pgPool.query(userDeleteQuery)];
                case 1:
                    userDelete = _a.sent();
                    console.log(userDelete.rowCount);
                    return [2 /*return*/, Boolean(userDelete.rowCount)];
                case 2:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    editUser: function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
        var user_id, email, first_name, last_name, country, city, website, age, hobbies, avatar_link, client, users_loginUpdateQuery, users_loginUpdate, users_infoUpdateQuery, users_infoUpdate, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user_id = args.user_id, email = args.email, first_name = args.first_name, last_name = args.last_name, country = args.country, city = args.city, website = args.website, age = args.age, hobbies = args.hobbies, avatar_link = args.avatar_link;
                    return [4 /*yield*/, context.pgPool.connect()];
                case 1:
                    client = _a.sent();
                    console.log("inside edit mutaiton...");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, 9, 10]);
                    return [4 /*yield*/, client.query("BEGIN")];
                case 3:
                    _a.sent();
                    users_loginUpdateQuery = "\n                UPDATE users_login\n                SET \n                    email = '" + email + "'\n                WHERE \n                    user_id = " + user_id + "\n                RETURNING \n                    user_id, \n                    email;\n            ";
                    return [4 /*yield*/, client.query(users_loginUpdateQuery)];
                case 4:
                    users_loginUpdate = _a.sent();
                    users_infoUpdateQuery = "\n                UPDATE users_info\n                SET \n                    first_name = '" + first_name + "',\n                    last_name = '" + last_name + "',\n                    country = " + country + ",\n                    city = '" + city + "',\n                    website = '" + website + "',\n                    \"age\" = " + age + ",\n                    hobbies = '{" + hobbies + "}',\n                    avatar_link = '{" + avatar_link + "}'\n                WHERE \n                    user_info_id = " + user_id + "\n                RETURNING \n                    first_name, \n                    last_name,\n                    city,\n                    website,\n                    \"age\",\n                    hobbies,\n                    avatar_link\n            ";
                    return [4 /*yield*/, client.query(users_infoUpdateQuery)];
                case 5:
                    users_infoUpdate = _a.sent();
                    return [4 /*yield*/, client.query("COMMIT")];
                case 6:
                    _a.sent();
                    return [2 /*return*/, __assign(__assign({}, users_loginUpdate.rows[0]), users_infoUpdate.rows[0])];
                case 7:
                    error_3 = _a.sent();
                    return [4 /*yield*/, client.query("ROLLBACK")];
                case 8:
                    _a.sent();
                    console.log(error_3);
                    return [3 /*break*/, 10];
                case 9:
                    client.release();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); },
    newUser: function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
        var email, password, first_name, last_name, country, city, website, age, hobbies, avatar_link, client, hashed, users_loginQuery, users_loginInsert, users_infoQuery, users_infoInsert, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("inside mutation");
                    email = args.email, password = args.password, first_name = args.first_name, last_name = args.last_name, country = args.country, city = args.city, website = args.website, age = args.age, hobbies = args.hobbies, avatar_link = args.avatar_link;
                    return [4 /*yield*/, context.pgPool.connect()];
                case 1:
                    client = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 8, 10, 11]);
                    return [4 /*yield*/, bcrypt_1.hash(password, 10)];
                case 3:
                    hashed = _a.sent();
                    return [4 /*yield*/, client.query("BEGIN")];
                case 4:
                    _a.sent();
                    users_loginQuery = "\n                INSERT INTO users_login (email, hash)\n                VALUES ('" + email + "', '" + hashed + "')\n                RETURNING \n                    user_id, \n                    email;\n            ";
                    return [4 /*yield*/, client.query(users_loginQuery)];
                case 5:
                    users_loginInsert = _a.sent();
                    users_infoQuery = "\n                INSERT INTO users_info(\t\n                    user_info_id,\n                    first_name,\n                    last_name,\n                    country,\n                    city,\n                    website,\n                    \"age\",\n                    hobbies,\n                    avatar_link\n\n                )\n                VALUES (\n                    " + users_loginInsert.rows[0].user_id + ",\n                    '" + first_name + "',\n                    '" + last_name + "',\n                    " + country + ",\n                    '" + city + "',\n                    '" + website + "',\n                    " + age + ",\n                    '{" + hobbies + "}',\n                    '" + avatar_link + "'\n\n                )\n                RETURNING             \n                    first_name,\n                    last_name,\n                    city,\n                    website,\n                    age,\n                    hobbies,\n                    avatar_link\n\n            ";
                    return [4 /*yield*/, client.query(users_infoQuery)];
                case 6:
                    users_infoInsert = _a.sent();
                    return [4 /*yield*/, client.query("COMMIT")];
                case 7:
                    _a.sent();
                    console.log(__assign(__assign({}, users_loginInsert.rows[0]), users_infoInsert.rows[0]));
                    return [2 /*return*/, __assign(__assign({}, users_loginInsert.rows[0]), users_infoInsert.rows[0])];
                case 8:
                    error_4 = _a.sent();
                    return [4 /*yield*/, client.query("ROLLBACK")];
                case 9:
                    _a.sent();
                    console.log(error_4);
                    return [3 /*break*/, 11];
                case 10:
                    client.release();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); },
};
/*
        try {

            const hashed = await hash(password, 10);

            await client.query("BEGIN");
            const users_loginQuery = `
                INSERT INTO users_login (email, hash)
                VALUES ('${email}', '${hashed}')
                RETURNING
                    user_id,
                    email;
            `;
            console.log("first insert");


            const users_loginInsert = await client.query(users_loginQuery);

            console.log(typeof users_loginInsert.rows[0].user_id);
    
            const users_infoQuery = `
                INSERT INTO users_info(
                    user_info_id,
                    first_name,
                    last_name,
                    country,
                    city,
                    website,
                    "age",
                    hobbies,
                    avatar_link
                )
                VALUES (
                    ${users_loginInsert.rows[0].user_id},
                    '${first_name}',
                    '${last_name}',
                    ${country},
                    '${city}',
                    '${website}',
                    ${age},
                    '{${hobbies}}',
                    '${avatar_link}'
                )
                RETURNING
                    first_name,
                    last_name,
                    city,
                    website,
                    "age",
                    hobbies,
                    avatar_link;
            `;
            console.log("second insert");
    
            const users_infoInsert = await client.query(users_infoQuery);

            console.log("third insert");




            await client.query("COMMIT");

            console.log( {
                ...users_loginInsert.rows[0],
                ...users_infoInsert.rows[0]
            });

            return {
                ...users_loginInsert.rows[0],
                ...users_infoInsert.rows[0]
            };
        }

        catch(error) {
            await client.query("ROLLBACK");
            console.log(error);
        }
        finally {
            client.release();
        }


*/ 
