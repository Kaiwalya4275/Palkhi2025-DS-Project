fetch('../data/route_details.csv')
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split('\n').slice(1).map(r => r.split(','));

    // TABLE
    const tbody = document.querySelector('#routeTable tbody');
    rows.forEach(r => {
      const tr = document.createElement('tr');
      for (let i = 0; i <= 9; i++) {
        const td = document.createElement('td');
        td.textContent = r[i];
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });

    // MAP
    const map = L.map('map').setView([18.5, 74.2], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    const colors = {
      High: 'blue',
      Medium: 'orange',
      Low: 'red'
    };

    rows.forEach(r => {
      const lat1 = parseFloat(r[10]);
      const lng1 = parseFloat(r[11]);
      const lat2 = parseFloat(r[12]);
      const lng2 = parseFloat(r[13]);
      const safety = r[8];

      L.circleMarker([lat1, lng1], {
        radius: 4,
        fillColor: '#fff',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map).bindPopup(`<b>${r[1]} → ${r[2]}</b><br>${r[3]} km`);

      const routeColor = colors[safety] || 'gray';
      L.polyline([[lat1, lng1], [lat2, lng2]], {
        color: routeColor,
        weight: 4,
        opacity: 0.7
      }).addTo(map);
    });

    // CHARTS
    const terrainCount = {}, safetyCount = {}, dayDistances = {};

    rows.forEach(r => {
      const terrain = r[5];
      const safety = r[8];
      const day = `Day ${r[9]}`;
      const distance = parseFloat(r[3]);

      terrainCount[terrain] = (terrainCount[terrain] || 0) + 1;
      safetyCount[safety] = (safetyCount[safety] || 0) + 1;
      dayDistances[day] = (dayDistances[day] || 0) + distance;
    });

    // Terrain Chart
    new Chart(document.getElementById('terrainChart'), {
      type: 'bar',
      data: {
        labels: Object.keys(terrainCount),
        datasets: [{
          label: 'Terrain Type Frequency',
          data: Object.values(terrainCount),
          backgroundColor: ['#f4a261', '#2a9d8f', '#e76f51', '#264653', '#8d99ae']
        }]
      }
    });

    // Safety Pie Chart
    new Chart(document.getElementById('safetyChart'), {
      type: 'pie',
      data: {
        labels: Object.keys(safetyCount),
        datasets: [{
          label: 'Safety Level Distribution',
          data: Object.values(safetyCount),
          backgroundColor: ['#43aa8b', '#f8961e', '#f94144']
        }]
      }
    });

    // Distance Line Chart
    new Chart(document.getElementById('distanceChart'), {
      type: 'line',
      data: {
        labels: Object.keys(dayDistances),
        datasets: [{
          label: 'Distance per Day',
          data: Object.values(dayDistances),
          fill: true,
          borderColor: '#264653',
          backgroundColor: 'rgba(38,70,83,0.1)'
        }]
      }
    });

    // Radar Chart
    new Chart(document.getElementById('radarChart'), {
      type: 'radar',
      data: {
        labels: Object.keys(safetyCount),
        datasets: [{
          label: 'Route Safety Radar',
          data: Object.values(safetyCount),
          backgroundColor: 'rgba(255, 99, 132, 0.3)',
          borderColor: 'rgb(255, 99, 132)'
        }]
      }
    });
  });
