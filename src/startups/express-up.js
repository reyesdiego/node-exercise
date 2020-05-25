const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("../routes");

module.exports = async () => {
    const app = express();

    // Config
    app.disable("x-powered-by");
    app.use(cors());
    app.use(compression({ level: 1 }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(helmet());
    // api version 1
    app.use("/api-v1", routes);

    app.on("uncaughtException", () => {
        process.exit(2);
    });

    app.use((req, res, next) => {
        const err = new Error("Route Not Found in Grow API");
        err.status = 404;
        next(err);
    });

    try {
        await app.listen(3000);
        console.log(`API running on port ${3000}. (${process.version}) pid:${
            process.pid
            } - ${new Date()}`);
    } catch (err) {
        console.log("Error starting Blog app:" + err);
        process.exit(1);
    }

    return app;
};
