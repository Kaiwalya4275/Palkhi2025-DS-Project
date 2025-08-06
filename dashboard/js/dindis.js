async function loadDindiData() {
  const response = await fetch('../data/dindis_participation.csv');
  const csvText = await response.text();

  const rows = csvText.trim().split('\n');
  const headers = rows[0].split(',');

  const data = rows.slice(1).map(row => {
    const values = row.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i];
      return obj;
    }, {});
  });

  generateTable(headers, data);
  generateCharts(data);
}

function generateTable(headers, data) {
  const container = document.getElementById('dindi-table-container');
  const table = document.createElement('table');

  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  headers.forEach(h => {
    const th = document.createElement('th');
    th.innerText = h;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.forEach(row => {
    const tr = document.createElement('tr');
    headers.forEach(h => {
      const td = document.createElement('td');
      td.innerText = row[h];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

function generateCharts(data) {
  
  const labels = data.map(d => d.dindi_name);
  const participants = data.map(d => parseInt(d.total_participants));

  new Chart(document.getElementById('participantsChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Participants',
        data: participants,
        backgroundColor: '#ff9800'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Total Participants per Dindi'
        }
      }
    }
  });

  
  const maleRatios = data.map(d => parseFloat(d.gender_ratio.split(':')[0]));
  const femaleRatios = data.map(d => parseFloat(d.gender_ratio.split(':')[1]));

  new Chart(document.getElementById('genderRatioChart'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: 'Male Ratio', data: maleRatios, borderColor: '#1976d2', fill: false },
        { label: 'Female Ratio', data: femaleRatios, borderColor: '#e91e63', fill: false }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Gender Ratio per Dindi'
        }
      }
    }
  });

  
  const instrumentsCount = {};

  data.forEach(d => {
    const instruments = d.musical_instruments.split('/');
    instruments.forEach(inst => {
      instrumentsCount[inst] = (instrumentsCount[inst] || 0) + 1;
    });
  });

  const instLabels = Object.keys(instrumentsCount);
  const instData = Object.values(instrumentsCount);

  new Chart(document.getElementById('instrumentUsageChart'), {
    type: 'doughnut',
    data: {
      labels: instLabels,
      datasets: [{
        label: 'Instrument Usage',
        data: instData,
        backgroundColor: ['#f44336', '#4caf50', '#2196f3', '#ff9800', '#9c27b0']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Musical Instrument Distribution'
        }
      }
    }
  });
}

loadDindiData();
