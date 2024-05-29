// Create web server
// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var comments = [];
var server = http.createServer(function(req, res){
	var urlObj = url.parse(req.url);
	var pathName = urlObj.pathname;
	if(pathName == '/'){
		pathName = '/index.html';
	}
	if(pathName == '/index.html'){
		var htmlPath = path.join(__dirname, pathName);
		var fileContent = fs.readFileSync(htmlPath);
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(fileContent);
		res.end();
	}else if(pathName == '/submit'){
		var postData = '';
		req.setEncoding('utf8');
		req.on('data', function(chunk){
			postData += chunk;
		});
		req.on('end', function(){
			var comment = qs.parse(postData);
			comments.push(comment);
			console.log(comments);
			// res.end('submit success');
			res.statusCode = 302;
			res.setHeader('Location', '/');
			res.end();
		});
	}else if(pathName == '/comment'){
		var commentStr = JSON.stringify(comments);
		res.end(commentStr);
	}else{
		var filePath = path.join(__dirname, pathName);
		if(fs.existsSync(filePath)){
			var fileContent = fs.readFileSync(filePath);
			res.end(fileContent);
		}else{
			res.writeHead(404, {'Content-Type': 'text/plain'});
			res.end('can not find the file');
		}
	}
});

server.listen(8080, 'localhost', function(){
	console.log('Server is running at http://localhost:8080');
});