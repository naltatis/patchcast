/*jshint node: true, eqeqeq: true, undef: true, devel: true */

var ID3 = require('id3'),
	http = require('http'),
	https = require('https'),
	url = require('url');

function makeRequest(path, callback) {
	var urlInfo = url.parse(path);  

	var reqUrl = urlInfo.pathname || '/';
		reqUrl += urlInfo.search || '';
		reqUrl += urlInfo.hash || '';

	var opts = {
		host: urlInfo.hostname,
		port: urlInfo.port || (urlInfo.protocol === 'https' ? 443 : 80),
		path: reqUrl,
		method: 'GET'
	};
	console.log(opts);

	var protocol = (urlInfo.protocol === 'https:' ? https : http);

	var req = protocol.request(opts, function(res) {
		if (res.statusCode !== 200) {
			console.log("request failed", opts);
			return;
		}
		
		res.addListener('data', function (chunk) {
			callback(chunk, res.headers['content-length']);
			res.pause();
		});
	});
	req.end();
}

function metadata(path, callback) {
	
	makeRequest(path, function (data, size) {
		var id3Data = new ID3(new Buffer(data));
		id3Data.parse();
		
		console.log(id3Data.getTags());
		callback({
			title: id3Data.get('title'),
			artist: id3Data.get('artist'),
			album: id3Data.get('album'),
			size: size
		});
	});
}

module.exports = metadata; 