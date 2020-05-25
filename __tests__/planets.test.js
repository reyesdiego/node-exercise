/* eslint-disable no-undef */
const { PlanetsService } = require('../src/services/planets');
const { PeopleService } = require('../src/services/people');
const { planetsCallOne, personOne, personTwo, personFive } = require('./mocks');

describe("PEOPLE", function () {
    test("Should return all the Planets with no errors", async function () {
        const axios = {
            get: {}
        };
        axios.get = jest.fn().mockImplementation((url) => {
            switch (url) {
                case 'https://swapi.dev/api/planets/':
                    return Promise.resolve({ data: planetsCallOne });
                case 'http://swapi.dev/api/people/1/':
                    return Promise.resolve({ data: personOne });
                case 'http://swapi.dev/api/people/2/':
                    return Promise.resolve({ data: personTwo });
                case 'http://swapi.dev/api/people/5/':
                    return Promise.resolve({ data: personFive });
                default:
                    return Promise.reject(new Error('not found'));
            }
        });
        const planetsService = PlanetsService({ axios, PeopleService });
        const result = await planetsService.getPlanets();
        expect(result).toHaveLength(3);
        // expected 1 call to planets endpoint and 6 times to people (2 by planet)
        expect(axios.get).toBeCalledTimes(7);
        expect(axios.get).toHaveBeenLastCalledWith('http://swapi.dev/api/people/5/');
    });
});
