import { Sequelize, DataTypes } from "sequelize"
import * as dotenv from "dotenv"
dotenv.config()
const sequelize = new Sequelize('blog', 'postgres', process.env.DB_PASSWORD, {
    dialect: 'postgres',
    define: {
        timestamps: false
    }
})

const User = sequelize.define('blog_user', {
    username: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING
    },
    phonenumber: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING
    }
})

const Posts = sequelize.define('blog_posts', {
    username: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
    },
    post: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    hide: {
        type: DataTypes.STRING
    }
})

sequelize.sync()
    .then(() => {
        console.log('Database working')
    })
    .catch(e => console.log('error'))

export { User, Posts }