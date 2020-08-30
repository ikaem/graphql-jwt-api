"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __importDefault(require("./user"));
var query_1 = __importDefault(require("./query"));
var mutation_1 = __importDefault(require("./mutation"));
exports.default = {
    User: user_1.default,
    Query: query_1.default,
    Mutation: mutation_1.default
};
/*
const typeDefs = gql`

    type Query {
        hello: String
        getUsers: [User]
        getUser(id: ID!): User
        getCountries: [Country]
        getCountry(id: ID!): Country
    }

    type User {
        user_id: ID
        email: String
        first_name: String
        last_name: String
        city: String
        website: String
        age: Int
        hobbies: [String]
        country: Country
    }

    type Country {
        country_id: ID
        country_name: String
    }
`;

const resolvers = {
    Query: {
        hello: async() => "Hello",
        getCountry: async(parent: any, args: { id: number}, context: any) => {
            try {
                const getCountryRes = await pgPool.query(`
                    SELECT country_id, country_name
                    FROM countries
                    WHERE country_id = ${args.id}
                `);

                return getCountryRes.rows[0];
            }
            catch(error) {
                console.log(error);
            }
        },
        getCountries: async() => {
            try {
                const getCountriesQuery = `
                    SELECT country_id, country_name
                    FROM countries
                `;
                const getCountriesRes = await pgPool.query(getCountriesQuery);
                return getCountriesRes.rows;
            }
            catch(error) {
                console.log(error);
            }
        },
        getUsers: async() => {
            try {
                const userQuery = `
                    SELECT
                        users_login.user_id,
                        users_login.email,
                        users_info.first_name,
                        users_info.last_name,
                        users_info.city,
                        users_info.website,
                        users_info."age",
                        users_info.hobbies
                    FROM
                        users_login
                    
                    JOIN
                        users_info
                    ON
                        users_login.user_id = users_info.user_info_id;
                `
                const userSelect = await pgPool.query(userQuery);
                return userSelect.rows
                // res.json({data: userSelect.rows});
            }
        
            catch(error) {
                console.log(error);
                // res.json(error);
            }
        },
        getUser: async(parent: any, args: { id: number }, context: any ) => {
            try {
                const userQuery = `
                    SELECT
                        users_login.user_id,
                        users_login.email,
                        users_info.first_name,
                        users_info.last_name,
                        users_info.city,
                        users_info.website,
                        users_info."age",
                        users_info.hobbies
                    FROM
                        users_login
                    
                    JOIN
                        users_info
                    ON
                        users_login.user_id = users_info.user_info_id
                    WHERE
                        users_login.user_id = ${args.id}
                `
                const userSelect = await pgPool.query(userQuery);
                return userSelect.rows[0];
            }
        
            catch(error) {
                console.log(error);
            }
        },
    },
    User: {
        country: async(parent: { user_id: number }, args: any, context: any) => {
            try {
                const getUserCountryQuery = `
                    SELECT
                        countries.country_id,
                        countries.country_name
                    FROM
                        countries
                    JOIN
                        users_info
                    ON
                        countries.country_id = users_info.country
                    WHERE
                        users_info.user_info_id = ${parent.user_id};
                `;

                const getUserCountryRes = await pgPool.query(getUserCountryQuery);
                return getUserCountryRes.rows[0];
            }
            catch(error) {
                console.log(error);
            }
        }
    }
}


*/ 
