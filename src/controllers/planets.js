const axios = require('axios');
const { PlanetsService } = require('../services/planets');
const { PeopleService } = require('../services/people');


module.exports.get = async (req, res) => {
    try {
        const planetsService = PlanetsService({ axios, PeopleService });
        const result = await planetsService.getPlanets();
        res.send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

