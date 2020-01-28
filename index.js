const express = require('express');
const app = express();
const connection = require('./config/database.config').connection;

const PORT = process.env.PORT || 8080;
const resturantRoute = require('./app/routes/resturant_routes.js');
const roomRoute = require('./app/routes/room_routes.js');
const taskRoute = require('./app/routes/task_routes.js');
const userRoute = require('./app/routes/user_routes.js');
const deviceRoute = require('./app/routes/device_routes.js');
const locationRoute = require('./app/routes/location_route');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('', resturantRoute);
app.use('', roomRoute);
app.use('', taskRoute);
app.use('', userRoute);
app.use('', deviceRoute);
app.use('', locationRoute);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.listen(PORT, () => console.log('Express server is running on port ', PORT));