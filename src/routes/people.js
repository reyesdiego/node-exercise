const peopleController = require("../controllers/people");
module.exports = router => {
    const route = router.route("/people");
    route.get(peopleController.get);
    return router;
};
