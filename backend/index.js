const express = require('express')
const app = express()
const port = 3000

// app.get('/', (req, res) => {
//   res.send("Hello World")
// })


app.get('/', (req,res) => {
    res.sendFile("C:/Users/hp/Documents/sih/City_Pulse/index.html")
})

app.get('/home', (req,res) => {
    res.sendFile("C:/Users/hp/Documents/sih/City_Pulse/home.html")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
