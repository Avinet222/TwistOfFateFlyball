<?php

    session_start();

    // Logout the session
    session_destroy();

    // Redirect to the login page or any other desired page
    header("Location: ../pages/home.html");
    exit();

?>