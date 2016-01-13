<?php
/**
 * This file handles requests to local.users.com/users
 */

$requestUri = $_SERVER['REQUEST_URI'];
$handledPath = '/users';

if (strpos($requestUri, $handledPath) === false) {
    sendError();
}

$userId = str_replace($handledPath, '', $requestUri);
$userId = str_replace('/', '', $userId);

if ($userId) {
    try {
        $userData = getUserData($userId); // Handle requests to /users/{userId}
        sendSuccess($userData);
    } catch(Exception $e) {
        sendError();
    }
} else {
    sendSuccess(getAllUsers()); // Handle requests to /users
}

function getUserData($userId)
{
    $users = getAllUsers();
    if (isset($users[$userId])) {
        $userData = $users[$userId];
        return [$userId => $userData];
    } else {
        throw new Exception('Unable to fetch user');
    }
}

function getAllUsers()
{
    return [
        '123' => [
            'user_id' => 123,
            'username' => 'omoloro',
            'first_name' => 'Omoloro',
            'last_name' => 'Oyegoke',
            'dob' => '12-Apr-1991',
            'status' => 'active',
        ],
        '124' => [
            'user_id' => 124,
            'username' => 'zack1920',
            'first_name' => 'Isaac',
            'last_name' => 'Asimov',
            'dob' => '02-Jan-1920',
            'status' => 'inactive',
        ]
    ];
}

function sendError()
{
    header('Content-Type: application/json', true, 404);
    $response = json_encode([
        'status' => 'error',
        'message' => 'Not Found',
    ]);
    echo $response;
}

function sendSuccess($data)
{
    header('Content-Type: application/json', true, 200);
    $response = json_encode([
        'status' => 'success',
        'data' => $data,
    ]);
    echo $response;
}
