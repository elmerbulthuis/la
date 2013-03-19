/*jslint
	node: true,
*/
"use strict";

var ValueFuture = require('../lib/ValueFuture');
var LazyFuture = require('../lib/LazyFuture');


module.exports['check parallel'] = function (beforeExit, assert) {
	var
		c = 0,
		limit = 2,
		
		one = new LazyFuture(function (cb) {
			c += 1;
			setTimeout(function () {
				c -= 1;
				assert.ok(c < limit, c + ' should be less then ' + limit);
				cb(null, 1);
			}, 1000);
		}),
		
		two = new LazyFuture(function (cb) {
			c += 1;
			setTimeout(function () {
				c -= 1;
				assert.ok(c < limit, c + ' should be less then ' + limit);
				cb(null, 2);
			}, 1000);
		}),

		three = new LazyFuture(function (cb) {
			c += 1;
			setTimeout(function () {
				c -= 1;
				assert.ok(c < limit, c + ' should be less then ' + limit);
				cb(null, 3);
			}, 1000);
		}),
	
		four = new LazyFuture(function (cb) {
			c += 1;
			setTimeout(function () {
				c -= 1;
				assert.ok(c < limit, c + ' should be less then ' + limit);
				cb(null, 4);
			}, 1000);
		}),
	
		five = new LazyFuture(function (cb) {
			c += 1;
			setTimeout(function () {
				c -= 1;
				assert.ok(c < limit, c + ' should be less then ' + limit);
				cb(null, 5);
			}, 1000);
		}),
	
		six = new LazyFuture(function (cb) {
			c += 1;
			setTimeout(function () {
				c -= 1;
				assert.ok(c < limit, c + ' should be less then ' + limit);
				cb(null, 6);
			}, 1000);
		}),

		sum = new LazyFuture(one, two, three, four, five, six, function (one, two, three, four, five, six, cb) {
			cb(null, one + two + three + four + five + six);
		});

	sum.get(function (err, value) {
		assert.equal(value, 21);
	});

};
