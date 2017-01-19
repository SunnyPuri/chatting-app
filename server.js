var express = require('express');
var path = require("path");
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);

console.log("server running");

app.get('/', function(req, res){
    res.sendFile(__dirname+'/index.html')
});

app.use('/css', express.static(path.join(__dirname, 'assets/css')));
app.use('/js', express.static(path.join(__dirname, 'assets/js')));
app.use('/fonts', express.static(path.join(__dirname, 'assets/fonts')));
app.use('/img', express.static(path.join(__dirname, 'assets/img')));

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log("Connected %s sockets connected", connections.length);
    
    //Disconnect
    socket.on('disconnect', function(){
//        if(!socket.username) return;
        users.splice(users.indexOf(socket.username),1);
        connections.splice(connections.indexOf(socket),1);
        updateUserNames();
        console.log('Disconnected %s sockets connected', connections.length);    
    });
    
    //Send Message
    socket.on('send message', function(data){
//        console.log(data);
        var postTime = ('0'+new Date().getHours()).slice(-2) +':'+ ('0'+new Date().getMinutes()).slice(-2);
        io.sockets.emit('new message', {msg: data, user: socket.username, time: postTime});
    });
    
    //New User
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
    });
    
    function updateUserNames(){
        io.sockets.emit('get users', users);
    }
});