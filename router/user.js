const express = require("express");
const {
  Register,
  Login,
  updatePassword,
  updateUser,
  postRest,
  postNewPassword
} = require("../controllers/user.controllers");
const isAuth = require("../middleware/isAuth");
const {
  validation,
  registerValidate,
  mailValidate,
  loginValidate,
} = require("../middleware/validateUser");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("testing router");
});

/*
@method: POST
@ path:http:localhost:5000/api/user/register
@ parameter: req.body  
public
*/
router.post("/register", registerValidate(), validation, Register);

/*
@method: POST
@ path:http:localhost:5000/api/user/login
@ parameter: req.body  
public
*/
router.post("/login", loginValidate(), validation, Login);

/*
@method: GET
@ path:http:localhost:5000/api/user/current
@ parameter: req.headers  
public
*/
router.get("/current", isAuth, (req, res) => {
  res.send({ msg: "authorized", user: req.user });
});
/*
@method: POST
@ path:http:localhost:5000/api/user/updateUser
@ parameter: req.body  
public
*/
router.put("/updateUser", isAuth, updateUser);
/*
@method: POST
@ path:http:localhost:5000/api/user/updatePassword
@ parameter: req.body  
public
*/
router.put("/updatepassword", isAuth, updatePassword);

router.post('/postReset',mailValidate(),validation,postRest);

router.post('/postNewPassword',postNewPassword);
// default export
module.exports = router;
