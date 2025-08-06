// js/volunteers.js

const csvUrl = "../data/volunteers_info.csv";

async function loadVolunteers() {
  const response = await fetch(csvUrl);
  const data = await response.text();
  const rows = data.split('\n').slice(1);

  const tbody = document.querySelector('#volunteersTable tbody');

  const genders = {};
  const roles = {};
  const durations = [];
  const tasks = [];
  const motivations = [];

  rows.forEach(row => {
    if (!row.trim()) return;
    const cols = row.split(',');

    const [
      id, name, age, gender, village, team, role, days, senior, dailyHrs,
      completed, flags, languages, certs, avail, motivation, leader, contact
    ] = cols;

    // Table Row
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${id}</td><td>${name}</td><td>${age}</td><td>${gender}</td><td>${village}</td>
      <td>${team}</td><td>${role}</td><td>${days}</td><td>${senior == '1' ? 'Yes' : 'No'}</td>
      <td>${dailyHrs}</td><td>${completed}</td><td>${flags}</td><td>${languages}</td>
      <td>${certs}</td><td>${avail}</td><td>${motivation}</td><td>${leader}</td><td>${contact}</td>
    `;
    tbody.appendChild(tr);

    // Stats
    genders[gender] = (genders[gender] || 0) + 1;
    const key = `${team} - ${role}`;
    roles[key] = (roles[key] || 0) + 1;
    durations.push(parseInt(days));
    tasks.push(parseInt(completed));
    motivations.push(parseInt(motivation));
  });

  // Charts
  new Chart(document.getElementById('genderChart'), {
    type: 'pie',
    data: {
      labels: Object.keys(genders),
      datasets: [{
        data: Object.values(genders),
        backgroundColor: ['#ff8a65', '#4fc3f7']
      }]
    },
    options: {
      plugins: { title: { display: true, text: 'Gender Distribution' } }
    }
  });

  new Chart(document.getElementById('roleChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(roles),
      datasets: [{
        label: 'Count',
        data: Object.values(roles),
        backgroundColor: '#9575cd'
      }]
    },
    options: {
      plugins: { title: { display: true, text: 'Roles by Team' } },
      responsive: true,
      scales: {
        x: { ticks: { autoSkip: false } },
        y: { beginAtZero: true }
      }
    }
  });

  new Chart(document.getElementById('durationChart'), {
    type: 'line',
    data: {
      labels: durations.map((_, i) => `#${i+1}`),
      datasets: [{
        label: 'Service Duration (days)',
        data: durations,
        borderColor: '#66bb6a',
        fill: false
      }, {
        label: 'Tasks Completed',
        data: tasks,
        borderColor: '#ef5350',
        fill: false
      }]
    },
    options: {
      plugins: { title: { display: true, text: 'Service Duration vs Tasks Completed' } }
    }
  });

  new Chart(document.getElementById('motivationChart'), {
    type: 'bar',
    data: {
      labels: motivations.map((_, i) => `#${i+1}`),
      datasets: [{
        label: 'Motivation Score',
        data: motivations,
        backgroundColor: '#ffca28'
      }]
    },
    options: {
      plugins: { title: { display: true, text: 'Motivation Score per Volunteer' } }
    }
  });
}

loadVolunteers();
