import { User, Posts } from "../data/database.js"
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
    const decode = jwt.decode(req.cookies.token, { complete: true })

    if (decode !== null && decode.payload.permission === 'true') {
        res.redirect(`/user/${req.cookies.user}`)
    } else {
        res.render(createPath('index'), { title: "Main Page", header: "Hello my dear user" })
    }
})

router.get('/exit', (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
})


router.get('/user/:id', async (req, res) => {
    let userPosts = []
    const posts = await Posts.findAll({
        raw: true,
        where: { username: req.params.id }
    }).then(element => {
        userPosts.push(element)
    })
    const decode = jwt.decode(req.cookies.token, { complete: true })

    if (decode !== null && decode.payload.permission === 'true') {

        if (decode.payload.role === 'admin') {

            return res.render(createPath('user'), { title: "Main Page", header: req.params.id, posts: userPosts[0] })

        }

        if (decode.payload.role = 'user' && req.params.id === decode.payload.username) {

            return res.render(createPath('user'), { title: "Main Page", header: req.params.id, posts: userPosts[0] })
        }

        if (decode.payload.role = 'user' && req.params.id !== decode.payload.username) {
            let modifiedPosts = []
            userPosts[0].forEach(element => {
                if (element.hide !== 'hide') {
                    modifiedPosts.push(element)
                }
            })
            return res.render(createPath('user'), { title: "Main Page", header: req.params.id, posts: modifiedPosts })
        }

    } else {
        return res.redirect('/')
    }
})

router.get('/auth', (req, res) => {
    const decode = jwt.decode(req.cookies.token, { complete: true })
    if (decode !== null && decode.payload.permission === 'true') {
        res.redirect(`/user/${req.cookies.user}`)
    } else {
        res.render(createPath('auth'), { title: "Autorization", header: "Autorization page" })
    }
})

router.get('/users', async (req, res) => {
    const decode = jwt.decode(req.cookies.token, { complete: true })
    if (decode !== null && decode.payload.permission === 'true') {
        let allUsers = []
        const users = await User.findAll({
            raw: true,
        }).then(element => {
            element.forEach(element => {
                allUsers.push(element.username)
            })
        })
        res.render(createPath('users'), { title: "Autorization", header: "Autorization page", userlist: allUsers })
    } else {
        res.redirect("/")
    }
})

router.get('/reg', (req, res) => {
    const decode = jwt.decode(req.cookies.token, { complete: true })
    if (decode !== null && decode.payload.permission === 'true') {
        res.redirect('/user/:id')
    } else {
        res.render(createPath('reg'), { title: "Registration", header: "Registration page" })
    }

})

router.get('/createpost', (req, res) => {
    res.render(createPath('createpost'), { title: "Registration", header: "Registration page" })
})

router.get('/delete/post/:id', async (req, res) => {
    let id = req.params.id
    const decode = jwt.decode(req.cookies.token, { complete: true })
    if (decode !== null && decode.payload.permission === 'true') {
        const post = await Posts.findOne({
            raw: true,
            where: { id }
        }).then(async (el) => {
            await Posts.destroy({
                raw: true,
                where: { id }
            })
        })
        res.redirect('/')
    } else {
        res.send('404')
    }
})

router.post('/createpost', async (req, res) => {
    let hide = ""
    if (req.body.hiden !== "hide") {
        hide = "none"
    } else {
        hide = "hide"
    }
    let createPost = await Posts.create({
        username: req.cookies.user,
        post: req.body.post,
        title: req.body.title,
        hide: hide
    }).catch((error) => {
        console.log(error.parent.detail)
    })
    res.redirect('/')
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
            res.redirect(`/user/${user.username}`)
        } else {
            res.redirect('/auth')
        }
    } else {
        res.redirect('/auth')
    }
})

router.post('/reg', async (req, res) => {
    const { username, password, email, phonenumber, role } = req.body
    const passwordHashed = await bcrypt.hash(password, 8)
    let createUser = await User.create({
        username,
        password: passwordHashed,
        email,
        phonenumber,
        role: role
    }).catch((error) => {
        console.log(error.parent.detail)
    })
    if (createUser) {
        res.redirect('/user/:id')
    } else {
        res.redirect('/reg')
    }
})

router.use((req, res) => {
    res.render(createPath('404'), { title: "404" })
})

export default router