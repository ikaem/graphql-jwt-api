import { Pool } from "pg";

export default {
    country: async(parent: { user_id: number }, args: any, context: { pgPool: Pool }) => {
        console.log(typeof parent.user_id);
        console.log(parent.user_id);
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

            const getUserCountryRes = await context.pgPool.query(getUserCountryQuery);
            return getUserCountryRes.rows[0];
        }
        catch(error) {
            console.log(error);
        }
    }
}