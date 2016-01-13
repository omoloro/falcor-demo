var http = require('http');
var port = process.argv[2];

var server = http.createServer(httpCallback);

var handledPath = '/users';

function httpCallback(request, response) {
    var requestPath = request.url;
    if (requestPath.indexOf(handledPath) > -1) {
        handleValidRequest(requestPath, response);
    } else {
        sendError(response);
    }
    response.end();
}

function handleValidRequest(requestPath, response) {
    requestPath = requestPath.replace(handledPath, '');
    var userId = requestPath.replace('/', '');

    if (userId.length === 0) {
        sendSuccess(getAllUsers(), response);
    } else {
        var users = getAllUsers();
        var user = users[userId];

        if (typeof user === 'undefined') {
            sendError(response);
        } else {
            var data = {};
            data[userId] = user;
            sendSuccess(data, response);
        }
    }
}

function getAllUsers() {
    return {
        123: {
            user_id: 123,
            balance: 23004.24,
            fraud_risk: 'low'
        }
    }
}

function sendError(response) {
    var body = {
        status: 'error',
        message: 'Not Found'
    };
    response.writeHead(404, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(body));
}

function sendSuccess(data, response) {
    var body = {
        status: 'success',
        data: data
    };
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(body));
}

server.listen(port);
