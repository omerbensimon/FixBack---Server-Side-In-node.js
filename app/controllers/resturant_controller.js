httpStatus = require('http-status-codes');
const mongoose = require('mongoose');
const Resturant = require('../models/resturant');
const Location=require('../models/location')

const viewAllResturants = async (req, res) => {
    try {
        obj = await Resturant.find({}, (err) => {
            if (err)
                throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: err }
        });
        if (obj.length == 0) throw {
            status: httpStatus.BAD_REQUEST, message: 'No such resturant'
        }
        res.status(httpStatus.OK).json(obj);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
}
const viewSingleResturant = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw {
            status: httpStatus.BAD_REQUEST, message: 'Invalid id number'
        }
        obj = await Resturant.find({ _id: req.params.id }, (err) => { if (err) throw err });
        if (obj.length == 0) throw {
            status: httpStatus.BAD_REQUEST, message: 'No such resturant'
        }
        res.status(httpStatus.OK).json(obj[0]);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
};

const deleteResturant = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw {
            status: httpStatus.BAD_REQUEST, message: 'Invalid task id number'
        }
        obj = await Resturant.find({ _id: req.params.id }, (err) => { if (err) throw err });
        if (obj.length == 0) throw {
            status: httpStatus.BAD_REQUEST, message: 'No such resturant'
        }
        await Resturant.deleteOne({ _id: req.params.id });
        res.status(httpStatus.OK).send('resturant was deleted')
    } catch (err) {
        res.status(err.status).send(err.message);
    }
};

const addResturant= async(req, res)=> {
    try {
     // Location.GetLocationByAddress(req,res) //Optional- API that sets address using address pharse
        if (!req.body.name || !req.body.address ) throw { status: httpStatus.BAD_REQUEST, message: 'invalid variables' };
        obj = Resturant({
            name: req.body.name,
            position:{
                address:req.body.address,
                location:req.body.posID,
            },
        });


        await obj.save();
        res.status(httpStatus.OK).send(`Inserted resturant with id ${obj._id}`);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
}


module.exports = {
    addResturant,
    viewSingleResturant,
    viewAllResturants,
    deleteResturant
};