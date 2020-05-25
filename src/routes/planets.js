const planetsController = require("../controllers/planets");
module.exports = router => {
    const route = router.route("/planets");
    route.get(planetsController.get);
    return router;
};
