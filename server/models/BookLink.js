const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BooklinkSchema = new Schema({
    subdomain:{
        type: Schema.Types.String
    },
    name:{
        type: Schema.Types.String
    },
    email:{
        type: Schema.Types.String
    },
    mobile:{
        type: Schema.Types.String
    },
    link:{
        type: Schema.Types.String
    },
    type: {
        type: Schema.Types.Mixed
    }
})

module.exports = Booklink = mongoose.model("Booklink",BooklinkSchema);