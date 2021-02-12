<?php

header('Content-Type: application/json');

session_start();

if ($_SERVER['REQUEST_METHOD'] != 'PUT') {
  http_response_code(405);
  echo "Error : method not allowed";
  exit; 
}

$sessionList = array();

if(isset($_SESSION["list"]) && is_array($_SESSION["list"])) {

  foreach($_SESSION["list"] as $todo) {
    array_push($sessionList, $todo);
  }
}

$list = json_decode(file_get_contents("php://input"));

if($list != null) {
  $sessionList["$list->id"] = json_encode($list);
}

$_SESSION["list"] = $sessionList;