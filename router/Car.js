const express = require('express');
const route = express.Router();
const carController = require('../controllers/Car');
const isAuth = require("../middleware/isAuth");

route.post('/addCar',isAuth,carController.addCar);
route.get('/cars/:page',carController.getCars);
route.delete('/delete/:carId',isAuth,carController.deleteCar);





module.exports =route ;