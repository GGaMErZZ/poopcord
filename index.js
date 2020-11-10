const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");
const config = require("./config.json");

const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);

const gamedirectory = path.join(__dirname, "html");

app.use(express.static(gamedirectory));

httpserver.listen(3000);

var r;
var rooms = [];
var usernames = [];

io.on('connection', function(socket) {

	socket.on("join", function(room, username) {
		if (username.includes("[DEVELOPER]")) {
			rooms[socket.id] = room;
			r = room;
			username = "NOOB THAT TRIED TO PRETEND TO BE THE DEV";
			socket.leaveAll();
			socket.join(room);
			io.in(room).emit("recieve", "[Server] : " + username + " tried to pretend to be the develper lol");
			socket.emit("join", room);
		}
		if (username == "09123092184") {
			username = `[${config.roles[2]}] GGaMErZZ`;
		} else if (config.mods.includes(username)) {
			username = `[${config.roles[1]}]` + username;
		} else {
			username = `[${config.roles[0]}]` + username;
		}
		if (username != "[Random]") {
			rooms[socket.id] = room;
			usernames[socket.id] = username;
			socket.leaveAll();
			socket.join(room);
			io.in(room).emit("recieve", "[Server] : " + username + " has entered the chat. (" + room + ")");
			socket.emit("join", room);
			console.log("[Server] : " + username + " has entered the chat. (" + room + ")");
		}
	})

	socket.on("send", function(message) {
		io.in(rooms[socket.id]).emit("recieve", usernames[socket.id] + " : " + message);
		console.log(usernames[socket.id] + " : " + message);
	})



	socket.on("recieve", function(message) {
		socket.emit("recieve", message);
	})
})