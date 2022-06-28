import parseArgs from "minimist";
import "dotenv/config";

const args = parseArgs(process.argv.slice(2));

export default {
    MODO: args.modo || process.env.SERVER_MODE,
    PORT: args.port || process.env.PORT,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017",
};
