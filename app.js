const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fileUpload = require('express-fileupload')

const route = require('./routes/users.routes')
const friends = require('./routes/friendship.routes')
const posts = require('./routes/posts.routes')
const comment = require('./routes/comments.routes')
const notification = require('./routes/notification.routes')

const app = express()

app.use(cors())
app.use(express())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(morgan('dev'))
app.use(fileUpload())

app.use("/users",route)
app.use('/friends',friends)
app.use('/post', posts)
app.use("/comments",comment)
app.use("/notification",notification)


app.use((req,res,next)=>{
    res.status(400).json({
        message: "400 Route Not Found!"
    })
})

app.use((err,req,res,next)=>{
    res.status(500).json({
        message: "500 Something broken!"
    })
})

module.exports = app