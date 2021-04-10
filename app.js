const express = require('express')
const app = express()


app.get("/", (request, response) => {
    response.send("hello")
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on ' + (process.env.PORT || 3000))
})