module.exports.PeopleService = injections => {

    const getPeople = GetPeople.bind(null, injections);
    const getPerson = GetPerson.bind(null, injections);

    return { getPeople, getPerson };

    // private functions
    async function GetPeople({ axios }, sortBy) {
        try {
            // rowsPerPage should be passed by param
            const rowsPerPage = 10;
            let result = [];
            const runs = [];

            const response = await people({ axios }, 'https://swapi.dev/api/people/');
            const count = response.data.count;
            result = result.concat(response.data.results);

            const cnt = parseInt(count / rowsPerPage, 10) + (count % rowsPerPage ? 1 : 0);
            // eslint-disable-next-line no-plusplus
            for (let idx = 2; idx <= cnt; idx++) {
                runs.push(`https://swapi.dev/api/people/?page=${idx}`);
            }
            const runsResult = await Promise.all(runs.map(run => people({ axios }, run)));
            result = result.concat(...runsResult.map(item => item.data.results));

            if (sortBy && sortBy.field) {
                // eslint-disable-next-line no-confusing-arrow
                result = result.sort((one, two) => one[sortBy.field] > two[sortBy.field] ? 1 : -1);
            }
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

    // The Start Wars API is very friendly, and provides good data for pagination, so the first approach taken was
    // to take advantage of the properties provided in every response an complete the whole list of People. This
    // way is was not the best since it was calling every page is serie but I tried anywaay and the response time was
    // more than 10 seconds, It was spected but not that much. With the implemented GetPeople less than 4 seconds
    // which I would try to keep improving it

    // async function GetPeople({ axios }, sortBy) {
    //     try {
    //         let result = [];
    //         let response = await people({ axios }, 'https://swapi.dev/api/people/');
    //         result = result.concat(response.data.results);

    //         while (response.data.next) {
    //             response = await people({ axios }, response.data.next);
    //             result = result.concat(response.data.results);
    //         }
    //         if (sortBy && sortBy.field) {
    //              // eslint-disable-next-line no-confusing-arrow
    //              result = result.sort((one, two) => one[sortBy.field] > two[sortBy.field] ? 1 : -1);
    //         }
    //         return result;
    //     } catch (err) {
    //         throw new Error(err.message);
    //     }
    // }

    async function people({ axios }, url) {
        return axios.get(url);
    }

    async function GetPerson({ axios }, url) {
        try {
            const response = await people({ axios }, url);
            return response.data;
        } catch (err) {
            throw new Error(err.message);
        }
    }
};
