import { config } from "../utils/config.js";

export const optionsSQLiteMensajes = {
    client: config.SQLITE_CLIENT,
    connection: {
        filename: config.MENSAJES_SQLITE_DB,
    },
    useNullAsDefault: true,
};

export const optionsSQLiteProductos = {
    client: config.SQLITE_CLIENT,
    connection: {
        filename: config.PRODUCTOS_SQLITE_DB,
    },
    useNullAsDefault: true,
};
