import { User } from "../data/database.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Router } from "express"
import path from "path"
import { fileURLToPath } from "url"
import cookieParser from "cookie-parser"

dotenv.config()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const createPath = (page) => path.resolve(__dirname, '../views', `${page}.ejs`)
const router = new Router()
router.use(cookieParser())

router.get('/', (req, res) => {
    console.log(req.cookies)
    const decode = jwt.decode(req.cookies.token, { complete: true })
    console.log(decode)
    if (decode !== null && decode.payload.permission === 'true') {
        console.log(decode)
        res.redirect('/user/:id')
        // res.render(createPath('auth'), { title: "Autorization", header: "Autorization page" })
    } else {
        res.render(createPath('index'), { title: "Main Page", header: "Hello my dear user" })
    }
})

router.get('/exit', (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
})

router.get('/user/:id', (req, res) => {
    console.log(req.cookies.user)
    res.render(createPath('user'), { title: "Main Page", header: req.cookies.user })
    console.log(req.cookies)
})

router.get('/auth', (req, res) => {
    const decode = jwt.decode(req.cookies.token, { complete: true })
    if (decode !== null && decode.payload.permission === 'true') {
        console.log(decode)
        res.redirect('/user/:id')
    } else {
        res.render(createPath('auth'), { title: "Autorization", header: "Autorization page" })
    }
})

router.post('/', (req, res) => {

    res.send(req.body)

})

router.get('/reg', (req, res) => {
    const decode = jwt.decode(req.cookies.token, { complete: true })
    if (decode !== null && decode.payload.permission === 'true') {
        console.log(decode)
        res.redirect('/user/:id')
    } else {
        res.render(createPath('reg'), { title: "Registration", header: "Registration page" })
    }

})


router.post('/auth', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({
        raw: true,
        where: { username }
    })
    if (user) {
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        const token = jwt.sign({
            username: user.username,
            role: user.role,
            permission: `${isPasswordCorrect}`
        }, process.env.SECRET)
        res.cookie(`user`, `${user.username}`)
        res.cookie(`token`, `${token}`)

        if (isPasswordCorrect === true) {
            console.log("SUCCESS")
            res.redirect('/')

        } else {
            res.redirect('/auth')
            console.log("PROVAL")
        }


        const decode = jwt.decode(token, { complete: true })

        // console.log('verifiPass ', isPasswordCorrect)
        // console.log('user ', user)
        // console.log('token ', token)
        // console.log('decoded ', decode)
        // console.log('cookie ', req.cookies)

    } else {
        console.log('Kakaiato hueta')
        res.send('boroda')
    }




})

router.post('/reg', async (req, res) => {
    res.send(req.body)
    const { username, password, email, phonenumber } = req.body
    const passwordHashed = await bcrypt.hash(password, 8)
    User.create({
        username,
        password: passwordHashed,
        email,
        phonenumber,
        role: "user"
    }).catch((error) => {
        console.log(error.parent.detail)
    })
    console.log('New user: ', username, passwordHashed, email, phonenumber)

})

export default router