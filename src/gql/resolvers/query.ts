import { Pool } from "pg";
import { Request } from "express";


interface ReturnedData {
    getPaginatedCountries: {
        countries: {
           country_id: string;
           country_name: string; 
        }[];
        countriesPerPage: number;
        cursor: number;
        hasNextPage: boolean;
        totalCountries: number;
    }
}

export default {
    hello: async() => "Hello",
    getCountry: async(parent: any, args: { id: number}, context: { pgPool: Pool }) => {
        try {
            const getCountryRes = await context.pgPool.query(`
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
    getCountries: async(parent: any, args: any, context: { pgPool: Pool }) => {
        try {
            const getCountriesQuery = `
                SELECT country_id, country_name
                FROM countries
            `;
            const getCountriesRes = await context.pgPool.query(getCountriesQuery);
            return getCountriesRes.rows;
        }
        catch(error) {
            console.log(error);
        }
    },
    getUsers: async(parent: any, args: any, context: { pgPool: Pool }) => {
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
                    users_info.hobbies,
                    users_info.avatar_link
                FROM 
                    users_login
                
                JOIN 
                    users_info
                ON 
                    users_login.user_id = users_info.user_info_id;
            `
            const userSelect = await context.pgPool.query(userQuery);

            return userSelect.rows
            // res.json({data: userSelect.rows});
        }
    
        catch(error) {
            console.log(error);
            // res.json(error);
        }
    },
    getUser: async(parent: any, args: { id: number }, context: { pgPool: Pool} ) => {
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
                    users_info.hobbies,
                    users_info.avatar_link
                FROM 
                    users_login
                
                JOIN 
                    users_info
                ON 
                    users_login.user_id = users_info.user_info_id
                WHERE 
                    users_login.user_id = ${args.id}
            `
            const userSelect = await context.pgPool.query(userQuery);
            return userSelect.rows[0];
        }
    
        catch(error) {
            console.log(error);
        }
    },

    getUserForEdit: async(parent: any, args: { id: number }, context: { pgPool: Pool} ) => {

        const client = await context.pgPool.connect();

        try {
            await client.query("BEGIN");

            const userQuery = `
                SELECT 
                    users_login.user_id,
                    users_login.email,
                    users_info.first_name,
                    users_info.last_name,
                    users_info.city,
                    users_info.website,
                    users_info."age",
                    users_info.hobbies,
                    users_info.avatar_link
                FROM 
                    users_login
                JOIN 
                    users_info
                ON 
                    users_login.user_id = users_info.user_info_id
                WHERE 
                    users_login.user_id = ${args.id}
            `;
            const userSelect = await client.query(userQuery);
        
            const countriesQuery = `
                SELECT 
                    country_id,
                    country_name
                FROM 
                    countries
            `;

            const countriesSelect = await client.query(countriesQuery);


            // console.log ({user: userSelect.rows[0]});
            // console.log ({countries: countriesSelect.rows});

            await client.query("COMMIT");

            return {
                user: userSelect.rows[0],
                countries: countriesSelect.rows
            };
        }
    
        catch(error) {
            console.log(error);
            await client.query("ROLLBACK");
        }
        finally {
            client.release();
        }
    },
    getPaginatedCountries: async(parent: any, args: { cursor: number }, context: { pgPool: Pool }) => {

        const limit = 3;
        const client = await context.pgPool.connect();

        try {

            await client.query("BEGIN");

            const paginatedCountriesQuery = `
                SELECT 
                    country_id,
                    country_name
                FROM 
                    countries
                WHERE 
                    country_id > ${args.cursor}
                LIMIT ${limit + 1};
            `;

            const paginatedCountriesRes = await client.query(paginatedCountriesQuery);

            const numberOfCountriesQuery = `
                SELECT 
                    COUNT(country_id)
                FROM 
                    countries;
            `;

            const numberOfCountriesRes = await client.query(numberOfCountriesQuery);

            // console.log(paginatedCountriesRes.rows);
            // console.log(numberOfCountriesRes.rows[0].count);

            const hasNextPage = paginatedCountriesRes.rows.length > limit;

            // console.log("hasNextPage:", hasNextPage)

            const slicedCountries = paginatedCountriesRes.rows.slice(0, limit);

            const newCursor = slicedCountries[slicedCountries.length - 1].country_id;

            // console.log("new cursor:", newCursor);

            await client.query("COMMIT");

            return {
                countries: slicedCountries,
                cursor: newCursor,
                hasNextPage,
                totalCountries: numberOfCountriesRes.rows[0].count,
                countriesPerPage: limit
            };

        }

        catch(error) {
            console.log(error);
            await client.query("ROLLBACK");
        }
        finally{
            client.release();
        }
    },
    getPaginatedUsers: async(parent: any, args: { cursor: number }, context: { pgPool: Pool, req: Request }) => {

        const limit = 3;
        const client = await context.pgPool.connect();

        console.log("token user:", context.req.user);

        try {

            await client.query("BEGIN");

            const paginatedUsersQuery = `
                SELECT 
                    users_login.user_id,
                    users_login.email,
                    users_info.first_name,
                    users_info.last_name,
                    users_info.city,
                    users_info.website,
                    users_info."age",
                    users_info.hobbies,
                    users_info.avatar_link
                FROM 
                    users_login
                
                JOIN 
                    users_info
                ON 
                    users_login.user_id = users_info.user_info_id
                WHERE 
                    user_id > ${args.cursor}
                ORDER BY users_login.user_id
                LIMIT ${limit + 1};
            `;

            const paginatedUsersRes = await client.query(paginatedUsersQuery);

            const numberOfUsersQuery = `
                SELECT 
                    COUNT(user_id)
                FROM 
                    users_login;
            `;

            const numberOfUsersRes = await client.query(numberOfUsersQuery);

            // console.log(paginatedUsersRes.rows);

            const hasNextPage = paginatedUsersRes.rows.length > limit;

            // console.log("hasNextPage:", hasNextPage)


            const slicedUsers = paginatedUsersRes.rows.slice(0, limit);

            const newCursor = slicedUsers[slicedUsers.length - 1].user_id;

            await client.query("COMMIT");

            return {
                users: slicedUsers,
                cursor: newCursor,
                hasNextPage,
                totalUsers: numberOfUsersRes.rows[0].count,
                usersPerPage: limit
            };

        }

        catch(error) {
            console.log(error);
            await client.query("ROLLBACK");
        }
        finally{
            client.release();
        }
    }
}