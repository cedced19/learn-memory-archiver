# Learn Memory Archiver

Save lessons from Learn Memory.

Each 12 hours (at 12:00 am and at 12:00 pm), it get all your lessons and save them in your server.

## Installation
```bash
$ git clone --depth=1 https://github.com/cedced19/learn-memory-archiver
$ cd ./learn-memory-archiver
$ npm install
$ npm start
```
## Import data to mongo from a JSON file
```bash
$ mongoimport --db sails --collection lessons --file <json file's path> --jsonArray
```
