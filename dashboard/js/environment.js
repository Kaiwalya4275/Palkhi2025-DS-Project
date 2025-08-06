

fetch('../data/environmental_impact.csv')
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split('\n').slice(1).map(row => row.split(','));
    
    
    const tbody = document.querySelector('#environmentTable tbody');
    rows.forEach(r => {
      const tr = document.createElement('tr');
      [0,1,2,3,11,10,6,7,12,13,9].forEach(i => {
        const td = document.createElement('td');
        td.textContent = r[i];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    
    const topWaste = rows
      .sort((a, b) => parseFloat(b[3]) - parseFloat(a[3]))
      .slice(0, 10);

    const wasteLabels = topWaste.map(r => r[1]);
    const wasteData = topWaste.map(r => parseFloat(r[3]));

    const plasticData = rows.map(r => parseFloat(r[11]));
    const recyclableCount = rows.filter(r => r[5] === "Yes").length;
    const nonRecyclableCount = rows.length - recyclableCount;

    const scores = rows.map(r => parseFloat(r[7]));
    const scoreLabels = rows.map(r => r[1]);

    const volunteerLabels = rows.map(r => r[1]);
    const volunteerData = rows.map(r => parseInt(r[12]));

    
    new Chart(document.getElementById('wasteChart'), {
      type: 'bar',
      data: {
        labels: wasteLabels,
        datasets: [{
          label: 'Waste Collected (kg)',
          data: wasteData,
          backgroundColor: '#2a9d8f'
        }]
      }
    });

    
    new Chart(document.getElementById('plasticChart'), {
      type: 'pie',
      data: {
        labels: ['Recyclable', 'Non-Recyclable'],
        datasets: [{
          data: [recyclableCount, nonRecyclableCount],
          backgroundColor: ['#43aa8b', '#f94144']
        }]
      }
    });

    
    new Chart(document.getElementById('enforcementChart'), {
      type: 'line',
      data: {
        labels: scoreLabels,
        datasets: [{
          label: 'Enforcement Score',
          data: scores,
          fill: false,
          borderColor: '#264653',
          tension: 0.2
        }]
      }
    });

    
    new Chart(document.getElementById('volunteerChart'), {
      type: 'radar',
      data: {
        labels: volunteerLabels,
        datasets: [{
          label: 'Volunteers',
          data: volunteerData,
          backgroundColor: 'rgba(255, 206, 86, 0.3)',
          borderColor: 'rgb(255, 206, 86)'
        }]
      }
    });

  });
