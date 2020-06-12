import { Pool } from "pg";
import { hash, compare } from "bcrypt";

interface mutateUserArgs {
    email: string;
    first_name: string;
    last_name: string;
    country: number;
    city: string;
    website: string;
    age: number;
    hobbies: string[];
    avatar_link: string;
}

interface newUserArgs extends mutateUserArgs {
    password: string;
}

interface editUserArgs extends mutateUserArgs {
    user_id: number
}

export default {
    addCountry: async(parent: any, args: { country_name: string }, context: { pgPool: Pool }) => {
        try {
            const newCountryQuery = `
                INSERT INTO countries(country_name)
                VALUES('${args.country_name}')
                RETURNING country_id, country_name;
            `;
            const newCountryRes = await context.pgPool.query(newCountryQuery);

            return newCountryRes.rows[0];
        }
        catch(error) {
            console.log(error);
        }
    },
    deleteUser: async(parent: any, args: { user_id: number }, context: { pgPool: Pool }) => {
        
        try {
            const userDeleteQuery = `
                DELETE FROM users_login
                WHERE user_id = ${args.user_id}
            `;

            const userDelete = await context.pgPool.query(userDeleteQuery);
            console.log(userDelete.rowCount);
            return Boolean(userDelete.rowCount);
        }
        catch(error) {
            console.log(error);
        }
    },
    editUser: async(parent: any, args: editUserArgs, context: { pgPool: Pool }) => {
        const { user_id, email, first_name, last_name, country, city, website, age, hobbies, avatar_link } = args;

        const client = await context.pgPool.connect();

        console.log("inside edit mutaiton...");

        try {

            await client.query("BEGIN");
            const users_loginUpdateQuery = `
                UPDATE users_login
                SET 
                    email = '${email}'
                WHERE 
                    user_id = ${user_id}
                RETURNING 
                    user_id, 
                    email;
            `;
            const users_loginUpdate = await client.query(users_loginUpdateQuery);
    
            const users_infoUpdateQuery = `
                UPDATE users_info
                SET 
                    first_name = '${first_name}',
                    last_name = '${last_name}',
                    country = ${country},
                    city = '${city}',
                    website = '${website}',
                    "age" = ${age},
                    hobbies = '{${hobbies}}',
                    avatar_link = '{${avatar_link}}'
                WHERE 
                    user_info_id = ${user_id}
                RETURNING 
                    first_name, 
                    last_name,
                    city,
                    website,
                    "age",
                    hobbies,
                    avatar_link
            `;
    
            const users_infoUpdate = await client.query(users_infoUpdateQuery);
            await client.query("COMMIT");
    
            return { 
                ...users_loginUpdate.rows[0], 
                ...users_infoUpdate.rows[0]
            };
        }

        catch(error) {
            await client.query("ROLLBACK");
            console.log(error);
        }
        finally {
            client.release();
        }
    },

    newUser: async(parent: any, args: newUserArgs, context: { pgPool: Pool }) => {

        console.log("inside mutation");



        const { email, password, first_name, last_name, country, city, website, age, hobbies, avatar_link } = args;


        const client = await context.pgPool.connect();

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

            const users_loginInsert = await client.query(users_loginQuery);
    
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
                    age,
                    hobbies,
                    avatar_link

            `;
    
            const users_infoInsert = await client.query(users_infoQuery);

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
    },
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