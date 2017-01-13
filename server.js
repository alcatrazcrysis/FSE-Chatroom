/**
 * Created by Administrator on 2017/1/10.
 */
var express = require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path=require('path');
var url = 'mongodb://localhost:27017/local';
var mongojs = require('mongojs')
var db=mongojs(url,['user']);
var assert = require('assert');
app.use("/public",express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
    res.sendFile(__dirname + "/"+"chatroom.html");
});
var messages=[];


// Connection URL


// Use connect method to connect to the server


io.on('connection', function(socket){

    socket.on('join',function(name)
    {
        socket.username=name;
/*        messages.forEach(function(message){
            socket.emit("chat message",message.name+":"+message.data)
        });*/
        var messagestored=[];
        db.user.find(function(err, docs){
            messagestored=docs;
            messagestored.forEach(function(messagetosend){
                socket.emit("chat message",{name:messagetosend.name,message:messagetosend.message,date:messagetosend.date});
            });
        });


    });
    //add a comment
    socket.on('chat message', function(msg){
        var username=socket.username;
        var messageshow="("+msg.date+")"+username+":"+msg.message;
      db.user.insert({name:username, message:msg.message, date:msg.date},function(err, result){
         
       });



/*        messages.push({name:username,data:msg});
        if(messages.length>10)
        {
            messages.shift();
        }*/
        io.emit('chat message', {date:msg.date,name:username,message:msg.message});
        console.log(messageshow);
    });
});
http.listen(3030, function(){
    console.log('listening on *:3030');
});