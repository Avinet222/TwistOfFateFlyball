<?php
// Function to execute SQL query
  function executeSQL($sql) {

    // Create connection
    $conn = require_once("../scripts/connection.php");
    $conn->set_charset("utf8");
   
    // Execute query
    if ($result = $conn->query($sql)) {
      $data = array();
      if ($result->num_rows > 0) {
          // Fetch data and store in an array
          while ($row = $result->fetch_assoc()) {
              $data[] = $row;
          }
          header('Content-Type: application/json');
          echo json_encode(array('result' => $data), JSON_UNESCAPED_UNICODE);
      } else {
          echo json_encode(array('message' => 'No results found'));
      }
    } else {
      echo json_encode(array('error' => 'Error executing SQL query: ' . $conn->error));
    }

    // Close connection
    $conn->close();
   }
   
   // Check if the request contains the SQL query parameter
   if (isset($_POST['sqlQuery'])) {
       // Retrieve and sanitize SQL query
       $sql = $_POST['sqlQuery'];
   
       // Execute SQL query
       executeSQL($sql);
   } else {
       echo "Invalid request!";
   }
?>