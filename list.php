<?php

header('Content-Type: application/json');

session_start();

if ($_SERVER['REQUEST_METHOD'] != 'GET') {
  http_response_code(405);
  echo "Error : method not allowed";
  exit;
}

if($_SESSION["list"] != null) {
  echo json_encode($_SESSION["list"]);
}