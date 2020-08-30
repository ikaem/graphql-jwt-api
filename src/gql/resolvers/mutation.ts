import { Pool, QueryResult } from "pg";
import { hash, compare } from "bcrypt";
import { Request, Response } from "express";
import { UserInputError, AuthenticationError } from "apollo-server-express";
import { verify } from "jsonwebtoken";

import { generateAccessToken, generateRefreshToken } from "../../utils/tokens";

interface mutateUserArgs {
  email?: string;
  first_name?: string;
  last_name?: string;
  country?: number;
  city?: string;
  website?: string;
  age?: number;
  hobbies?: string[];
  avatar_link?: string;
}

interface newUserArgs extends mutateUserArgs {
  password?: string;
}

interface editUserArgs extends mutateUserArgs {
  user_id: number;
}

export default {
  addCountry: async (
    parent: any,
    args: { country_name: string },
    context: { pgPool: Pool }
  ) => {
    try {
      const newCountryQuery = `
                INSERT INTO countries(country_name)
                VALUES('${args.country_name}')
                RETURNING country_id, country_name;
            `;
      const newCountryRes = await context.pgPool.query(newCountryQuery);

      return newCountryRes.rows[0];
    } catch (error) {
      console.log(error);
    }
  },
  deleteUser: async (
    parent: any,
    args: { user_id: number },
    context: { pgPool: Pool; req: Request }
  ) => {
    const {
      req: { user },
    } = context;

    if (user === null)
      throw new AuthenticationError("Please login to edit profile");

    try {
      const userDeleteQuery = `
                DELETE FROM users_login
                WHERE user_id = ${args.user_id}
            `;

      const userDelete = await context.pgPool.query(userDeleteQuery);
      console.log(userDelete.rowCount);
      return Boolean(userDelete.rowCount);
    } catch (error) {
      console.log(error);
    }
  },
  editUser: async (
    parent: any,
    args: editUserArgs,
    context: { pgPool: Pool; req: Request }
  ) => {
    const {
      req: { user },
    } = context;

    if (user === null)
      throw new AuthenticationError("Please login to edit profile");

    const {
      user_id,
      email,
      first_name,
      last_name,
      country,
      city,
      website,
      age,
      hobbies,
      avatar_link,
    } = args;

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
        ...users_infoUpdate.rows[0],
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.log(error);
    } finally {
      client.release();
    }
  },

  login: async (
    parent: any,
    args: { email: string; password: string },
    context: { pgPool: Pool; req: Request; res: Response }
  ) => {
    const { email, password } = args;
    // const validationErrors: {
    //   emailInput?: "Incorrect email provided";
    //   passwordInput?: "Incorrect password provided";
    // } = {};

    const client = await context.pgPool.connect();

    console.log("login resolver");

    try {
      await client.query("BEGIN");

      const userExistQuery = `
                SELECT 
                    users_login.hash
                FROM
                    users_login
                WHERE
                    users_login.email = '${email}'
            `;

      const { rows }: QueryResult<{ hash: string }> = await client.query(
        userExistQuery
      );

      if (!rows[0])
        throw new UserInputError("Failed to login due to validation error", {
          type: "EMAIL_NOT_IN_USE",
        });

      // if (!rows[0]) validationErrors.emailInput = "Incorrect email provided";

      // if(Object.keys(validationErrors).length) throw new UserInputError(
      //   "Failed to login due to validation errors",
      //   { validationErrors }
      // )

      // console.log("passed valid user check");

      const isPasswordValid = await compare(password, rows[0].hash);

      if (!isPasswordValid)
        throw new UserInputError("Failed to login due to validation error", {
          type: "INCORRECT_PASSWORD",
        });
      // if (!isPasswordValid) validationErrors.passwordInput = "Incorrect password provided";

      // if(Object.keys(validationErrors).length) throw new UserInputError(
      //   "Failed to login due to validation errors",
      //   { validationErrors }
      // )

      // console.log("passed valid password check");

      const userLoginDataQuery = `
                SELECT 
                    users_login.user_id,
                    users_info.first_name,
                    users_info.avatar_link
                FROM 
                    users_login
                JOIN 
                    users_info
                ON
                    users_login.user_id = users_info.user_info_id
                WHERE
                    users_login.email = '${email}';
            `;

      const {
        user_id,
        first_name,
        avatar_link,
      }: {
        user_id: number;
        first_name: string;
        avatar_link: string;
      } = await client.query(userLoginDataQuery).then(({ rows }) => rows[0]);

      const accessToken = generateAccessToken(user_id);
      const refreshToken = generateRefreshToken(user_id);

      const storeRefreshTokenQuery = `
                UPDATE users_login
                SET 
                    refresh_token = '${refreshToken}'
                WHERE 
                    user_id = ${user_id}
                RETURNING 
                    refresh_token;
            `;

      const {
        refresh_token: storedRefreshToken,
      }: { refresh_token: string } = await client
        .query(storeRefreshTokenQuery)
        .then(({ rows }) => rows[0]);

      if (storedRefreshToken !== refreshToken)
        throw new Error("Unable to login. Please try again");

      // console.log("passed created refresh token check");

      await client.query("COMMIT");

      context.res.cookie("refreshToken", refreshToken, {
        expires: new Date(new Date().setHours(new Date().getHours() + 240)),
        httpOnly: true,
      });

      return {
        first_name: first_name,
        avatar_link: avatar_link,
        access_token: accessToken,
      };
    } catch (error) {
      console.log(error);
      await client.query("ROLLBACK");
      return error;
    } finally {
      client.release();
    }
  },

  register: async (
    parent: any,
    args: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
    },
    context: { pgPool: Pool; req: Request; res: Response }
  ) => {
    console.log("found client");

    const { email, password, first_name, last_name } = args;
    // const { email, password, first_name, last_name } = {
    //   email: "s@ssssssssssss",
    //   password: "s",
    //   first_name: "s",
    //   last_name: "s",
    // };
    const client = await context.pgPool.connect();

    try {
      await client.query("BEGIN");

      const isUserExistQuery = `
        SELECT 
          users_login.user_id
        FROM 
          users_login
        WHERE
          users_login.email = '${email}';
      `;

      const isUserExistResponse: QueryResult<{
        user_id: number;
      }> = await client.query(isUserExistQuery);

      if (isUserExistResponse.rows.length > 0)
        throw new UserInputError("This email address is already in use.", {
          type: "EMAIL_IN_USE",
        });

      const hashedPassword = await hash(password, 10);

      const registerUserLoginQuery = `
        INSERT INTO 
          users_login(email, hash)
        VALUES 
          (
            '${email}',
            '${hashedPassword}'
          )
        RETURNING
            user_id;
      `;

      const { user_id }: { user_id: number } = await client
        .query(registerUserLoginQuery)
        .then(({ rows }) => rows[0]);

      const accessToken = generateAccessToken(user_id);
      const refreshToken = generateRefreshToken(user_id);

      const insertRefreshTokenQuery = `
            UPDATE
              users_login
            SET 
              refresh_token = '${refreshToken}'
            WHERE
              email = '${email}';
      `;

      await client.query(insertRefreshTokenQuery);

      const registerUserInfoQuery = `
            INSERT INTO 
              users_info(user_info_id, first_name, last_name, avatar_link)
            VALUES
              (
                ${user_id},
                '${first_name}',
                '${last_name}',
                'https://api.adorable.io/avatars/225/abott@adorable'
              )
            RETURNING 
                first_name as registered_first_name,
                avatar_link as registered_avatar_link;
      `;

      const {
        registered_first_name,
        registered_avatar_link,
      } = await client.query(registerUserInfoQuery).then(({ rows }) => rows[0]);

      await client.query("COMMIT");

      context.res.cookie("refreshToken", refreshToken, {
        expires: new Date(new Date().setHours(new Date().getHours() + 240)),
        httpOnly: true,
      });

      return {
        first_name: registered_first_name,
        avatar_link: registered_avatar_link,
        access_token: accessToken,
      };
    } catch (error) {
      console.log(error);
      await client.query("ROLLBACK");
      return error;
    } finally {
      client.release();
    }
  },

  refreshAccessToken: async (
    parent: any,
    args: any,
    context: { pgPool: Pool; req: Request; res: Response }
  ) => {
    const { refreshToken } = <{ refreshToken?: string }>context.req.cookies;

    // console.log(refreshToken);

    if (!refreshToken)
      throw new AuthenticationError(
        "Your session has expired. Please login again"
      );

    const { userId } = <{ userId: number | undefined }>(
      verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET!)
    );

    // const { userId } = <{ userId: number | undefined }>(
    //   verify(refreshToken, "incorrect secret")
    // );

    if (!userId)
      throw new AuthenticationError("Unknown user. Please login again");

    const client = await context.pgPool.connect();

    try {
      await client.query("BEGIN");

      const getUserRefreshTokenQuery = `
        SELECT 
          users_login.refresh_token
        FROM 
          users_login
        WHERE
          user_id = ${userId}
      `;

      const { refresh_token: dbRefreshToken } = <
        { refresh_token: string | undefined }
      >await client.query(getUserRefreshTokenQuery).then(({ rows }) => rows[0]);

      // console.log("refresh token", refreshToken)
      // console.log("db token", dbRefreshToken)

      if (!dbRefreshToken)
        throw new AuthenticationError(
          "Your session has expired. Please login again."
        );

      if (refreshToken !== dbRefreshToken)
        throw new AuthenticationError(
          "Your session has expired. Please login again."
        );

      // console.log("passed comparison")

      const newAccessToken = generateAccessToken(userId);
      const newRefreshToken = generateRefreshToken(userId);

      // console.log("newAccessToken", newAccessToken);
      // console.log("newRefreshToken", newRefreshToken);

      const updateUserRefreshTokenQuery = `
          UPDATE users_login
          SET
            refresh_token = '${newRefreshToken}'
          WHERE 
            user_id = ${userId}
          RETURNING
            user_id,
            refresh_token;
      `;

      const tester = await client.query(updateUserRefreshTokenQuery);

      // console.log("here updated table:", tester.rows[0])

      const getUserInfoQuery = `
          SELECT 
            first_name,
            avatar_link
          FROM 
            users_info
          WHERE 
            user_info_id = ${userId}
      `;

      const { first_name: refreshFirstName, avatar_link: refreshAvatarLink } = <
        { first_name: string; avatar_link: string }
      >await client.query(getUserInfoQuery).then(({ rows }) => rows[0]);

      context.res.cookie("refreshToken", newRefreshToken, {
        expires: new Date(new Date().setHours(new Date().getHours() + 240)),
        httpOnly: true,
      });

      await client.query("COMMIT");

      return {
        first_name: refreshFirstName,
        avatar_link: refreshAvatarLink,
        access_token: newAccessToken,
      };
    } catch (error) {
      console.log(error);
      await client.query("ROLLBACK");
      return error;
    } finally {
      client.release();
    }
  },

  logout: async (
    parent: any,
    args: any,
    context: { pgPool: Pool; req: Request; res: Response }
  ) => {
    const {
      req: { user },
    } = context;

    if (!user) throw new AuthenticationError("User is already logged out");

    const client = await context.pgPool.connect();

    try {
      await client.query("BEGIN");

      const LOGOUT_QUERY = `
        UPDATE users_login
        SET 
          refresh_token = 'd'
        WHERE 
          user_id = ${user.userId} 
      `;

      await client.query(LOGOUT_QUERY);

      context.res.cookie("refreshToken", "", {
        expires: new Date(new Date().setHours(new Date().getHours() - 240)),
        httpOnly: true,
      });

      await client.query("COMMIT");

      return true;
    } catch (error) {
      console.log(error);
      await client.query("ROLLBACK");
      return false;
    } finally {
      client.release();
    }
  },

  newUser: async (
    parent: any,
    args: newUserArgs,
    context: { pgPool: Pool; req: Request; res: Response }
  ) => {
    // console.log("inside mutation");

    const {
      req: { user },
    } = context;

    if (user === null)
      throw new AuthenticationError("Please login to add a new profile");

    const {
      email,
      password,
      first_name,
      last_name,
      country,
      city,
      website,
      age,
      hobbies,
      avatar_link,
    } = args;

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

      console.log({
        ...users_loginInsert.rows[0],
        ...users_infoInsert.rows[0],
      });

      console.log(user);

      return {
        ...users_loginInsert.rows[0],
        ...users_infoInsert.rows[0],
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.log(error);
    } finally {
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
