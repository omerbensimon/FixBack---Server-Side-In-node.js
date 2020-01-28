
httpStatus = require('http-status-codes');
const loc=require('../models/location');
const mongoose = require('mongoose');

const addLocation= async(req, res)=> {
    try {
        if (!req.body.Lat || !req.body.Lon ) throw { status: httpStatus.BAD_REQUEST, message: 'invalid variables' };
        obj = loc({
            Lat: req.body.lat,
            Lon: req.body.lon
        });
        await obj.save();
        res.status(httpStatus.OK).send(`Inserted location with id ${obj._id}`);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
}

module.exports= {
    addLocation,
};
//Client


// const { tomtom_API_KEY } = require('../../config/constants');
// const { perferedFormat } = require('../../config/constants');
// const SearchFuzzyURL = `https://api.tomtom.com/search/2/search/`
// const https = require('https');


//  GetLocationByAddress = async (req, res) => {
//     try {
//         if (!req.body.address) throw {
//             status: httpStatus.BAD_REQUEST, message: 'Invalid id number'
//         }
//         console.log(SearchFuzzyURL + '"' + req.body.address + '"' + perferedFormat + "?key=" + tomtom_API_KEY)
//         https.get(SearchFuzzyURL + '"' + req.body.address + '"' + perferedFormat + "?key=" + tomtom_API_KEY, (resp) => {
//             let data = '';

//             // A chunk of data has been recieved.
//             resp.on('data', (chunk) => {
//                 data += chunk;
//             });

//             // The whole response has been received. Print out the result.
//             resp.on('end', () => {
//               console.log( JSON.parse(data).results[0].position)  //  console.log(JSON.parse(data).results[0].position);
//               //res.send(JSON.parse(data).results[0].position)

//             });
//         });
//     }catch (err) {
//         res.status(err.status).send(err.message);

//     }

// };
// module.exports = {
//     GetLocationByAddress,
// };