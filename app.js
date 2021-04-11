const { request, response } = require('express')
const express = require('express')
const app = express()
const fetch = require("node-fetch")
const cities = require('all-the-cities')

require('dotenv').config()

app.get("/:state", async (request, response) => {
    const state = request.params.state.toUpperCase()
    const covidStateURL = `https://api.covidactnow.org/v2/state/${state}.json?apiKey=${process.env.COVIDAPI}`
    const covidData = await getCovidData(covidStateURL);
    response.send(covidData);
})

app.get("/:state/:city", async (request, response) => {
    const city = request.params.city
    const state = request.params.state
    const countyCode = await getCountyCode(city, state)
    const covidURL = `https://api.covidactnow.org/v2/county/${countyCode}.json?apiKey=${process.env.COVIDAPI}`
    const covidData = await getCovidData(covidURL)
    response.send(covidData)
})

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on ' + (process.env.PORT || 5000))
})

/**
 * Get the required covid data for the application
 * 
 * @param { JSON } data - The data which holds all covid statistics from covidactnow.org
 * @returns A JSON object containing the statistics in use for the applications
 */
async function getCovidData(covidURL) {
    const dataRequest = await fetch(covidURL)
    const data = await dataRequest.json()

    return {
        "new-cases" : data.actuals.newCases,
        "new-deaths": data.actuals.newDeaths,
        "tot-cases": data.actuals.cases,
        "tot-deaths" : data.actuals.deaths,
        "infection-rate": data.metrics.infectionRate,
        "positive-test-rate": data.metrics.testPositivityRatio,
        "percent-vaccinated": data.metrics.vaccinationsCompletedRatio,
        "vaccines-administered": data.actuals.vaccinesAdministered,
        "vaccines-completed": data.actuals.vaccinationsCompleted,
        "vulnerability-level": data.riskLevels.overall,
    }
}

async function getCountyCode(cityName, stateName) {

    const latlong = cities.filter(city => city.name.match(cityName))[0].loc.coordinates
    console.log(latlong)
    const countyCodeURL = "https://geo.fcc.gov/api/census/area?lat=38.26&lon=-77.51&format=json"
    const response = await fetch(countyCodeURL)
    const data = await response.json()

    return data.results[0].county_fips || "01081"; //default auburn,alabama county code
}