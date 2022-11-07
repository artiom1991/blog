import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import router from "./routes/routes.js"
const app = express()
const port = process.env.PORT || 3000

app.use(router)
app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.listen(port, (error) => {
    error ? console.log(error) : console.log(`http://localhost:${port}`)
})