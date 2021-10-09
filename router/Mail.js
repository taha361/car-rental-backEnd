const express = require('express');
const route = express.Router();
const mailController = require('../controllers/Mail');

const {
    validation,
    mailValidate
  } = require("../middleware/validateUser");

route.post('/',mailValidate(), validation,mailController.sendMail);


module.exports=route;