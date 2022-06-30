import mongoose from "mongoose";
import 'dotenv/config';
import config from "../utils/config.js";
import logger from '../middlewares/logger.js';


export const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose
    .connect(config.MONGO_URI, advancedOptions)
    .then((db) => logger.info("MongoDB conectada 😎👍"))
    .catch((err) => logger.error(err));
