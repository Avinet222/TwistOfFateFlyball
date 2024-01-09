$(document).ready(function() {
    $.ajax({
        url: '../scripts/checkSession.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.authenticated) {
                document.getElementById('dashboardButton').style.display = 'inline';
                document.getElementById('logoutButton').style.display = 'inline';
                document.getElementById('loginButton').style.display = 'none';
            } else {
                document.getElementById('dashboardButton').style.display = 'none';
                document.getElementById('logoutButton').style.display = 'none';
                document.getElementById('loginButton').style.display = 'inline';
            }
        },
        error: function() {
            console.log('Error checking session.');
        }
    });
});