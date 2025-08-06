fetch('../data/route_details.csv')
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split('\n').slice(1).map(r => r.split(','));

    
    const tbody = document.querySelector('#routeTable tbody');
    rows.forEach(r => {
      const tr = document.createElement('tr');
      [0,1,2,3,4,5,6,7,8,9].forEach(i => {
        const td = document.createElement('td');
        td.textContent = r[i];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    fetch('../data/route_details.csv')
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split('\n').slice(1).map(r => r.split(','));

    
    const map = L.map('map').setView([18.5, 74.2], 8);
    L.tileLayer('https:

    const colors = {
      High: 'blue',
      Medium: 'green',
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
      }).addTo(map).bindPopup(`<b>${r[1]}</b>`);

      
      const routeColor = colors[safety] || 'gray';
      L.Routing.control({
        waypoints: [L.latLng(lat1, lng1), L.latLng(lat2, lng2)],
        lineOptions: {
          styles: [{ color: routeColor, weight: 5 }]
        },
        createMarker: () => null,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false
      }).addTo(map);
    });
  });

    
    const terrainCount = {}, safetyCount = {}, days = [], dist = [];
    rows.forEach(r => {
      terrainCount[r[5]] = (terrainCount[r[5]] || 0) + 1;
      safetyCount[r[8]] = (safetyCount[r[8]] || 0) + 1;
      days.push(`Day ${r[9]}`);
      dist.push(parseFloat(r[3]));
    });

    new Chart(document.getElementById('terrainChart'), {
      type: 'bar',
      data: {
        labels: Object.keys(terrainCount),
        datasets: [{
          label: 'Terrain Frequency',
          data: Object.values(terrainCount),
          backgroundColor: ['#f4a261', '#2a9d8f', '#e76f51', '#264653']
        }]
      }
    });

    new Chart(document.getElementById('safetyChart'), {
      type: 'pie',
      data: {
        labels: Object.keys(safetyCount),
        datasets: [{
          label: 'Safety Level',
          data: Object.values(safetyCount),
          backgroundColor: ['#43aa8b', '#f94144', '#f8961e']
        }]
      }
    });

    new Chart(document.getElementById('distanceChart'), {
      type: 'line',
      data: {
        labels: days,
        datasets: [{
          label: 'Distance per Day',
          data: dist,
          fill: true,
          borderColor: '#264653',
          backgroundColor: 'rgba(38,70,83,0.1)'
        }]
      }
    });

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
