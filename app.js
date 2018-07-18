const express = require('express');
const parser = require('body-parser'); 
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();



//View Engine Setup
app.engine('handlebars',exphbs());
app.set('view engine','handlebars');

//static folder
app.use('/public',express.static(path.join(__dirname,'public')));
console.log(path.join(__dirname,'public'))

//Body parser middleware
app.use(parser.urlencoded({extended: false}));
app.use(parser.json());

app.get('/views/:parameter', function(req, res) {
    res.status(200);
    res.render(req.params.parameter);
});


app.post('/sendEnquiry', (req, res) => {
	var emailContents = 
	`<p> ${req.body.name} has sent an enquiry regarding ${req.body.subject} </p>
	`;
	let transporter = nodemailer.createTransport({
       service: 'gmail',
        auth: {
            user: '<Enter your email id' ,// generated ethereal user
            pass: '<Enter a valid password for your email id'	// generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Mind Miracle" <testlearnabacus@gmail.com>', // sender address
        to: '<email id to send email to>', // list of receivers
        subject: 'New enquiry', // Subject line
        text: 'Hello world?', // plain text body
        html: emailContents // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('enquiry',{msg:'Email has been sent'});

    });

});

console.log('serving on port 3080');
app.listen(3080);