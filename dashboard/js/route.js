document.addEventListener('DOMContentLoaded', () => {
  fetch('../data/route_details.csv')
    .then(response => response.text())
    .then(csv => {
      const rows = csv.trim().split('\n').slice(1);
      const tableBody = document.getElementById('route-table-body');

      const terrainCounts = {};
      const distance = [];
      const time = [];
      const routeLabels = [];
      const roadConditionCounts = {};
      let highwayTrue = 0, highwayFalse = 0;

      rows.forEach(row => {
        const cols = row.split(',');

        // Populate table
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${cols[0]}</td>
          <td>${cols[1]}</td>
          <td>${cols[2]}</td>
          <td>${cols[3]}</td>
          <td>${cols[4]}</td>
          <td>${cols[5]}</td>
          <td>${cols[6] === 'true' ? 'Yes' : 'No'}</td>
          <td>${cols[7]}</td>
          <td>${cols[8]}</td>
          <td>${cols[9]}</td>
        `;
        tableBody.appendChild(tr);

        // Charts data prep
        const terrain = cols[5];
        terrainCounts[terrain] = (terrainCounts[terrain] || 0) + 1;

        routeLabels.push(cols[0]);
        distance.push(+cols[3]);
        time.push(+cols[4]);

        const road = cols[7];
        roadConditionCounts[road] = (roadConditionCounts[road] || 0) + 1;

        if (cols[6] === 'true') highwayTrue++;
        else highwayFalse++;
      });

      // Chart 1: Terrain Type Distribution
      new Chart(document.getElementById('terrainChart'), {
        type: 'pie',
        data: {
          labels: Object.keys(terrainCounts),
          datasets: [{
            data: Object.values(terrainCounts),
            backgroundColor: ['#f44336', '#ff9800', '#4caf50', '#2196f3', '#9c27b0']
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Terrain Type Distribution'
            }
          }
        }
      });

      // Chart 2: Distance vs Time per Route
      new Chart(document.getElementById('distanceTimeChart'), {
        type: 'line',
        data: {
          labels: routeLabels,
          datasets: [
            {
              label: 'Distance (km)',
              data: distance,
              borderColor: '#42a5f5',
              fill: false
            },
            {
              label: 'Time (min)',
              data: time,
              borderColor: '#ef5350',
              fill: false
            }
          ]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Distance vs Time per Route'
            }
          },
          scales: {
            x: { title: { display: true, text: 'Route ID' } },
            y: { beginAtZero: true }
          }
        }
      });

      // Chart 3: Road Condition Count
      new Chart(document.getElementById('roadConditionChart'), {
        type: 'bar',
        data: {
          labels: Object.keys(roadConditionCounts),
          datasets: [{
            label: 'Road Conditions',
            data: Object.values(roadConditionCounts),
            backgroundColor: '#ffd54f'
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Road Conditions Across Routes'
            }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });

      // Chart 4: Highway vs Non-Highway
      new Chart(document.getElementById('highwayChart'), {
        type: 'doughnut',
        data: {
          labels: ['Highway', 'Non-Highway'],
          datasets: [{
            data: [highwayTrue, highwayFalse],
            backgroundColor: ['#66bb6a', '#ef5350']
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Highway vs Non-Highway Routes'
            }
          }
        }
      });
    });
});
