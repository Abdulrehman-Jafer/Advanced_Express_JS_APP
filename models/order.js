const { Schema, model,  } = require("mongoose")

const schema = new Schema({
    products : [{
        type: Schema.Types.Mixed,
        required: true
    }],
    user : {
        name : {
            type : Schema.Types.String,
            required:true
        },
        userId: {
            type : Schema.Types.ObjectId,
            ref : "User",
            required:true
        }
    }
})


const Order = model("Order",schema)

module.exports = Order;
