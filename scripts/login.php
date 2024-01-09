<?php

    // Get the submitted form data
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Validate the form data (you may need to add more validation logic)
    if (empty($username) || empty($password)) {
        header("Location: ../pages/login.html");
        return;
    }

    // Connect to the database
    $con = require_once('../scripts/connection.php');

    // Check if the user exists in the database
    $sql = "SELECT * FROM admins WHERE username = '$username'";
    $result = mysqli_query($con, $sql);

    if (mysqli_num_rows($result) == 0) {
        header("Location: ../pages/login.html");
        return;
    }

    // Check if the password is correct
    $row = mysqli_fetch_assoc($result);
    if ($row['password'] != $password) {
        header("Location: ../pages/login.html");
        return;
    }
	
	session_start();
    // Set the session variables
    $_SESSION['username'] = $username;
    $_SESSION['user_id'] = $row['id'];
	$_SESSION["loggedIn"] = true;

    // Redirect the user to the user dashboard
    header("Location: ../pages/admin_dashboard.html");

    // Close the database connection
    mysqli_close($con);

   
?>