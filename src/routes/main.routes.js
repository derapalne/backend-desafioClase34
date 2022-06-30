
import express from "express";
const { Router } = express;
const routerMain = Router();
import passport from "passport";
import logger from '../middlewares/logger.js'
import { isLogged } from "../middlewares/isLogged.js";

// [---RUTAS---]

routerMain.get("/login", logger.logRoute, (req, res) => {
    try {
        if (req.isAuthenticated()) {
            res.redirect("/");
        } else {
            res.status(200).render("login");
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

routerMain.get("/login-error", logger.logRoute, (req, res) => {
    try {
        res.status(403).render("login-error");
    } catch (e) {
        res.status(500).send(e);
    }
});

routerMain.get("/register-error", logger.logRoute, (req, res) => {
    try {
        res.status(403).render("register-error");
    } catch (e) {
        res.status(500).send(e);
    }
});

routerMain.get("/register", logger.logRoute, (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).redirect("/");
    }
    res.status(200).render("register");
});

routerMain.get("/datos", logger.logRoute, (req, res) => {
    res.json(req.session);
});

routerMain.post(
    "/register",
    logger.logRoute,
    passport.authenticate("local-register", {
        successRedirect: "/",
        failureRedirect: "/register-error",
        passReqToCallback: true,
    }),
    (req, res) => {}
);

routerMain.post(
    "/login",
    logger.logRoute,
    passport.authenticate("local-login", {
        successRedirect: "/",
        failureRedirect: "/login-error",
        passReqToCallback: true,
    }),
    (req, res) => {}
);

routerMain.post("/logout", logger.logRoute, isLogged, (req, res) => {
    try {
        const email = req.user.email;
        req.session.destroy((err) => {
            res.status(200).render("logout", { nombreUsuario: email });
        });
    } catch (e) {
        res.status(500).send(e);
    }
});

export default routerMain;