var app = require('express')();
var server = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(server);

var filePath = 'logs.txt';
var fileContents = fs.readFileSync(filePath, 'utf-8');
var oldLogs = fileContents.split("\n").map(line => line.trim());

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
})

io.on('connection', function(socket) {
	console.log("Connection");

	fs.watch(filePath, { persistent: true }, function(data) {
		fileContents = fs.readFileSync(filePath, 'utf-8');
		var newLogs = fileContents.split("\n").map(line => line.trim());
		if(newLogs.length > oldLogs.length) {
			var newLines = newLogs.slice(oldLogs.length, newLogs.length);
			newLines = newLines.map(line => "<br>" + line);
			oldLogs = newLogs;
			socket.send(newLines);
		}
	});
})


server.listen(8080);