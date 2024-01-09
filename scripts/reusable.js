document.addEventListener('DOMContentLoaded', function() {
    fetch('../styles/footer.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('footerContent').innerHTML = data;
      });
  });