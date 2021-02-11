<?php

header('Content-Type: application/json');

session_start();

if ($_SERVER['REQUEST_METHOD'] != 'PUT') {
  http_response_code(405);
  echo "Error : method not allowed";
  exit; 
}

echo $_SESSION;