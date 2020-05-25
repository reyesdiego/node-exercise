/* eslint-disable no-undef */
const { PeopleService } = require('../src/services/people');
const { peopleCallOne, peopleCallTwo } = require('./mocks');

describe("PEOPLE", function () {
    test("Should return all the People with no errors", async function () {
        const axios = {
            get: {}
        };
        axios.get = jest.fn().mockImplementation((url) => {
            switch (url) {
                case 'https://swapi.dev/api/people/':
                    return Promise.resolve({ data: peopleCallOne });
                case peopleCallOne.next:
                    return Promise.resolve({ data: peopleCallTwo });
                default:
                    return Promise.reject(new Error('not found'));
            }
        });
        const peopleService = PeopleService({ axios });
        const result = await peopleService.getPeople();
        expect(result).toHaveLength(11);
        expect(axios.get).toBeCalledTimes(2);
        expect(axios.get).toHaveBeenLastCalledWith(peopleCallOne.next);
    });
    test("Should return all the People ordered by Name", async function () {
        const axios = {
            get: {}
        };
        axios.get = jest.fn().mockImplementation((url) => {
            switch (url) {
                case 'https://swapi.dev/api/people/':
                    return Promise.resolve({ data: peopleCallOne });
                case peopleCallOne.next:
                    return Promise.resolve({ data: peopleCallTwo });
                default:
                    return Promise.reject(new Error('not found'));
            }
        });
        const peopleService = PeopleService({ axios });
        const result = await peopleService.getPeople({ field: 'name' });
        expect(result).toHaveLength(11);
        expect(axios.get).toBeCalledTimes(2);
        expect(axios.get).toHaveBeenLastCalledWith(peopleCallOne.next);
        expect(result[0]).toHaveProperty('name', '1Luke Skywalker');
    });
});

