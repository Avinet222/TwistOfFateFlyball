<?php
    session_start();

    if (isset($_SESSION['loggedIn']) && $_SESSION['loggedIn'] === true) {
        echo json_encode(array('authenticated' => true));
    } else {
        echo json_encode(array('authenticated' => false));
    }
?>
