import "dotenv/config";

export const optionsSQLiteMensajes = {
    client: process.env.SQLITE_CLIENT,
    connection: {
        filename: process.env.MENSAJES_SQLITE_DB,
    },
    useNullAsDefault: true,
};

export const optionsSQLiteProductos = {
    client: process.env.SQLITE_CLIENT,
    connection: {
        filename: process.env.PRODUCTOS_SQLITE_DB,
    },
    useNullAsDefault: true,
};
