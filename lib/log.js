var colors = require('colors');
var time = function () {
    var date = new Date(),
    h = date.getHours(),
    m = date.getMinutes();
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
};
module.exports = function (message, err){
    if (err) message = colors.red(message);
    console.log(colors.cyan('[' + time() + '] ') + message);
};
