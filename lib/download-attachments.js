'use strict';

var got = require('got'),
    fs = require('fs'),
    path = require('path'),
    asyncEach = require('async-each'),
    download = require('download'),
    isThere =  require('is-there');

var diff = function (arr1, arr2) {
  return arr1.filter(function(i) {return arr2.indexOf(i) < 0;});
};

module.exports = function (url, callback) {
  got(url + '/api/attachments', function (err, data) {
       if (err) return callback('There was an error in getting attachments.');
       var baseURL = url + '/attachments/';
       var files = JSON.parse(data);

       // Download only new files
       fs.readdir(path.resolve(__dirname, '../saves/attachments/'), function (err, savedFiles) {
        if(err) return callback('There was an error in listing attachments');

        asyncEach(diff(files, savedFiles), function (file, cb) {
          download(baseURL + file).pipe(fs.createWriteStream(path.resolve(__dirname, '../saves/attachments', file)));
        }, function (err) {
          if (err) callback('There was an error in downloading attachments.');
          callback(null);
        });
       });
   });
}
