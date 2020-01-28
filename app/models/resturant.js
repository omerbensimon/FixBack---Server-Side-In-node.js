const mongoose = require('mongoose');
var room=require('./room.js')

const ResturantSchema = mongoose.Schema({
    name:String,
    position:{
        address:String,
        location:{
            type:[mongoose.Schema.Types.ObjectId],
            ref:'location',
        }
    },
});

module.exports = mongoose.model('resturant', ResturantSchema);