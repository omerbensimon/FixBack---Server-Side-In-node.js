const router = require('express').Router();
const ResturantController = require('../controllers/resturant_controller');

router.post('/addResturant', (req, res) => {
    ResturantController.addResturant(req, res)
});

router.get('/viewAllResturants', (req, res) => {
    ResturantController.viewAllResturants(req, res)
});

router.get('/viewSingleResturant/:id', (req, res) => {
    ResturantController.viewSingleResturant(req, res)
});
router.delete('/deleteResturant/:id', (req, res) => {
    ResturantController.deleteResturant(req, res)
});

// router.all('*', (req, res) => {
//     res.status(err.status).send('The rout is not avilalble..')
// })
module.exports = router;