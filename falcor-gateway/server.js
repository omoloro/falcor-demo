var falcorExpress = require('falcor-express');
var Router = require('falcor-router');
var express = require('express');
var request = require('request-promise');

var app = express();

app.use('/users', falcorExpress.dataSourceRoute(function (req, res) {
    return new Router([
        {
            route: "users[{integers:userIds}]['username','first_name','last_name']",
            get: function (pathSet) {
                var userKeys = pathSet[2];
                var userId = pathSet['userIds'][0];
                var requestUrl = 'http://local.user.com/users/' + userId;
                return request(requestUrl).
                    then(function(users) {
                        var userObject = JSON.parse(users);
                        userObject = userObject.data;
                        var response = {};
                        var jsonGraphResponse = response['jsonGraph'] = {};
                        var usersById = jsonGraphResponse['users'] = {};
                        pathSet.userIds.forEach(function(userId) {
                            var responseUser = userObject[userId];
                            var user = {};
                            if (responseUser.error) {
                                usersById[userId] = error(responseUser.error);
                            } else {
                                if (typeof userKeys == 'object') {
                                    userKeys.forEach(function(key) {
                                        user[key] = responseUser[key];
                                    });
                                }
                                usersById[userId] = user;
                            }
                        });
                        return response;
                    });
            }
        },
        {
            route: "users[{integers:userIds}]['balance']",
            get: function (pathSet) {
                var userKeys = pathSet[2];
                var userId = pathSet['userIds'][0];
                var requestUrl = 'http://local.wallet.com/users/' + userId;
                return request(requestUrl).
                    then(function(users) {
                        var userObject = JSON.parse(users);
                        userObject = userObject.data;
                        var response = {};
                        var jsonGraphResponse = response['jsonGraph'] = {};
                        var usersById = jsonGraphResponse['users'] = {};
                        pathSet.userIds.forEach(function(userId) {
                            var responseUser = userObject[userId];
                            var user = {};
                            if (responseUser.error) {
                                usersById[userId] = error(responseUser.error);
                            } else {
                                if (typeof userKeys == 'object') {
                                    userKeys.forEach(function(key) {
                                        user[key] = responseUser[key];
                                    });
                                } else if (typeof userKeys == 'string') {
                                    user[userKeys] = responseUser[userKeys];
                                }
                                usersById[userId] = user;
                            }
                        });
                        return response;
                    });
            }
        }
    ]);
}));

app.use(express.static(__dirname + '/'));

var server = app.listen(4000);
