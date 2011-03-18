/*global require*/

var db = require('redis-client').createClient(),
	express = require('express'),
	metadata = require('model/metadata'),
	relativeDate = require('relative-date'),
	app = express.createServer(),
	key = 'mypodcasts';

// config
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

// list
app.get('/', function (req, res) {
	db.get(key, function (err, entries) {
		var model = {
			entries: JSON.parse(entries),
			relativeDate: relativeDate
		};
		res.render('index', model);
	});
});

// list
app.get('/feed', function (req, res) {
	res.contentType("text/xml");
	db.get(key, function (err, entries) {
		var model = {
			entries: JSON.parse(entries)
		};
		res.render('feed', model);
	});
});

// add
app.post('/', function (req, res) {
	console.log('getting meta data');
	metadata(req.body.url, function (meta) {
		console.log('got meta data');
		var data = {
			url: req.body.url,
			timestamp: new Date().getTime(),
			title: meta.title,
			album: meta.album,
			artist: meta.artist,
			size: meta.size
		};
		
		db.get(key, function (err, entries) {
			entries = JSON.parse(entries);

			if (entries) {
				entries.push(data);
			} else {
				entries = [data];
			}

			db.set(key, JSON.stringify(entries), function () {
				res.redirect('/');
			});
		});
	});
});

// del
app.del('/', function (req, res) {
	db.del(key, function (err) {
		res.redirect('/');
	});
});

db.stream.addListener("connect", function () {});

app.listen(80);