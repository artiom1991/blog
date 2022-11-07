import { Router } from "express"
import path from "path"
import { fileURLToPath } from "url"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const createPath = (page) => path.resolve(__dirname, '../views', `${page}.ejs`)
const router = new Router()

router.get('/', (req, res) => {
    res.render(createPath('index'), { title: "Main Page", header: "Hello my dear user" })
})
router.post('/', (req, res) => {
    res.send(req.body)
})

router.get('/auth', (req, res) => {
    res.render(createPath('auth'), { title: "Autorization", header: "Autorization page" })
})

router.post('/auth', (req, res) => {
    res.send(req.body)
})

router.get('/reg', (req, res) => {
    res.render(createPath('reg'), { title: "Registration", header: "Registration page" })
})

router.post('/reg', (req, res) => {
    res.send(req.body)
})

export default router