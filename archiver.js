#!/usr/bin/env node
'use strict';

var got = require('got'),
    schedule = require('node-schedule'),
    fs = require('fs'),
    path = require('path'),
    log = require('./lib/log'),
    downloadAttachments = require('./lib/download-attachments'),
    isUrl = require('is-url'),
    moment = require('moment'),
    isThere =  require('is-there');

if (!isThere(path.resolve(__dirname, './config.json'))) {
  log('You must create config.json file!', true);
  process.exit(1);
}

if (!isUrl(require('./config.json').url)) {
  log('You must set a valid url in config.json file!', true);
  process.exit(1);
}

if (!isThere(path.resolve(__dirname, './saves/'))) {
  fs.mkdirSync(path.resolve(__dirname, './saves/'));
  log('Saves directory created.', false);
}

var save = function () {
  var config = require('./config.json');
  got(config.url + '/api?createdAt&content&attachments', function (err, data) {
       if (err) log('There was an error in getting data.', true);
       var name = moment().format('HH-mm-DD-MM-YYYY')  + '.json';
       fs.writeFile(path.resolve(__dirname, './saves/',name), data, function (err) {
         if (err) log('There was an error in writing file.', true);

         log('Done! Generated in ' + name, false);
         if (config.attachments) {
           if (!isThere(path.resolve(__dirname, './saves/attachments/'))) {
             fs.mkdirSync(path.resolve(__dirname, './saves/attachments/'));
             log('Attachments directory created.', false);
           }

           downloadAttachments(config.url, function (err) {
             if (err) log(err, true);
             log('Attachments saved.', false);
           });
         }
       });
   });
};


save();
schedule.scheduleJob('0 0 0,12 * * * ', function(){
    save();
});
