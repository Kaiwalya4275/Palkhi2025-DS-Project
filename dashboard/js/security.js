fetch('../data/security_data.csv')
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split('\n').slice(1).map(r => r.split(','));

    
    const tbody = document.querySelector('#securityTable tbody');
    rows.forEach(r => {
      const tr = document.createElement('tr');
      [0,1,2,3,4,5,6,7,8,11].forEach(i => {
        const td = document.createElement('td');
        td.textContent = r[i];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    
    const locationMap = {}, dateMap = {}, shiftMap = {Morning:0,Afternoon:0,Night:0};
    let cctvYes = 0, cctvNo = 0, highSecure = 0, notSecure = 0;

    rows.forEach(r => {
      const location = r[1];
      const date = r[2];
      const personnel = parseInt(r[4]);
      const cctv = r[6];
      const secure = r[10];
      const shift = r[11];

      locationMap[location] = (locationMap[location] || 0) + personnel;
      dateMap[date] = (dateMap[date] || 0) + personnel;
      if (cctv === "Yes") cctvYes++; else cctvNo++;
      if (secure === "1") highSecure++; else notSecure++;
      shiftMap[shift] = (shiftMap[shift] || 0) + 1;
    });

    
    new Chart(document.getElementById('personnelChart'), {
      type: 'bar',
      data: {
        labels: Object.keys(locationMap),
        datasets: [{
          label: 'Personnel Count',
          data: Object.values(locationMap),
          backgroundColor: '#fb8c00'
        }]
      }
    });

    
    new Chart(document.getElementById('cctvChart'), {
      type: 'pie',
      data: {
        labels: ['CCTV Deployed', 'Not Deployed'],
        datasets: [{
          data: [cctvYes, cctvNo],
          backgroundColor: ['#00c853', '#d32f2f']
        }]
      }
    });

    
    new Chart(document.getElementById('trendChart'), {
      type: 'line',
      data: {
        labels: Object.keys(dateMap),
        datasets: [{
          label: 'Total Personnel',
          data: Object.values(dateMap),
          fill: true,
          borderColor: '#3949ab',
          backgroundColor: 'rgba(57,73,171,0.2)'
        }]
      }
    });

    
    new Chart(document.getElementById('shiftChart'), {
      type: 'radar',
      data: {
        labels: Object.keys(shiftMap),
        datasets: [{
          label: 'Shift Coverage',
          data: Object.values(shiftMap),
          backgroundColor: 'rgba(0,150,136,0.3)',
          borderColor: '#009688'
        }]
      }
    });

    
    new Chart(document.getElementById('secureChart'), {
      type: 'doughnut',
      data: {
        labels: ['Highly Secured', 'Normal'],
        datasets: [{
          data: [highSecure, notSecure],
          backgroundColor: ['#43a047', '#ffa000']
        }]
      }
    });
  });
