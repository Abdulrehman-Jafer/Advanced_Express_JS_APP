const fs = require("node:fs/promises")

const requestHandler = async (req,res) => {
    const url = req.url
    const method = req.method
    if(url === "/"){
        res.setHeader('Content-Type','text/html')
        res.write('<html>')
        res.write('<head><title>My First Page!</title></head>')
        res.write(`
        <body>
        <form action="/message" method="POST" >
        <input type="text" name="message"  />
        <button type="submit">send</button>
        </form>
        </body>`)
        res.write('</html>')
        return res.end()
    }
    if (url === "/message" && method == "POST"){
        const fileHandle = await fs.open('./01-server.txt','a')
        const writeStream = fileHandle.createWriteStream()
        const data = []
        req.on('data',(chunk)=>{
            data.push(chunk)
        })
       return req.on('end',()=>{
            const parsedData = Buffer.concat(data).toString("utf-8")
            const message = parsedData.split("=")[1]
            writeStream.write(message)
            writeStream.end("\n")
            fileHandle.close()
            res.statusCode = 302; //status code for redirect
            res.setHeader('Location','/') // can do status code in the same line res.writeHead()
            return res.end()
        })
    }
    res.end()
}

exports.requestHandler = requestHandler