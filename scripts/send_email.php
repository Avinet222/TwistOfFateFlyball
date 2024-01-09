<?php
//https://github.com/PHPMailer/PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer/src/Exception.php';
require '../PHPMailer/src/PHPMailer.php';
require '../PHPMailer/src/SMTP.php';


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Replace with your email and password
    $toEmail = "avinet222@gmail.com";
    $emailPassword = "oqev aqkw eayr pylg "; // Your email password
    
    // Retrieve form data
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $message = trim($_POST["message"]);
    $subject = trim($_POST["subject"]);
    
    // Check if all fields are filled
        
        // Email content
        $emailContent = "<b>Name:</b> $name\n";
        $emailContent .= "<b>Email:</b> $email\n";
        $emailContent .= "<b>Message:</b> $message\n";
        
        // Create PHPMailer object
        $mail = new PHPMailer(true);

        try {
            //Server settings
            $mail->SMTPDebug = SMTP::DEBUG_SERVER;  //Enable verbose debug output
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = $toEmail; // Your Gmail email address
            $mail->Password = $emailPassword; // Your Gmail password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = 465; // Port for TLS/STARTTLS

            //Recipients
            $mail->setFrom($email, $name);
            $mail->addAddress($toEmail);

            //Content
            $mail->isHTML(true);
            $mail->Subject = $name . ' - ' . $subject;
            $mail->Body = $emailContent;


            // Send email
            if ($mail->send()) {
                echo "Your message has been sent successfully!";
            } else {
                echo "Oops! Something went wrong. Please try again later.";
            }
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    }
?>

