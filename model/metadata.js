var ID3 = require('id3'),
	http = require('http'),
	https = require('https'),
	url = require('url');
	
module.exports = function (path, callback) {
	
	var parts = url.parse(path);

	var address = {host: parts.hostname,
		port: parts.port || 80,
		path: parts.pathname + (parts.search || "")
	};

	http.get(address, function (res) {
		res.on('data', function (chunk) {
			res.pause();

			var id3Data = new ID3(chunk);
			id3Data.parse();
			
			callback({
				title: id3Data.get('title'),
				artist: id3Data.get('artist'),
				album: id3Data.get('album')
			});
		});
		res.addListener('end', function() {
			_requestReceived(content, res.headers, callback);
		});
	});
};

/*
var http_client = {};

function makeRequest(url, callback) {
	var urlInfo = URL.parse(url);  

	var reqUrl = urlInfo.pathname || '/';
		reqUrl += urlInfo.search || '';
		reqUrl += urlInfo.hash || '';

	var opts = {
		host: urlInfo.hostname,
		port: urlInfo.port || (urlInfo.protocol == 'https' ? 443 : 80),
		path = reqUrl,
		method: 'GET'
	};

	var protocol = (urlInfo.protocol == 'https:' ? https : http);

	var req = protocol.request(opts, function(res) {
		var content = '';
		res.setEncoding('utf8');
		res.addListener('data', function(chunk) {
			content += chunk; 
		});
		res.addListener('end', function() {
			_requestReceived(content, res.headers, callback);
		});
	});*/