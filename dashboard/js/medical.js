fetch('../data/medical_support.csv')
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split('\n').slice(1).map(r => r.split(','));
    const tableBody = document.querySelector('#medicalTable tbody');

    
    rows.forEach(r => {
      const tr = document.createElement('tr');
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(i => {
        const td = document.createElement('td');
        td.textContent = r[i];
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });

    
    const ambulanceData = rows.reduce((acc, r) => {
      acc[r[5]] = (acc[r[5]] || 0) + 1;
      return acc;
    }, {});

    new Chart(document.getElementById('ambulanceChart'), {
      type: 'pie',
      data: {
        labels: Object.keys(ambulanceData),
        datasets: [{
          label: 'Ambulance Availability',
          data: Object.values(ambulanceData),
          backgroundColor: ['#43aa8b', '#f94144']
        }]
      }
    });

    
    const locations = rows.map(r => r[1]);
    const patients = rows.map(r => parseInt(r[8]));

    new Chart(document.getElementById('patientsChart'), {
      type: 'bar',
      data: {
        labels: locations,
        datasets: [{
          label: 'Avg Patients/Day',
          data: patients,
          backgroundColor: '#ffb703'
        }]
      },
      options: { indexAxis: 'y' }
    });

    
    const stockLevels = rows.reduce((acc, r) => {
      acc[r[6]] = (acc[r[6]] || 0) + 1;
      return acc;
    }, {});

    new Chart(document.getElementById('stockChart'), {
      type: 'doughnut',
      data: {
        labels: Object.keys(stockLevels),
        datasets: [{
          label: 'Stock Levels',
          data: Object.values(stockLevels),
          backgroundColor: ['#90be6d', '#f9c74f', '#f94144']
        }]
      }
    });

    
    const staff = rows.map(r => parseInt(r[4]));
    const loadRatio = patients.map((p, i) => (staff[i] > 0 ? p / staff[i] : 0));

    new Chart(document.getElementById('loadChart'), {
      type: 'line',
      data: {
        labels: locations,
        datasets: [{
          label: 'Patients per Staff',
          data: loadRatio,
          borderColor: '#577590',
          backgroundColor: 'rgba(87, 117, 144, 0.2)',
          fill: true
        }]
      }
    });

    
    const emergency = rows.reduce((acc, r) => {
      const loc = r[1];
      if (!acc[loc]) acc[loc] = [0, 0, 0]; 
      acc[loc][0] += r[9] === 'Yes' ? 1 : 0;
      acc[loc][1] += parseInt(r[10]);
      acc[loc][2] += parseInt(r[13]);
      return acc;
    }, {});

    const radarLabels = Object.keys(emergency);
    const radarData = {
      emergency: radarLabels.map(l => emergency[l][0]),
      equipment: radarLabels.map(l => emergency[l][1]),
      demand: radarLabels.map(l => emergency[l][2])
    };

    new Chart(document.getElementById('radarChart'), {
      type: 'radar',
      data: {
        labels: radarLabels,
        datasets: [
          {
            label: 'Emergency Services',
            data: radarData.emergency,
            borderColor: '#f94144',
            backgroundColor: 'rgba(249, 65, 68, 0.2)'
          },
          {
            label: 'Fully Equipped',
            data: radarData.equipment,
            borderColor: '#90be6d',
            backgroundColor: 'rgba(144, 190, 109, 0.2)'
          },
          {
            label: 'High Demand',
            data: radarData.demand,
            borderColor: '#577590',
            backgroundColor: 'rgba(87, 117, 144, 0.2)'
          }
        ]
      }
    });
  });
