fetch('navbar.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('navbar-container').innerHTML = data;
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
      if (window.location.href.includes(link.getAttribute('href'))) {
        link.style.color = '#00f2ff';
        link.style.fontWeight = 'bold';
      }
    });
  });
