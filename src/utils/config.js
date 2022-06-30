import parseArgs from "minimist";
import "dotenv/config";

const args = parseArgs(process.argv.slice(2));

export default {
    MODO: args.modo || process.env.SERVER_MODE,
    PORT: args.port || process.env.PORT,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017",
    SESSION_SECRET: process.env.SESSION_SECRET || "calamardo",
    SQLITE_CLIENT: process.env.SQLITE_CLIENT || "sqlite3",
    MARIADB_HOST: process.env.MARIADB_HOST || "localhost",
    MARIADB_USER: process.env.MARIADB_USER || "root",
    MARIADB_PASSWORD: process.env.MARIADB_PASSWORD || "",
    MENSAJES_SQLITE_DB: process.env.MENSAJES_SQLITE_DB || "./src/DB/mensajes.sqlite",
    PRODUCTOS_SQLITE_DB: process.env.PRODUCTOS_SQLITE_DB || "./src/DB/productos.sqlite",
    MARIADB_DB: process.env.MARIADB_DB || "desafioClase16",
};
