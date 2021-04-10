const express = require('express')
const app = express()


app.get("/:location?", (request, response) => {
    // make a call to the covidActNow api and return the data we need
    const location = request.params.location ? request.params.location : 'Alabama';


    // get api data stuff here 

    // store used data in here
    res = {
        "new-cases" : "",
        "deaths": "",
        "tot-cases": "",
        "tot-deaths" : "",
        "infection-rate": "",
        "positive-test-rate": "",
        "percent-vaccinated": "",
        "vulnerability-level": ""
    }

    response.send(JSON.stringify(res))
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on ' + (process.env.PORT || 3000))
})