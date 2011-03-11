/*global require*/

var db = require('riak-js').getClient(),
	express = require('express'),
	app = express.createServer(),
	bucket = 'podcasts',
	key = 'my';

// config
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(express.bodyParser());

// list
app.get('/', function (req, res) {
	var model = {
		youAreUsingJade: true,
		items: [1, 123, 123123]
	};
	
	res.render('index', model);
});

// add
app.post('/', function (req, res) {
	var data = {
		url: req.body,
		timestamp: new Date().getTime()
	};
	
	db.get(bucket, key, function (err, entries) {
		if (err) {
			entries = [data];
		} else {
			entries.push(data);
		}
		db.save(bucket, key, entries, function () {
			res.redirect('/');
		});
	});
});

app.listen(3000);