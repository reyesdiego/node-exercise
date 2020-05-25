const axios = require('axios');
const { PeopleService } = require('../services/people');

module.exports.get = async (req, res) => {
    try {
        const sortBy = {};
        if (req.query.sortBy && ['name', 'mass', 'height'].includes(req.query.sortBy)) {
            sortBy.field = req.query.sortBy;
        }
        const peopleService = PeopleService({ axios });
        const result = await peopleService.getPeople(sortBy);
        res.send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

