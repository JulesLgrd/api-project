<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');

session_start();

if ($_SERVER['REQUEST_METHOD'] != 'DELETE') {
  http_response_code(405);
  echo "Error : method not allowed";
  exit;
}

$sessionList = array();

if(isset($_SESSION["list"]) && is_array($_SESSION["list"])) {

  foreach($_SESSION["list"] as $todo) {
    array_push($sessionList, $todo);
  }
  unset($sessionList[$_GET['id']]);
}

$_SESSION["list"] = $sessionList;