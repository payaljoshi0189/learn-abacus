//import depedencies
const express = require('express');
var router = express.Router();
const parser = require('body-parser'); 
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const expressSession = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const passportLocal = require('passport-local').Strategy;
const mongo = require('mongodb');
var Member = require('./model/member');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/learnabacus');
const db = mongoose.connection;

const app = express();


//Code reference for Login and Register Functionality: https://github.com/bradtraversy/loginapp
/*Code Reference for email functionality: 
 1. https://nodemailer.com/about/ 
 2. https://medium.com/@manojsinghnegi/sending-an-email-using-nodemailer-gmail-7cfa0712a799
 3. https://www.youtube.com/watch?v=nF9g1825mwk
 */

//View Engine Setup
app.engine('handlebars',exphbs());
app.set('view engine','handlebars');

//static folder
app.use('/public',express.static(path.join(__dirname,'public')));

console.log(path.join(__dirname,'public'))

//Body parser middleware
app.use(parser.urlencoded({extended: false}));

app.use(parser.json());

// Express Session
app.use(expressSession({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));

app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


// Passport init
app.use(passport.initialize());
app.use(passport.session())

app.use(cookieParser());

app.use(expressValidator());


app.get('/views/:parameter', function(req, res) {
    res.status(200);
    res.render(req.params.parameter);
});


app.post('/views/register', (req, res) => {
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);
    var errors = req.validationErrors();
    if(errors){
        res.render('register',{
            errors: errors
        });
    }else{
       var newMember = new Member({
            memberId: req.body.memberId,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password
       });
       Member.createMember(newMember, function(error, member){
        if(error) throw error;
        console.log(member);
       });
       req.flash('success_msg','Registered successfully!');
       res.redirect('views/login');
    }
})

/*Code Reference for email functionality: 
 1. https://nodemailer.com/about/ 
 2. https://www.youtube.com/watch?v=nF9g1825mwk
 */
app.post('/sendEnquiry', (req, res) => {
	var emailContents = 
	`<p> ${req.body.name} has sent an enquiry.</p>
     <p> The message sent is: ${req.body.enquiryTextarea} </p>
     <p> Contact Details are:</p> <br>
     <p> Email Id: ${req.body.email} </p>
	`;
	let transporter = nodemailer.createTransport({
       service: 'gmail',
        auth: {
            user: 'testlearnabacus@gmail.com' ,// generated ethereal user
            pass: 'learnabacus@123'	// generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        //from: '"Mind Miracle" <testlearnabacus@gmail.com>', // sender address
        from: req.body.email,
        to: 'testlearnabacus@gmail.com', // list of receivers
        subject: 'New enquiry received', // Subject line
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
        res.render('enquiry',{msg:'An email has been sent to the admin'});

    });

});

console.log('serving on port 8000');
app.listen(8000);