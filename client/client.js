
var socket = io.connect('http://localhost:3000');
const url = 'http://34.210.35.174:7000/';
const ul = document.getElementById('messages');
const objDiv = document.querySelector(".chat-p");

function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function sendMessage(){
  const input = document.getElementById('message-input').value;
  if (input == ""){
    //Window alert if there is no text in the input field.
    window.alert("Por favor, ingresa un mensaje")
  }else{
    socket.emit('chat message', {
      student_id : '15452',
      text : input,
      nick : 'King'
    });
  }
}


// Retrieveing all server messages with the fetch API
fetch(url)
	.then((resp) => resp.json()) // Transform the data into json
 	.then((data) => {
    	let messages = data;
    	return messages.map((message) => {
    		let li = createNode("li"),
    			text = document.createTextNode(message.nick + ": " + message.text);
			if (message.nick != "" && message.text != "" ) {
				li.append(text);
    		ul.append(li);
        if(message.student_id == "15452"){
          li.className = "own_message"
        }
			}
        objDiv.scrollTop = objDiv.scrollHeight;
    	})
    })


// Get the input field
var input = document.getElementById("message-input");
//Creating event for send button
const submitBtn = document.querySelector('#sendButton');
submitBtn.addEventListener('click', function(){
  sendMessage();
  input.value="";
});

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Cancel the default action, if needed
  event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    document.getElementById("sendButton").click();
    input.value="";
  }
});

//Socket on to check for incoming messages
socket.on('chat message', function(msg){
  console.log("Message received from ", msg.nick);
  const ul = document.getElementById('messages'); // Get the list where we will place our messages
  if(msg.nick != "" && msg.text != ""){
    text = document.createTextNode(msg.nick + ": " + msg.text);
    let li = createNode("li");
    if(msg.student_id == "15452"){
      li.className = "own_message"
    }
    var audio = new Audio('discord_message.mp3');
    audio.play();
    li.append(text);
    ul.append(li);
  }
});
