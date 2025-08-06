document.addEventListener('DOMContentLoaded', () => {
  fetch('../data/cultural_events.csv')
    .then(response => response.text())
    .then(csv => {
      const rows = csv.trim().split('\n').slice(1); // Skip header
      const tbody = document.querySelector('#eventsTable tbody');

      const eventTypeCounts = {};
      const audienceByVillage = {};
      const eventsPerDay = {};
      const timeOfDayCounts = {};

      rows.forEach(row => {
        const cols = row.split(',');

        // Fill table
        const tr = document.createElement('tr');
        cols.forEach(col => {
          const td = document.createElement('td');
          td.textContent = col;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);

        const [
          id, name, date, time, village, group,
          audience, type, hour, timeOfDay,
          isLarge, dayName, category
        ] = cols;

        // Event type distribution
        eventTypeCounts[type] = (eventTypeCounts[type] || 0) + 1;

        // Audience size per village
        const audienceNum = parseInt(audience);
        audienceByVillage[village] = (audienceByVillage[village] || 0) + audienceNum;

        // Events per day
        eventsPerDay[dayName] = (eventsPerDay[dayName] || 0) + 1;

        // Time of day
        timeOfDayCounts[timeOfDay] = (timeOfDayCounts[timeOfDay] || 0) + 1;
      });

      // Chart 1: Event Type (Pie)
      new Chart(document.getElementById('typeChart'), {
        type: 'pie',
        data: {
          labels: Object.keys(eventTypeCounts),
          datasets: [{
            data: Object.values(eventTypeCounts),
            backgroundColor: ['#ff8a65', '#4db6ac', '#9575cd', '#fbc02d']
          }]
        }
      });

      // Chart 2: Audience by Village (Bar)
      new Chart(document.getElementById('audienceChart'), {
        type: 'bar',
        data: {
          labels: Object.keys(audienceByVillage),
          datasets: [{
            label: 'Audience',
            data: Object.values(audienceByVillage),
            backgroundColor: '#ffb300'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });

      // Chart 3: Events per Day (Line)
      new Chart(document.getElementById('dayChart'), {
        type: 'line',
        data: {
          labels: Object.keys(eventsPerDay),
          datasets: [{
            label: 'Events',
            data: Object.values(eventsPerDay),
            fill: false,
            borderColor: '#ec407a',
            tension: 0.3
          }]
        }
      });

      // Chart 4: Time of Day (Doughnut)
      new Chart(document.getElementById('timeOfDayChart'), {
        type: 'doughnut',
        data: {
          labels: Object.keys(timeOfDayCounts),
          datasets: [{
            data: Object.values(timeOfDayCounts),
            backgroundColor: ['#7986cb', '#f06292', '#aed581']
          }]
        }
      });
    });
});
