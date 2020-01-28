//todo- for example: getAllAvailibleTechnicianshttpStatus = require('http-status-codes');
const mongoose = require('mongoose');
const User = require('../models/user');
const moment = require('moment');
var Enum = require('enum');
//const validatePhoneNumber = require('validate-phone-number-node-js');


const deleteUser = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw {
            status: httpStatus.BAD_REQUEST, message: 'Invalid task id number'
        }
        obj = await User.find({ _id: req.params.id }, (err) => { if (err) throw err });
        if (obj.length == 0) throw {
            status: httpStatus.BAD_REQUEST, message: 'No such task'
        }
        await User.deleteOne({ _id: req.params.id });
        res.status(httpStatus.OK).send('user was deleted')
    } catch (err) {
        res.status(err.status).send(err.message);
    }

};

const viewAllUsers = async (req, res) => {
    try {
        obj = await User.find({}, (err) => {
            if (err)
                throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: err }
        });
        if (obj.length == 0) throw {
            status: httpStatus.BAD_REQUEST, message: 'No users'
        }
        res.status(httpStatus.OK).json(obj);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
}
const viewSingleUser = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw {
            status: httpStatus.BAD_REQUEST, message: 'Invalid id number'
        }
        obj = await User.find({ _id: req.params.id }, (err) => { if (err) throw err });
        if (obj.length == 0) throw {
            status: httpStatus.BAD_REQUEST, message: 'No such user'
        }
        res.status(httpStatus.OK).json(obj[0]);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
};


const addUser = async (req, res) => {
    try {
        if (!req.body.name) throw { status: httpStatus.BAD_REQUEST, message: 'name is required' };
        var url=req.body.imageURL
        var spec=req.body.speciality
        var resID_forManagers=req.body.resturantID
        console.log(req.body.email)

        if(!url)
        {

            url="https://www.diplomacy.edu/sites/all/themes/jollyany/demos/no-avatar.jpg"

        }
        if(!spec)
        {
            spec="General"

        }

        if(!resID_forManagers)
        {
            restID=null;

        }

        Obj = User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            PhoneNumber:req.body.PhoneNumber,
            imageURL: url,
            lat:Number,
            Lon:Number,
            Role: req.body.Role, //Shouldn't validate- client side will send at least one role
            DetailsTech:{//when opened, Tech rating will be set to 3 as a deafult value as set in the schema
                speciality: spec
             },
            DetailsManager:restID

        });
        await Obj.save();
        console.log(Obj.Role)
        res.status(httpStatus.OK).send("new user was created")
    }
    catch (err) {
        if (err.code == 11000)
        res.status(400).send({message : "mail is already in use"})
        else return { message: "unkown error" };

    }
}

const GetAllAvailibleTech = async (req, res) =>
{//Recieves Resturant position from client side within the req
    try {
        obj = await User.find({}, (err) => {
            if (err)
                throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: err }
        }).where('Role').equals('Technician').where('statusOn').equals('true'); 
         
        res.status(httpStatus.OK).json(obj);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
}

const updateStatus = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw {
            status: httpStatus.BAD_REQUEST, message: 'Invalid id number'
        }
       
        obj = await User.find({ _id: req.params.id }, (err) => {
            if (err)
                throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: err }
        });
        if (obj.length == 0) throw {
            status: httpStatus.BAD_REQUEST, message: 'No such user'
        }
        obj = obj[0];
        if(obj.statusOn==false)
        {
            obj.statusOn=true;
        }
         else{
            obj.statusOn=false;

        }
        await User.updateOne({ _id: req.params.id }, obj);
        res.status(httpStatus.OK).send('User status was updated')
    } catch (err) {
        res.status(err.status).send(err.message);
    }
};
    module.exports = {
        addUser,
        deleteUser,
        viewSingleUser,
        viewAllUsers,
        GetAllAvailibleTech,
        updateStatus,
    };