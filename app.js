// Copyright (c) 2018 Payal P Joshi
//[This program is licensed under the "MIT License"]
// Please see the file LICENSE in the source
// distribution of this software for license terms.


//import depedencies
const express = require('express');
//var router = express.Router();
const parser = require('body-parser'); 
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();


var http = app.listen(8000);
var io = require('socket.io').listen(http);



/*  Code reference for Login and Register Functionality:
    1. Passportjs official documentation: http://www.passportjs.org/docs/
    2. bcryptjs official documentation: https://www.npmjs.com/package/bcryptjs
    3. Video Tutorials by Traversy Media at https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA
    4. https://github.com/bradtraversy/loginapp

    Code Reference for email functionality: 
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



/*A common get request for pages like
  about, home, enquiry
*/
app.get('/views/:parameter', function(req, res) {
      res.status(200);
      res.render(req.params.parameter);
    
});


//Trigger email on sending an enquiry 
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
            /* user:  // generated ethereal user
            pass: 	// generated ethereal password
            */
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

    // send email with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('enquiry',{msg:'An email has been sent to the admin'});

    });

});

//Fetch the Schedule from the database
//app.get('/schedule'),(req, res) =>{
  //res.redirect('/views/schedule');
//}

//Chat Server
app.get('/chatting', function(req, res){
  res.sendFile(__dirname + '/views/chatting.handlebars');
});

io.on('connection', function(socket){
    console.log('user is connected');
      socket.on('sent message', function(msg){
        io.emit('sent message', msg);
          console.log('message: ' + msg);
      });
      socket.on('disconnect', function(){
          console.log('user disconnected');
      });
  });

http;
//app.listen(8000);
console.log('serving on port 8000');






























