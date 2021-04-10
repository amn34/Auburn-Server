const express = require('express')
const app = express()
require('dotenv').config()

app.get("/:city/:state", (request, response) => {

    const city = request.params.city
    const state = request.params.state
    const countyCode = getCountyCode(city, state)
    // make a call to the covidActNow api and return the data we need
    const covidURL = `https://api.covidactnow.org/v2/county/${countyCode}.json?apiKey=${process.env.COVIDAPI}`
    // get api data stuff here 


    // store used data in here
    const result = {
        "new-cases" : "",
        "deaths": "",
        "tot-cases": "",
        "tot-deaths" : "",
        "infection-rate": "",
        "positive-test-rate": "",
        "percent-vaccinated": "",
        "vulnerability-level": ""
    }

    response.send(result)
})

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on ' + (process.env.PORT || 5000))
})

function getCountyCode(city, state) {




    return "01081"; //default auburn,alabama county code
}