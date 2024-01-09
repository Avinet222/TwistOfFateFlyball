$(document).ready(function () {
    $('#contactForm').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission

        var valid = true;
        var formData = $(this).serializeArray(); // Get form data as an array of objects

        formData.forEach(function (field) {
            if (field.value.trim() === "") { // Check if field value is empty
                $('#' + field.name).addClass("error");
                valid = false;
            } else {
                $('#' + field.name).removeClass("error");
            }
        });

        if (!valid) {
            // If any field is empty, stop further actions
            return;
        }

        $('#contactForm').html('<p>Sending...</p>');

        // Proceed with AJAX request only if form is valid
        $.ajax({
            type: 'POST',
            url: '../scripts/send_email.php',
            data: formData,
            success: function (response) {
                // Display success message on the page
                $('#contactForm').html('<p>Your message has been sent successfully! We will contact you soon.</p>');
            },
            error: function () {
                // Display error message on the page
                $('#contactForm').html('<p>Oops! Something went wrong. Please contact us directly at twistoffateflyball@gmail.com.</p>');
            }
        });
    });
});