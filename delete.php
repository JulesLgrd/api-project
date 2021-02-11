<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');

session_start();

if ($_SERVER['REQUEST_METHOD'] != 'DELETE') {
  http_response_code(405);
  echo "Error : method not allowed";
  exit;
}

echo $_DELETE;

if(sizeof($_DELETE['id']) == 1) {
  array_splice($_SESSION["list"][$_DELETE['id']]);
} else if(sizeof($_DELETE['id']) > 1) {
  echo $_DELETE;
}

$list = file_get_contents("php://input");

echo $_SESSION;