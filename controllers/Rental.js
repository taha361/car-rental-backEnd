const Rental = require('../models/Rental');
const Car = require('../models/Car');
const User = require('../models/User');
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { cachedDataVersionTag } = require('v8');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);
const stripe = require('stripe')('sk_test_51IuQbSCxbz7I0xpYMwZ4jdwVYHj0UAiK8Hoeu1z8XotIs6jTqz1DZ3B26Ow89agnUxP3YD2HLDyyAppYdCl7i6rM00S8UgoUbf');
exports.getRent = (req, res, next) => {
        let car;
        let cars=[];
        let rentals;

    if(req.user.admin)
    { 
        console.log('in admin user get rental');
        Rental.find({pay : true}).populate('car').then(result => {
            // console.log(result);
            rentals = result;
            res.status(200).json({rentals : rentals});
        }).catch((err) => {
            err.statusCode = 500;
            throw err;
        })  
    }else {
        console.log('in get simple user');
        Rental.find({$and:[{user : req.user._id},{pay : true}]}).populate('car').then(result => {
            rentals = result;
            res.status(200).json({rentals : rentals});
        }).catch((err) => {
            err.statusCode = 500;
            throw err;
        })
    }
    

};




exports.payment= (req, res, next) => {
    console.log('in payement');
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          err.statusCode = 500;
          throw err;
        }
        const token = buffer.toString('hex');
    if(!req.user)
    {
        const err = new Error('you are not authorized');
        err.statusCode = 403;
        throw err;
    }
    const carId = req.body.carId;
    const start_rental = new Date(req.body.start_rental);
    const end_rental = new Date(req.body.end_rental);
    const client = req.user;
    let sumPrice;
    const nbOfDays =req.body.duration;
    console.log(nbOfDays);
    let car
    Car.findById(carId).then(carDoc => {
        if(!carDoc)
        {
            const err = new Error('no car For this id');
            err.statusCode = 404;
            throw err;
        }
        car = carDoc;
        sumPrice = (carDoc.price / 7)* nbOfDays;
        const rental = new Rental({
            car : carDoc._id,
            start_rental : start_rental.toString(),
            end_rental : end_rental.toString(),
            durations : nbOfDays,
            price : carDoc.price,
            user : client._id,
            token : token

        });
        return rental.save();

    }).then(result => {
        return stripe.checkout.sessions.create({
            payment_method_types : ['card'],
            line_items : [{ 
                name : car.model,
                description : car.description,
                amount :Math.round( ((car.price / 7) * nbOfDays) * 100),
                currency : 'usd',
                quantity : 1
            }],
            success_url : 'http://localhost:5000/rent/checkout/success/'+token,
            cancel_url : 'http://localhost:5000/rent/checkout/cancel'
          })
    })
    .then(session => {
        res.status(200).json({
          car : car,
          price : Math.round((car.price / 7 ) * nbOfDays),
          sessionId : session.id
        })
    })
    .catch(err => {
        err.statusCode = 500;
        throw err;
    })
});
};

exports.payementSuccess = async (req,res,next) => {
    tokenParams = req.params.token;
    let userRent;
    let rental;
    let carRent;
    Rental.findOne({token: tokenParams}).then(rent => {
        if(!rent){
            const error = new Error('bad token');
            error.statusCode = 500;
            throw error;
        }
        rental = rent;
        rent.token = undefined;
        rent.pay = true;
        return rent.save();
    }).then(async (result) => {
        carRent = await Car.findOne({_id : rental.car});
        carRent.booking.push({date_debut : rental.start_rental,date_fin : rental.end_rental});
        return carRent.save();
        
    }).then(async (result) => {
        userRent = await User.findOne({_id :rental.user});
        eamilUser = userRent.email;
        return transporter.sendMail({
            to: eamilUser,
            from: 'rcar.community@gmail.com',
            subject: 'Rental Code',
            html: `
              <h1>Thank you for your trust</h1>
              <p>this is your Rental Code : ${rental._id} </p>
              <p>make sure to back again</p>
              <p><mark>with Love Rcar<mark></p>
              
            `
          });
    })
    .then(resulter => {
        // res.status(200).json({msg : 'pay successful'})
        res.render('paymentSuccess');
    })
    .catch(err => {
        err.statusCode = 500;
          throw err;
    })
};

exports.payementCancel = (req,res,next) => {
    res.render('payementCancel');
}





