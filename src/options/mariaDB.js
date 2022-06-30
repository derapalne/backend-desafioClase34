import { config } from "../utils/config.js";

export const optionsMariaDB = {
    client: "mysql",
    connection: {
        host: config.MARIADB_HOST,
        user: config.MARIADB_USER,
        password: config.MARIADB_PASSWORD,
        database: config.MARIADB_DB,
    },
};
