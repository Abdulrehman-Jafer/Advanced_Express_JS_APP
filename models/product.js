const rootDir = require("../util/path.js")
const path = require("node:path")
const fs = require("node:fs/promises")


const absolutePath = path.join(rootDir,"data","products.json")

const getProductsFromFile = async (cb) => {
    const fileContent = await fs.readFile(absolutePath)
    .catch(err=>{
        console.log("fetchAll:",err)
        return cb([])
    })
    const products = JSON.parse(fileContent)
    return cb(products);
}

class Product {
    constructor(title){
        this.title = title
    }

    async save(){
            getProductsFromFile (async (products) => {
            products.push(this) // this refers to the class
            await fs.writeFile(absolutePath,JSON.stringify(products))
            .catch(err => console.log("writeFileError:",err))
        })
    }

    // here I will pass the cb to the fetchAll which will be called
    static async fetchAll (cb){ //static mean we do not have to create a new instance it mean we call this method dirctly on the class.
        getProductsFromFile(cb)
    }
}

exports.Product = Product