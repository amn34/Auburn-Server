const { request, response } = require('express')
const express = require('express')
const app = express()
const fetch = require("node-fetch")
const cities = require('all-the-cities')
const cors = require('cors')

require('dotenv').config()
app.use(cors())


app.get("/", (request, response) => {
    response.send("Welcome to the CovidStats API!");
})

app.get("/:state", async (request, response) => {
    const state = request.params.state.toUpperCase()
    const covidStateURL = `https://api.covidactnow.org/v2/state/${state}.json?apiKey=${process.env.COVIDAPI}`
    const covidData = await getCovidData(covidStateURL).catch(function() {})
    response.send(covidData);
})

app.get("/:state/:city", async (request, response) => {
    const city = request.params.city
    const state = request.params.state
    const countyCode = await getCountyCode(city, state).catch(function() {})
    const covidURL = `https://api.covidactnow.org/v2/county/${countyCode}.json?apiKey=${process.env.COVIDAPI}`
    const covidData = await getCovidData(covidURL).catch(function() {})
    response.send(covidData)
})

app.listen(process.env.PORT || 8080, () => {
    console.log('Server is running on ' + (process.env.PORT || 8080))
})

/**
 * Get the required covid data for the application
 * 
 * @param { JSON } data - The data which holds all covid statistics from covidactnow.org
 * @returns A JSON object containing the statistics in use for the applications
 */
async function getCovidData(covidURL) {
    const dataRequest = await fetch(covidURL).catch(function() {})
    const data = await dataRequest.json().catch(function() {})

    return {
        "new-cases": data.actuals.newCases,
        "new-deaths": data.actuals.newDeaths,
        "tot-cases": data.actuals.cases,
        "tot-deaths": data.actuals.deaths,
        "infection-rate": data.metrics.infectionRate,
        "positive-test-rate": data.metrics.testPositivityRatio,
        "percent-vaccinated": data.metrics.vaccinationsCompletedRatio,
        "vaccines-administered": data.actuals.vaccinesAdministered,
        "vaccines-completed": data.actuals.vaccinationsCompleted,
        "vulnerability-level": data.riskLevels.overall,
    }
}

async function getCountyCode(cityName, stateName) {
    const matches = cities.filter(city =>
        city.name.toLowerCase() === cityName.toLowerCase() && 
        city.adminCode.toLowerCase() === stateName.toLowerCase()
    )
    const latlong = matches[0].loc.coordinates
    const countyCodeURL = `https://geo.fcc.gov/api/census/area?lat=${latlong[1]}&lon=${latlong[0]}&format=json`
    const response = await fetch(countyCodeURL).catch(function() {})
    const data = await response.json().catch(function() {})

    return data.results[0].county_fips || "01081"; //default auburn,alabama county code
}
