fetch('../data/donations_financials.csv')
  .then(res => res.text())
  .then(data => {
    const rows = data.trim().split('\n').slice(1).map(row => row.split(','));

    const tbody = document.querySelector('#donationTable tbody');
    rows.forEach(r => {
      const tr = document.createElement('tr');
      for (let i = 0; i <= 10; i++) {
        const td = document.createElement('td');
        td.textContent = r[i];
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });

    
    const donorTypes = {}, netBalances = [], dates = [], paymentModes = {};
    const expenseTypes = {};

    rows.forEach(r => {
      const donorType = r[3];
      const amount = parseFloat(r[5]) || 0;
      donorTypes[donorType] = (donorTypes[donorType] || 0) + amount;

      const date = r[2];
      const balance = parseFloat(r[10]) || 0;
      dates.push(date);
      netBalances.push(balance);

      const expense = r[6];
      expenseTypes[expense] = (expenseTypes[expense] || 0) + 1;

      const payMode = r[8];
      paymentModes[payMode] = (paymentModes[payMode] || 0) + 1;
    });

    new Chart(document.getElementById('barChart'), {
      type: 'bar',
      data: {
        labels: Object.keys(donorTypes),
        datasets: [{
          label: 'Total Donations by Donor Type',
          data: Object.values(donorTypes),
          backgroundColor: ['#2196f3', '#f44336', '#ff9800', '#4caf50', '#9c27b0']
        }]
      }
    });

    
    new Chart(document.getElementById('pieChart'), {
      type: 'pie',
      data: {
        labels: Object.keys(expenseTypes),
        datasets: [{
          data: Object.values(expenseTypes),
          backgroundColor: ['#ffcc80', '#ff8a65', '#4db6ac', '#9575cd', '#7986cb']
        }]
      }
    });

    
    new Chart(document.getElementById('lineChart'), {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Net Balance ()',
          data: netBalances,
          fill: true,
          borderColor: '#3f51b5',
          backgroundColor: 'rgba(63,81,181,0.2)'
        }]
      }
    });

    
    new Chart(document.getElementById('radarChart'), {
      type: 'radar',
      data: {
        labels: Object.keys(paymentModes),
        datasets: [{
          label: 'Payment Method Frequency',
          data: Object.values(paymentModes),
          backgroundColor: 'rgba(255, 205, 86, 0.4)',
          borderColor: 'rgb(255, 205, 86)'
        }]
      }
    });
  });
