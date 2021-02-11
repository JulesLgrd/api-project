<?php

session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
  http_response_code(405);
  echo "Error : method not allowed";
  exit;
}

$list = file_get_contents("php://input");

$sessionList = array();

if(isset($_SESSION["list"]) && is_array($_SESSION["list"])) {

  foreach($_SESSION["list"] as $todo) {
    array_push($sessionList, $todo);
  }
}

array_push($sessionList, $list);

$_SESSION["list"] = $sessionList;