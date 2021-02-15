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

if($_GET['id'] == null) {
  $_SESSION["list"] = [];
} else {
  if(isset($_SESSION["list"]) && is_array($_SESSION["list"])) {

    foreach($_SESSION["list"] as $todo) {
  
      $todo = json_decode($todo);
  
      if($todo->id == $_GET['id']) {
        $todo->trash = true;
      }
  
      array_push($sessionList, json_encode($todo));
    }
  }
  
}

$_SESSION["list"] = $sessionList;