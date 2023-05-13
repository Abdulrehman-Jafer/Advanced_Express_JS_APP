const http = require("node:http")
const {requestHandler} = require("./01-routes")
const Port = 8080
const Host = "127.0.0.1"



const server = http.createServer(requestHandler)  

server.listen({host:Host,port:Port},()=>{
    console.log(`${Host}:${Port}`)
})