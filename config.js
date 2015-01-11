var yaml = require('js-yaml'),
    fs = require('fs');

var Config = function() {

    var _loadConfig, _keys, getKey, writeKey;
    var PATH = 'config.yml';

    _loadConfig = function() {
        try {
            _keys = yaml.safeLoad(fs.readFileSync(PATH));
        }
        catch(e) {
            console.log(e);
        }
    };

    getKey = function(key) {
        if(!_keys) {
            _loadConfig();
        }
        var keys = key.split(':');
        var value;
        keys.forEach(function(k) {
            if(!value) {
                value = _keys[k];
                return;
            }
            value = value[k];
        });
        return value;
    };

    writeKey = function(key, value) {
        var keys = key.split(':');
        var property;
        keys.forEach(function(k,i) {
            if(!property) {
                property = _keys[k];
                return;
            }
            if(i === keys.length - 1) {
                property[k] = value;
                return;
            }
            property = property[k];
        });
        var content = yaml.safeDump(_keys);
        fs.writeFileSync(PATH, content);
    };

    return {
        getKey:getKey,
        writeKey:writeKey
    };

}();

module.exports = Config;
