
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
// const { validationResult } = require('express-validator/check');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);


exports.sendMail = (req,res,next) => {
    const sender = req.body.email;
    const username = req.body.name;
    const content = req.body.message;
    transporter.sendMail({
        to: 'haythembensalah26@gmail.com',
        from: 'rcar.community@gmail.com',
        subject: 'mail from visitor',
        html: `
          <h2>From ${sender}, M/Ms ${username}</h2>
          <p>${content}</p>
        `
      }).then(result => {
        console.log(result);
        res.status(200).json({msg : 'mail send successfully'});  
    })
    .catch(err => {
        console.log(err)
        err.statusCode = 500;
        throw err

    })

}
