var domoticz = require('./domoticz'),
    gmail = require('./gmail');

gmail.hasNewMail(function(hasNew) {
    domoticz.pushOn(hasNew);
});
