var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
		res.send('<p>A user is connected</p>');	
			socket.on('sent message', function(msg){
				io.emit('sent message', msg);
			    console.log('message: ' + msg);
			}
			socket.on('disconnect', function(){
		    	console.log('user disconnected');
		  });
	});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

