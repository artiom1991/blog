import express from "express"
import router from "./routes/routes.js"
import * as dotenv from "dotenv"
dotenv.config()
const app = express()
const port = process.env.PORT || 6969

app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(router)

app.listen(port, (error) => {
    error ? console.log(error) : console.log(`http://localhost:${port}`)
})
