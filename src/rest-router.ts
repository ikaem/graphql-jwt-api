import { Router } from "express";
import { hash, hashSync, compare } from "bcrypt";

import pgPool from "./pg/pg-connection";

const router = Router();

const rootRoute =  router.get("/", async(req, res) => {
    try {
        const usersLogin = await pgPool.query(`
            select * from users_login
        `);

        res.json(usersLogin.rows);
    }

    catch(error) {
        console.log(error);
    }
});

const newUser = router.post("/newuser", async(req, res) => {
    const { email, password, first_name, last_name, country, city, website, age, hobbies } = req.body;

    const client = await pgPool.connect();

    try {
        const hashed = await hash(password, 10);

        await client.query("BEGIN");
        const users_loginQuery = `
            INSERT INTO users_login (email, hash)
            VALUES ('${email}', '${hashed}')
            RETURNING user_id, email, hash;
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
                hobbies
            )
            VALUES (
                ${users_loginInsert.rows[0].user_id},
                '${first_name}',
                '${last_name}',
                ${+country},
                '${city}',
                '${website}',
                ${+age},
                '{${hobbies}}'
            )
            RETURNING                 
                first_name,
                last_name,
                country,
                city,
                website,
                "age",
                hobbies;
        `;

        const users_infoInsert = await client.query(users_infoQuery);
        await client.query("COMMIT");

        res.json({ data: {...users_loginInsert.rows[0], ...users_infoInsert.rows[0] }});
    }
    catch(error){
        await client.query("ROLLBACK");
        console.log(error);
        res.json(error);
    }
    finally {
        client.release();
    }
});

const getUsers = router.get("/users", async(req, res) => {

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
                countries.country_id,
                countries.country_name
            FROM 
                users_login
            
            JOIN 
                users_info
            ON 
                users_login.user_id = users_info.user_info_id
            
            JOIN 
                countries 
            ON 
                users_info.country = countries.country_id 
        `
        const userSelect = await pgPool.query(userQuery);
        res.json({data: userSelect.rows});
    }

    catch(error) {
        console.log(error);
        res.json(error);
    }
});

const login = router.post("/login", async(req, res) => {
    const { email, password } = req.body;

    const client = await pgPool.connect();

    try {

        await client.query("BEGIN");
        const users_loginQuery = `
            SELECT user_id, email, hash
            FROM users_login
            WHERE email = '${email}'
        `;
        const users_loginSelect = await client.query(users_loginQuery);

        const { user_id, email: loggedEmail, hash: hashedPassword } = users_loginSelect.rows[0];

        const isPasswordValid = compare(password, hashedPassword);
        if(!isPasswordValid) throw Error("Invalid Credentials");

        await client.query("COMMIT");

        res.json({ data: { user_id, email: loggedEmail }});
    }

    catch(error) {
        await client.query("ROLLBACK");
        console.log(error);
        res.json(error);
    }

    finally {
        client.release();
    }
});

const getUser = router.get("/user/:id", async(req, res) => {
    console.log(req.params);
    const { id } = req.params;

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
                countries.country_id,
                countries.country_name
            FROM 
                users_login
            
            JOIN 
                users_info
            ON 
                users_login.user_id = users_info.user_info_id
            
            JOIN 
                countries 
            ON 
                users_info.country = countries.country_id 
            
            WHERE
                users_login.user_id = ${+id};
    
        `
        const userSelect = await pgPool.query(userQuery);
        res.json({data: userSelect.rows[0]});
    }

    catch(error) {
        console.log(error);
        res.json(error);
    }
});

const editUser = router.put("/edituser/:id", async(req, res) => {
    const { id } = req.params;

    const { email, first_name, last_name, country, city, website, age, hobbies } = req.body;

    const client = await pgPool.connect();

    try {

        await client.query("BEGIN");
        const users_loginUpdateQuery = `
            UPDATE users_login
            SET 
                email = '${email}'
            WHERE 
                user_id = ${+id}
            RETURNING user_id, email;
        `;
        const users_loginUpdate = await client.query(users_loginUpdateQuery);

        const users_infoUpdateQuery = `
            UPDATE users_info
            SET 
                first_name = '${first_name}',
                last_name = '${last_name}',
                country = ${+country},
                city = '${city}',
                website = '${website}',
                "age" = ${+age},
                hobbies = '{${hobbies}}'
            WHERE 
                user_info_id = ${+id}
            RETURNING 
                first_name, 
                last_name,
                country,
                city,
                website,
                "age",
                hobbies
        `;

        const users_infoUpdate = await client.query(users_infoUpdateQuery);
        await client.query("COMMIT");

        res.json({ data: { ...users_loginUpdate.rows[0], ...users_infoUpdate.rows[0] } });
    }
    catch(error){
        await client.query("ROLLBACK");
        console.log(error);
        res.json(error);
    }
    finally {
        client.release();
    }
});

const deleteUser = router.delete("/deleteuser/:id", async(req, res) => {
    const { id } = req.params;

    try {
        const userDeleteQuery = `
            DELETE FROM users_login
            WHERE user_id = ${+id}
        `;

        const userDelete = await pgPool.query(userDeleteQuery);
        console.log(userDelete);
        res.json(userDelete);
    }

    catch(error) {
        console.log(error);
        res.json(error);
    }
});


export default [
    rootRoute,
    getUser,
    getUsers,
    newUser,
    login,
    editUser,
    deleteUser,
]