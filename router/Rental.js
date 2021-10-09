const express = require('express');
const route = express.Router();
const rentController = require('../controllers/Rental');
const isAuth = require("../middleware/isAuth");

route.get('/get',isAuth,rentController.getRent);
route.post('/payement',isAuth,rentController.payment);
route.get('/checkout/success/:token',rentController.payementSuccess);
route.get('/checkout/cancel',rentController.payementCancel);








module.exports =route ;