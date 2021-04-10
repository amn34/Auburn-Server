const express = require('express')
const app = express()
const fetch = require("node-fetch")

require('dotenv').config()

app.get("/:city/:state", async (request, response) => {

    const city = request.params.city
    const state = request.params.state
    const countyCode = getCountyCode(city, state)

    // make a call to the covidActNow api and return the data we need
    const covidURL = `https://api.covidactnow.org/v2/county/${countyCode}.json?apiKey=${process.env.COVIDAPI}`
    
    // get api data stuff here 
    const countyRequest = await fetch(covidURL);
    const countyData = await countyRequest.json()
    //console.log(countyData);

    // store used data in here
    const result = {
        "new-cases" : countyData.actuals.newCases,
        "new-deaths": countyData.actuals.newDeaths,
        "tot-cases": countyData.actuals.cases,
        "tot-deaths" : countyData.actuals.deaths,
        "infection-rate": countyData.metrics.infectionRate,
        "positive-test-rate": countyData.metrics.testPositivityRatio,
        "percent-vaccinated": countyData.metrics.vaccinationsCompletedRatio,
        "vaccines-administered": countyData.actuals.vaccinesAdministered,
        "vaccines-completed": countyData.actuals.vaccinationsCompleted,
        "vulnerability-level": countyData.riskLevels.overall,
    }

    response.send(result)
})

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on ' + (process.env.PORT || 5000))
})

function getCountyCode(city, state) {




    return "01081"; //default auburn,alabama county code
}