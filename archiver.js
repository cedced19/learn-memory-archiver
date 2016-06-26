#!/usr/bin/env node
'use strict';

var got = require('got'),
    schedule = require('node-schedule'),
    fs = require('fs'),
    log = require('./lib/log'),
    isUrl = require('is-url'),
    moment = require('moment'),
    isThere =  require('is-there');

if (!isThere(__dirname + '/config.json')) {
  log('You must create config.json file!', true);
  process.exit(1);
}

if (!isUrl(require('./config.json').url)) {
  log('You must set a valid url in config.json file!', true);
  process.exit(1);
}

if (!isThere(__dirname + '/saves')) {
  fs.mkdirSync(__dirname + '/saves');
  log('Saves directory created.', false);
}

var save = function () {
  var config = require('./config.json');
  got(config.url + '/api/long', function (err, data) {
       if (err) log('There was an error in getting data.', true);
       var name = moment().format('HH-mm-DD-MM-YYYY')  + '.json';
       fs.writeFile(process.cwd() + '/saves/' + name, data, function (err) {
         if (err) log('There was an error in writing file.', true);
         log('Done! Generated in ' + name, false);
       });
   });
};


save();
schedule.scheduleJob('0 0 0,12 * * * ', function(){
    save();
});
