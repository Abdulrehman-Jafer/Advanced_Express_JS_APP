const path = require('node:path')
const express = require('express')
const bodyParser = require('body-parser')
const { router : adminRoutes }= require('./routes/admin')
const shopRoutes = require('./routes/shop')
// const {engine} = require('express-handlebars') 


// I will stick to the pug engine


const app = express()
// whatevername we use here will be used as the file extension for that engine file
// no need to extend or what default layout will be used if we dont want to use the 
// default layout for a file we will have to send the layout key value as false for that specific file
// these configs are by default
// app.engine(
//     'handlebars',
//     engine({
//         layoutsDir:'./views/layouts',
//         defaultLayout:'main',
//         extname:'handlebars'})
//         ) // we need to add the engine like this into the express for using handlebars
// app.set('view engine','handlebars')
//we do not need to import to pub and avoid other stuff just simply do it
app.set('view engine','pug') // which engine to use for expressing dynamic data for dynamic rendering the html like react using like map
// app.set('view engine','ejs') // no need to import ejs engine also
app.set('views','./views') //where to find these templetate
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'public'))) // serves static files add specified the static files folder this middleware forward the request to the public folder
//We can add any static directory from where we want to pass the request

//app.use() allow us to add middleware like body-parser to parse the request body for us
// app.use((req,res,next)=>{
//     console.log('In the middleware!')
//     next() // we should call next so that It can pass to the next middleware
// })

app.use('/admin',adminRoutes) //using path filtering now any request starting with /admin will be forwarded to admin routes
app.use(shopRoutes)


app.use("*",(req,res,next)=>{
// res.status(404).send('<h1>Page Not Found 404</h1>')
// res.status(404).sendFile(path.join(__dirname,'views','404.html'),(err)=>err && console.log(err)) //already in the rootDir
res.status(404).render('404',{domTitle:'Page not Found'})
//The way we pass the data to the engine remains the same not matter which engine we are using
})


app.listen(8080,"127.0.0.1",()=>{
    console.log('Listening!')
})

// I have to learn about the mixins concept of the pub