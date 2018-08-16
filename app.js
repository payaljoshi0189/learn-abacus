/* Copyright (c) 2018 Payal P Joshi
[This program is licensed under the "MIT License"]
Please see the file LICENSE in the source
 distribution of this software for license terms.*/


//import depedencies
const express = require('express');
const parser = require('body-parser'); 
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();


var http = app.listen(8000);
var io = require('socket.io').listen(http);



/*  Code Reference for email functionality: 
    1. https://nodemailer.com/about/ 
    2. https://medium.com/@manojsinghnegi/sending-an-email-using-nodemailer-gmail-7cfa0712a799
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
     <p> Contact Details are:</p>
     <p> Email Id: ${req.body.email} </p>
	`;
	let transporter = nodemailer.createTransport({
       service: 'gmail',
        auth: {
            user:'Enter a valid gmail id here', //email id
            pass:'Enter a correct password for the above id' //password
            
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
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


    //Chat Server
    app.get('/sendChatMessages', function(req, res){
      res.status(200)
      res.setHeader('content-type', 'text/html');
      res.sendFile(__dirname + '/views/chatting.handlebars');
    });

    io.on('connection', function(socket){
        console.log('user is connected');

        //Action to be taken upon receiving 'sent message' socket event
          socket.on('sent message', function(msg){
            io.emit('sent message', msg);
              console.log('message: ' + msg);
          });

          //Action to be taken upon socket disconnect
          socket.on('disconnect', function(){
              console.log('user disconnected');
          });
      });

    http;
    console.log('serving on port 8000');






























