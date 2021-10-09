const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);

exports.Register = async (req, res) => {
  console.log('registerController');
  try {
    // req.body= name , email , password , phone
    const { username, email, password, firstname, lastname, adress } = req.body;
    // test email
    const findUser = await User.findOne({ email });
    // email should be unique
    if (findUser) {
      return res
        .status(400)
        .send({ errors: [{ msg: "email should be unique" }] });
    }
    // new user
    const newUser = new User({ ...req.body });

    // hashage password
    const hashedpassword = await bcrypt.hash(password, saltRounds);
    newUser.password = hashedpassword;
    //then we save user
    await newUser.save();

    // CRRE UN TOKEN= meftaa7
    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "3h" }
    );
    // response
    res.status(200).send({ msg: "register succ", user: newUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ errors: [{ msg: "user not saved" }] });
  }
};

exports.Login = async (req, res) => {
  try {
    // email & password
    const { email, password } = req.body;
    //   test si email mawjoud
    const findUser = await User.findOne({ email });
    // ken mech mawjoud
    // bad credential
    if (!findUser) {
      return res.status(400).send({ errors: [{ msg: "bad credential" }] });
    }
    // test password
    //   password fel BD== password
    const comparePass = await bcrypt.compare(password, findUser.password);
    //   ken mech kifkif
    // bad crential
    if (!comparePass) {
      return res.status(400).send({ errors: [{ msg: "bad credential" }] });
    }
    // CREE UN TOKEN= meftaa7
    const token = jwt.sign(
      {
        id: findUser._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "3h" }
    );
    res.status(200).send({ msg: "login successfully", user: findUser, token : token });
  } catch (error) {
    res.status(500).send({ errors: [{ msg: "can not login" }] });
  }
};
// w hne tab3athli username w favorits kahaw
exports.updateUser = async (req, res) => {
  try {
    // const newUser = {
    //   ...req.user,
    //   username: req.body.username
    // };
    const userUpdate = req.user
    userUpdate.username = req.body.username;
    const result = await userUpdate.save();
    // User.updateOne(
    //   { _id: req.user._id },
    //   { $set: { ...newUser } }
    // );
    result.nModified ? res.send("updated") : res.send("user already updated");
  } catch (error) {
    console.log('catch error');
    res.status(400).send("No user exist with that ID");
  }
};
//hne tabaathli ken newPassword fel req.body
exports.updatePassword = async (req, res) => {
  try {
    // const newUser = { ...req.user, password: req.body.newPassword };
    const userUpdate = req.user;
    const hashedpassword = await bcrypt.hash(req.body.newPassword, saltRounds);
    userUpdate.password = hashedpassword;
    const result = await userUpdate.save();

    // const result = await User.updateOne(
    //   { _id: req.user._id },
    //   { $set: { ...newUser } }
    // );
    result.nModified ? res.send("updated") : res.send("user already updated");
  } catch (error) {
    res.status(400).send("No user exist with that ID");
  }
};

exports.postRest = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      err.statusCode = 500;
      throw err;
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          const err = new Error('no such user with this email')
          err.statusCode = 404;
          throw err;
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.status(200).json({msg : 'rest URL send to your email'});
        transporter.sendMail({
          to: req.body.email,
          from: 'rcar.community@gmail.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:4200/reset/${token}">link</a> to set a new password.</p>
          `
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() }
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.status(200).json({msg : 'password reset successful'});
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


