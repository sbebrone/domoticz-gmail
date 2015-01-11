var google = require('googleapis'),
    gmail = google.gmail('v1'),
    OAuth2Client = google.auth.OAuth2,
    config = require('./config');

var Gmail = function() {

    var CLIENT_ID = config.getKey('google:client-id');
    var CLIENT_SECRET = config.getKey('google:client-secret');
    var REDIRECT_URL = config.getKey('google:redirect-url');
    var ACCESS_TOKEN = config.getKey('google:access-token');
    var REFRESH_TOKEN = config.getKey('google:refresh-token');

    var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

    oauth2Client.setCredentials({
        access_token: ACCESS_TOKEN,
        refresh_token: REFRESH_TOKEN
    });


    function refreshToken(oauth2Client, done) {
        oauth2Client.refreshAccessToken(function(err, tokens) {
            console.log('token refreshed');
            config.writeKey('google:access-token', tokens.access_token);
            start(done);
        });
    }

    function trash(oauth2Client, id, last, done) {
        gmail.users.messages.trash({ userId: 'me', id: id, auth: oauth2Client }, function(x,success) {
            console.log('Deleted message ' + id);
            if(last) {
                done(true);
            }
        });
    }

    function readMessage(oauth2Client, messages, done) {
        messages.forEach(function(message, index) {
            gmail.users.messages.get({ userId: 'me', id: message.id, auth: oauth2Client, fields: 'id,snippet' }, function(err, result) {
                trash(oauth2Client, message.id, index === messages.length - 1, done); 
            });
        });
    }

    function readAllMessages(oauth2Client, done) {
        console.log('read all messages');
        gmail.users.messages.list({ userId: 'me', auth: oauth2Client, q:'is:unread' }, function(err, result) {
            if (err) {
                if(err.code === 401) {
                    refreshToken(oauth2Client, done);
                    return;
                }
                console.log('An error occured', err);
                done(false);
                return;
            }
            if(!result.messages) {
                done(false);
                return;
            }
            console.log('Found ' + result.messages.length + ' new messages');
            readMessage(oauth2Client, result.messages, done);
        });
    }

    function start(done) {
        readAllMessages(oauth2Client,done);
    }

    return {
        hasNewMail:start
    };

}();

module.exports = Gmail;

