var util = require('util'),
    request = require('request'),
    config = require('./config');

var Domoticz = function() {

    var _request, pushOn; 
    var URL = '/json.htm?type=command&param=switchlight&idx=%s&level=0&switchcmd=%s';

    _request = function(url) {
        request({
            url:url,
            json:true,
        }, function(err, response, body) {
            console.log(body);
        });
    };

    pushOn = function(setOn) {
        var url = config.getKey('domoticz:host') + util.format(URL, config.getKey('domoticz:idx'), setOn ? 'On' : 'Off');
        _request(url);
    };

    return {
        pushOn:pushOn
    };
}();

module.exports = Domoticz;
