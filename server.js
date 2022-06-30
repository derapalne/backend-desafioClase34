import "dotenv/config";

// [ --------- IMPORTS LOCALES --------- ] //
import ArchivadorProductos from "./src/daos/archivadorDaoProductos.js";
import { optionsMariaDB } from "./src/options/mariaDB.js";
import ArchivadorMensajes from "./src/daos/archivadorDaoMensajes.js";
import { optionsSQLiteMensajes, optionsSQLiteProductos } from "./src/options/SQLite3.js";
import Mocker from "./src/utils/mocker.js";
const mocker = new Mocker();
import inicializarProductos from "./src/utils/init.js";
// >>>>>Routers
import routerMain from "./src/routes/main.routes.js";
import routerRandom from "./src/routes/randomsRoute.js";
import config from "./src/utils/config.js";
// >>>>>Logger
import logger from './src/middlewares/logger.js'

// [ --------- MIDDLEWARE --------- ] //

import { isLogged } from "./src/middlewares/isLogged.js";

// [ --------- IMPORTS NPM --------- ] //

// >>>>>Express & Session
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
// >>>>>Socket
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
// >>>>>MongoDB
import MongoStore from "connect-mongo";
import { advancedOptions } from "./src/daos/daoUsuariosMongoDB.js";
// >>>>>Passport
import "./src/middlewares/local-auth.js";
import passport from "passport";
// >>>>>Flash
import flash from "connect-flash";
// >>>>>Cluster
import cluster from "cluster";
import os from "os";
const numCpus = os.cpus().length;
// >>>>>Gzip
import compression from "compression";

// [ --------- CONFIGURACION --------- ] //

// >>>>>Servidor
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

// >>>>>Middleware, Cookies y Sesiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: config.MONGO_URI,
            mongoOptions: advancedOptions,
        }),
        secret: "andywarhol",
        resave: false,
        rolling: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 600000,
        },
    })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());

//>>>>>Routers
app.use("/api/random", routerRandom);
app.use("/", routerMain);

app.use((err, req, res, next) => {
    app.locals.registerMessage = req.flash("registerMessage");
    app.locals.loginMessage = req.flash("loginMessage");
    app.locals.email = req.flash("email");
});

// >>>>>DBs
const archMensajes = new ArchivadorMensajes("chat", optionsSQLiteMensajes, logger);
archMensajes.chequearTabla();
const archProductos = new ArchivadorProductos("productos", optionsSQLiteProductos, logger);
archProductos.chequearTabla();

// >>>>>Motor de plantillas
app.use(express.static("./public"));
app.set("views", "./src/views");
app.set("view engine", "ejs");

// >>>>>Inicializador : descomentar si es necesario

//inicializarProductos(archProductos);

// [ --------- RUTAS QUE REQUIEREN DBs --------- ] //

app.get("/", logger.logRoute, isLogged, async (req, res) => {
    try {
        const productos = await archProductos.getAll();
        const mensajes = await archMensajes.read();
        res.status(200).render("productosForm", {
            prods: productos,
            mensajes: mensajes,
            email: req.user.email,
        });
    } catch (e) {
        res.status(500).send(e);
    }
});

app.get("/api/productos-test", logger.logRoute, async (req, res) => {
    try {
        const productos = mocker.generarProductos(5);
        const mensajes = await archMensajes.read();
        res.status(200).render("productosForm", {
            prods: productos,
            mensajes: mensajes,
        });
    } catch (e) {
        res.status(500).send(e);
    }
});

routerMain.get("/info", logger.logRoute, (req, res) => {
    const info = {
        args: process.argv.slice(2).join(" "),
        os: process.platform,
        nodeVersion: process.version,
        memory: process.memoryUsage().rss,
        path: process.execPath,
        pid: process.pid,
        folder: process.cwd(),
        numCpus: numCpus,
    };
    console.log({info});
    res.render("info", info);
});

app.use(logger.logUndefinedRoute);

// [ --------- CORRER EL SERVIDOR --------- ] //

if (config.MODO == "fork") {
    httpServer.listen(config.PORT, () => logger.info("Lisstooooo " + config.PORT));
} else if (modo == "cluster") {
    if (cluster.isPrimary) {
        logger.info(`Proceso primario corriendo: ${process.pid} 👍👍`);
        for (let i = 0; i < numCpus; i++) {
            cluster.fork();
        }
        cluster.on("listening", (worker, address) => {
            logger.info(`Proceso secundario ${worker.process.pid} escuchando en puerto ${address.port}`);
        });
    } else {
        httpServer.listen(PORT, () => logger.info("Lisstooooo " + config.PORT));
    }
}

// [ --------- SOCKET --------- ] //

io.on("connection", async (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id.substring(0, 4)}`);
    socket.on("productoAgregado", async (producto) => {
        // console.log(producto);
        const respuestaApi = await archProductos.save(producto);
        console.log({ respuestaApi });
        // respuestaApi es el ID del producto, si no es un número, es un error (ver API)
        if (!respuestaApi) {
            socket.emit("productoInvalido", { error: "Producto inválido" });
        } else {
            console.log(respuestaApi, "producto valido");
            io.sockets.emit("productosRefresh", await archProductos.getAll());
        }
    });

    socket.on("mensajeEnviado", async (mensaje) => {
        await archMensajes.save(mensaje);
        io.sockets.emit("chatRefresh", mensaje);
    });
});
