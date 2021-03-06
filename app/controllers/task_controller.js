httpStatus = require('http-status-codes');
const mongoose = require('mongoose');
const Task = require('../models/task');
const User = require('../models/user')
const moment = require('moment');
const logger = require('../../taskLogs');


const allLogs = (req, res) => {
    let logs = logger.getLogs();
    console.log(logs)
    if (!logs) {
        res.status(httpStatus.BAD_REQUEST).send(err.message);
    }
    else {
        res.status(httpStatus.OK)
        res.end(JSON.stringify(logs));
    }
}
const updateTask = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.body.userId)) throw {//User id
            status: httpStatus.BAD_REQUEST, message: 'Invalid id number'
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) throw {
            status: httpStatus.BAD_REQUEST, message: 'Invalid task id number'//Task id
        }
        userObj = await User.find({ _id: req.body.userId }, (err) => {
            if (err)
                throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: err }
        });
        if (userObj.length == 0) throw {
            status: httpStatus.BAD_REQUEST, message: 'No such user'
        }
        taskObj = await Task.find({ _id: req.params.taskId }, (err) => {
            if (err)
                throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: err }
        });
        if (taskObj.length == 0) throw {
            status: htstpStatus.BAD_REQUEST, message: 'No such task'
        }
        if (userObj[0].Role == 'Manager') throw {
            status: httpStatus.FORBIDDEN, message: 'No access for managers'
        }
        else if (userObj[0].Role == 'Resturant Manager') {//If the Resturant Manager is trying to update task, the task should come with values from when it was last modified
            tempObj = {
                Description: req.body.Description,
                Date: new moment().format(`${req.body.month}-${req.body.day}-${req.body.year}`),
                FromTime: new moment().format(`${req.body.hours}:${req.body.minuets}:00`),
                ToTime: new moment().format(`${req.body.hours}:${req.body.minuets}:00`),
                FixNow: req.body.FixNow,
                Type: req.body.Type,
                AssignedTech: req.body.AssignedTech,
                Urgency: req.body.Urgency,
                StatusManager: req.body.StatusManager
            };
        }
        else if (userObj[0].Role == 'Technician') {
            tempObj = {
                StatusTech: req.body.StatusTech
            };
        }
        await Task.updateOne({ _id: req.params.taskId }, tempObj);
        logger.log(`Task was updated successfully by ${userObj[0].name} the ${userObj[0].Role}!`);
        res.status(httpStatus.OK).send('Task was updated successfully!')
    } catch (err) {
        res.status(err.status).send(err.message);
    }
}
const viewAllTasks = async (req, res) => {
    try {
        
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) throw {//User id who opened the tasks
            status: httpStatus.BAD_REQUEST, message: 'Invalid user id number'
        }
        userObj = await User.find({ _id: req.params.userId }, (err) => { if (err) throw err });
        console.log(userObj[0].Role)
        if (userObj.length == 0) throw {
            status: httpStatus.BAD_REQUEST, message: 'No such user'
        }
        if (userObj[0].Role == 'Resturant Manager') {
            if(!req.params.resturant) throw { status: httpStatus.BAD_REQUEST, message: 'resturant id can not be empty'}
            taskObj = await Task.find({}, (err) => {
                if (err) throw { status: httpStatus.INTERNAL_SERVER_ERROR }
            }).where('StatusManager').equals(req.params.status).where('Resturant').equals(req.params.resturant);
            if (taskObj.length == 0) throw {
                status: httpStatus.BAD_REQUEST, message: `There is no task from type ${req.params.status}`
            }
            res.status(httpStatus.OK).send(JSON.stringify(taskObj));
        }
        else if (userObj[0].Role == 'Technician') {
            if(!req.params.status){
            taskObj = await Task.find({}, (err) => {
                if (err) throw { status: httpStatus.INTERNAL_SERVER_ERROR }
            }).where('Date').equals(req.params.date);
            if (taskObj.length == 0) throw {
                status: httpStatus.BAD_REQUEST, message: `There are no tasks on the ${req.params.date}`
            }
            res.status(httpStatus.OK).send(JSON.stringify(taskObj));
        }
        else{
        taskObj = await Task.find({}, (err) => {
            if (err) throw { status: httpStatus.INTERNAL_SERVER_ERROR }
        }).where('FixNow').equals('true');
        if (taskObj.length == 0) throw {
            status: httpStatus.BAD_REQUEST, message: `There are no tasks on the ${req.params.date}`
        }
        res.status(httpStatus.OK).send(JSON.stringify(taskObj));
    }
    }
        else if (userObj[0].Role == 'Manager') throw {
            status: httpStatus.BAD_REQUEST, message: 'Manager is not autoherized for this information'
        }
        else {//Open only for system manager
            obj = await Task.find({}, (err) => {
                if (err)
                    throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: err }
            });
            if (obj.length == 0) throw {
                status: httpStatus.BAD_REQUEST, message: 'No such task'
            }
            res.status(httpStatus.OK).json(obj);
        }
    } catch (err) {
        res.status(err.status).send(err.message);
    }
}
const viewSingleTask = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw {
            status: httpStatus.BAD_REQUEST, message: 'Invalid task id number'
        }
        obj = await Task.find({ _id: req.params.id }, (err) => { if (err) throw err });
        if (obj.length == 0) throw {
            status: httpStatus.BAD_REQUEST, message: 'No such task'
        }
        res.status(httpStatus.OK).json(obj[0]);
    } catch (err) {
        res.status(err.status).send(err.message);
    }

};
const deleteTask = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw {
            status: httpStatus.BAD_REQUEST, message: 'Invalid task id number'
        }
        obj = await Task.find({ _id: req.params.id }, (err) => { if (err) throw err });
        if (obj.length == 0) throw {
            status: httpStatus.BAD_REQUEST, message: 'No such task'
        }
        await Task.deleteOne({ _id: req.params.id });
        logger.log("Task was deleted successfully!");
        res.status(httpStatus.OK).send('Task was deleted')
    } catch (err) {
        res.status(err.status).send(err.message);
    }
};
const addTask = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.body.userId)) throw {
            status: httpStatus.BAD_REQUEST, message: 'Invalid user id number'
        }
        if (!mongoose.Types.ObjectId.isValid(req.body.resturantId)) throw {
            status: httpStatus.BAD_REQUEST, message: 'Invalid resturant id number'
        }

        if (!mongoose.Types.ObjectId.isValid(req.body.deviceId)) throw {
            status: httpStatus.BAD_REQUEST, message: 'Invalid device id number'
        }
        if (!req.body.userId) throw { status: httpStatus.BAD_REQUEST, message: 'Invalid User Id' };
        if (!req.body.resturantId) throw { status: httpStatus.BAD_REQUEST, message: 'Invalid Resturant Id' };
        obj_ = await User.find({ _id: req.body.userId }, (err) => { if (err) throw err });
        if (obj_.length == 0) throw {
            status: httpStatus.BAD_REQUEST, message: 'No such User'
        }
        if (!req.body.Description) throw { status: httpStatus.BAD_REQUEST, message: 'Length must be bigger then 50 letters' };
        var type = req.body.Type;
        var urg = req.body.Urgency;
        if (!req.body.Type) {
            type = "General";
        }
        if (!req.body.Urgency) {
            urg = "High";
        }
        obj = Task({
            Description: req.body.Description,
            OpenedBy: req.body.userId,
            OpenedAtTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            FixNow: false,
            Resturant: req.body.resturantId,
            device: req.body.deviceId,
            Type: type,
            Urgency: urg,

        });
        await obj.save();
        logger.log(`New Task Was Created by ${obj_[0].name}!`);
        res.status(httpStatus.OK).send(`New Task Was Created by ${obj._id}`);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
}


module.exports = {
    addTask,
    updateTask,
    deleteTask,
    viewSingleTask,
    viewAllTasks,
    allLogs
};