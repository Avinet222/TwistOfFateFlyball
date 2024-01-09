<?php
    // database details
    $host = "localhost";
    $usernamedb = "root";
    $passworddb = "";
    $dbname = "tof_database";

    // creating a connection
    $con = mysqli_connect($host, $usernamedb, $passworddb, $dbname);

    if(!$con){
        die("Connection failed!" . mysqli_connect_error());
    }

    return $con;
?>