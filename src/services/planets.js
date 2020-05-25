module.exports.PlanetsService = injections => {

    const getPlanets = GetPlanets.bind(null, injections);

    return { getPlanets };

    // private functions
    async function GetPlanets({ axios, PeopleService }) {
        try {
            // rowsPerPage should be passed by param
            const rowsPerPage = 10;
            let result = [];
            const runs = [];

            const response = await planets({ axios }, 'https://swapi.dev/api/planets/');
            const count = response.data.count;
            const resolvedPlanets = await resolvePeople({ axios, PeopleService }, response.data.results);
            result = result.concat(resolvedPlanets);

            const cnt = parseInt(count / rowsPerPage, 10) + (count % rowsPerPage ? 1 : 0);
            // eslint-disable-next-line no-plusplus
            for (let idx = 2; idx <= cnt; idx++) {
                runs.push(`https://swapi.dev/api/planets/?page=${idx}`);
            }
            const runsResult = await Promise.all(runs.map(async run => {
                const response = await planets({ axios }, run);
                return await resolvePeople({ axios, PeopleService }, response.data.results);
            }));
            result = result.concat(...runsResult.map(item => item));

            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }
    // The Start Wars API is very friendly, and provides good data for pagination, so the first approach taken was
    // to take advantage of the properties provided in every response an complete the whole list of planets. This
    // way is was not the best since it was calling every page is serie but I tried anywaay and the response time was
    // more than 15 seconds, It was spected but not that much. With the implemented GetPlanets it is taking 5 or 6 seconds
    // which I would try to keep improving it

    // async function GetPlanets({ axios, PeopleService }) {
    //     try {
    //         let result = [];
    //         let response = await planets({ axios }, 'https://swapi.dev/api/planets/');
    //         const resolvedPlanets = await resolvePeople({ axios, PeopleService }, response.data.results);
    //         result = result.concat(resolvedPlanets);

    //         while (response.data.next) {
    //             response = await planets({ axios }, response.data.next);
    //             const resolvedPlanets = await resolvePeople({ axios, PeopleService }, response.data.results);
    //             result = result.concat(resolvedPlanets);
    //         }
    //         return result;
    //     } catch (err) {
    //         throw new Error(err.message);
    //     }
    // }

    async function planets({ axios }, url) {
        return axios.get(url);
    }

    async function resolvePeople({ axios, PeopleService }, planets) {
        // may be collecting all the people (unwind the people) in an array an and having only One Promise.all here we could speed up the function.
        // I image that every person can be only in one planet, other way we could cache people
        const peopleService = PeopleService({ axios });
        return Promise.all(planets.map(async planet => ({
            ...planet,
            residents: (await Promise.all(planet.residents.map(resident => peopleService.getPerson(resident)))).map(person => person.name)
        })));
    }
};
