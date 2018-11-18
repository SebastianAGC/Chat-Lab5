var li_cont = 0;
var li_server_cont=0;
let messages = null;
const url = 'http://34.210.35.174:7000/';
const fetch = require("node-fetch");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var FormData = require('form-data');

function getMessages(){
  const url = 'http://34.210.35.174:7000/';
  fetch(url)
  	.then((resp) => resp.json()) // Transform the data into json
   	.then((data) => {
      	messages = data;
        li_server_cont=0;
        messages.forEach(function(element){
          li_server_cont++;
        });
      })
}

function updateMessages(){
  getMessages();
  if(li_server_cont>li_cont){
    var delta = li_server_cont - li_cont;
    for (var i = 0; i < delta; i++) {
      if (messages[li_server_cont-i-1].nick  != "" && messages[li_server_cont-i-1].text != "" ) {
				console.log("Este es el Id: ", messages[li_server_cont-i-1].student_id )
				io.emit('chat message', {
					student_id: messages[li_server_cont-i-1].student_id,
					text: messages[li_server_cont-i-1].text,
					nick: messages[li_server_cont-i-1].nick
				});
      }
    }
      li_cont = li_server_cont;
  }
}

//Retrieveing all server messages with the fetch API
console.log("Making fetch...")
fetch(url)
	.then((resp) => resp.json()) // Transform the data into json
 	.then((data) => {
    	let messages = data;
    	return messages.map((message) => {
        li_cont++;
				if (message.nick != "" && message.text != "" ) {
					console.log("Message from ", message.student_id, ", says: ", message.text)
					io.emit('chat message', {
						student_id: message.student_id,
						text: message.text,
						nick: message.nick
					});
				}
    	})
    })

http.listen(3000, function(){
  console.log('listening...');
});

io.on('connection', function(socket) {
	socket.on('chat message', function(msg){
    console.log('message: ' + msg.nick);
		//data going to send in the request.
		var data = new FormData();
		data.append('student_id', msg.student_id);
		data.append('text', msg.text);
		data.append('nick', msg.nick);

		//Creating fetchData
		let fetchData = {
			method: 'POST',
			body : data
		}
		fetch(url, fetchData)
		.then(function (data) {
			console.log('Request success: ', data);
			getMessages();
		})
		.catch(function (error) {
			console.log('Request failure: ', error);
		});
  });
	setInterval(function() {
	    // method to be executed;
			console.log('Updating messages');
	    updateMessages()
	  }, 1000);
});
