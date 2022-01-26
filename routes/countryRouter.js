//create express router
const countryRouter = require('express').Router();
const { request, response } = require('express');
const querystring = require('querystring');
const { body, validationResult, check } = require('express-validator')

//get country data
const countriesData = require('../countriesData');

//create country validation chain to validate data during POST and 
const createValidationchain = [
    body('name').isAlpha(),
    body('alpha2Code').isAlpha(),
    body('alpha3Code').isAlpha()
]

countryRouter.get('/', (request, response) => {
    // //get querystring 
    const isSorting = request.query.sort;

    //if isSorting=true, sort the countries alphabetically
    if (isSorting !== undefined) {
        if (isSorting === "true") {

            const sortedarray = [...countriesData].sort((currentName, previousName) => {
                if (currentName.name.toUpperCase() < previousName.name.toUpperCase()) {
                    return -1
                }

                if (currentName.name.toUpperCase() > previousName.name.toUpperCase()) {
                    return 1
                }

                //if name equals
                return 0;

            })

            //filter country based on query visited
            if (request.query.visited === "true") {
                const visitedCountry = sortedarray.filter(country => country.visited === true)
                if (visitedCountry.length != 0) {
                    response.send(visitedCountry)
                }
                else {
                    response.send('No country is available which is visited');
                }

            } else if (request.query.visited === "false") {
                const visitedCountry = sortedarray.filter(country => country.visited === false)
                if (visitedCountry.length != 0) {
                    response.send(visitedCountry)
                }
                else {
                    response.send('No country is available which is not visited');
                }

            } else {
                response.send(sortedarray)
            }


        } else {

            //filter country based on query visited
            if (request.query.visited === "true") {
                const visitedCountry = countriesData.filter(country => country.visited === true)
                if (visitedCountry.length != 0) {
                    response.send(visitedCountry)
                }
                else {
                    response.send('No country is available which is visited');
                }

            } else if (request.query.visited === "false") {
                const visitedCountry = countriesData.filter(country => country.visited === false)
                if (visitedCountry.length != 0) {
                    response.send(visitedCountry)
                }
                else {
                    response.send('No country is available which is not visited');
                }

            } else {
                response.send(countriesData)
            }


            // response.send(countriesData);
        }
    }
    else {
        response.send(countriesData);
    }
})


//yacine method
// countryRouter.get('/', (request, response) => {
//     const compareAlphabetically = (a, b) => {
//         if (a.name > b.name) return 1;
//         if (b.name > a.name) return -1;
//         return 0;
//     };

//     if (request.query.sort === "true") {
//         const sortedCountries = [...countriesData].sort(compareAlphabetically);
//         response.json(sortedCountries);
//     } else {
//         response.json(countriesData);
//     }
// })

//post new country
countryRouter.post('/',
    //validate data
    createValidationchain,
    (request, response) => {
        //if not valid data, send response
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }

        const newCountry = {
            id: countriesData[countriesData.length - 1].id + 1,
            name: request.body.name,
            alpha2Code: request.body.alpha2Code.toUpperCase(),
            alpha3Code: request.body.alpha3Code.toUpperCase(),
            visited: false
        }

        //if country exist, it will give the index, otherwise it will give -1 
        const index = countriesData.findIndex(country => country.alpha2Code === newCountry.alpha2Code && country.alpha3Code === newCountry.alpha3Code)

        //if index is -1, country does not exist
        //so perform post operation
        if (index < 0) {
            countriesData.push(newCountry);
            response.status(200);
            response.send(countriesData);

        } else {
            response.send('country already exist')
        }
    })

//get country by code
countryRouter.get('/:code', (request, response) => {
    if (request.params.code !== undefined) {
        const country = countriesData.find(ct => ct.alpha2Code.toUpperCase() === request.params.code.toUpperCase() || ct.alpha3Code.toUpperCase() === request.params.code.toUpperCase())
        if (country !== undefined) {
            response.send(country)
        } else {
            response.send("No country found with specified code")
        }
    }
})

//edit country info based on it's code
countryRouter.put('/:code',
    //validate data
    createValidationchain,
    // body('name').isString(),
    // createValidationchain(),
    // body('alpha3Code').isAlpha(),
    (request, response) => {
        //if not valid data, send response
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        if (request.params.code !== undefined) {
            const country = countriesData.find(ct => ct.alpha2Code.toUpperCase() === request.params.code.toUpperCase() || ct.alpha3Code.toUpperCase() === request.params.code.toUpperCase())
            if (country !== undefined) {
                country.name = request.body.name;
                country.alpha2Code = request.body.alpha2Code.toUpperCase();
                country.alpha3Code = request.body.alpha3Code.toUpperCase();
                //country.visited=request.body.visited
                response.send(country)
            } else {
                response.send("No country found with specified code")
            }
        }

    })

//delete country
//get country by code
countryRouter.delete('/:code', (request, response) => {
    if (request.params.code !== undefined) {
        const country = countriesData.find(ct => ct.alpha2Code.toUpperCase() === request.params.code.toUpperCase() || ct.alpha3Code.toUpperCase() === request.params.code.toUpperCase())
        if (country !== undefined) {
            country.visited = true
            response.send(`Country deleted with code ${request.params.code}`)
        } else {
            response.send("No country found with specified code")
        }
    }
})

module.exports = countryRouter