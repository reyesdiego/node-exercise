const express = require("express");
const router = express.Router();
const people = require("./people");
const planets = require("./planets");

router.route("/").get((req, res) => {
    res.send({ hi: "there" });
});

people(router);
planets(router);

module.exports = router;
