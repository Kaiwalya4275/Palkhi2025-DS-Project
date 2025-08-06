
fetch("../data/food_water_distribution.csv")
  .then((res) => res.text())
  .then((data) => {
    const rows = data.trim().split("\n").map(row => row.split(","));
    const headers = rows[0];
    const records = rows.slice(1);

    
    const thead = document.querySelector("#foodwater-table thead");
    const tbody = document.querySelector("#foodwater-table tbody");

    thead.innerHTML = "<tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>";
    tbody.innerHTML = records.map(row =>
      "<tr>" + row.map(cell => `<td>${cell}</td>`).join("") + "</tr>"
    ).join("");

    
    const bulkCounts = { Bulk: 0, Small: 0 };
    records.forEach(row => {
      const isBulk = row[11]?.trim().toLowerCase() === "true";
      isBulk ? bulkCounts.Bulk++ : bulkCounts.Small++;
    });

    new Chart(document.getElementById("bulkChart"), {
      type: "doughnut",
      data: {
        labels: ["Bulk", "Small"],
        datasets: [{
          data: [bulkCounts.Bulk, bulkCounts.Small],
          backgroundColor: ["#ff6b6b", "#ffd93d"],
        }]
      },
      options: {
        plugins: { title: { display: true, text: "Bulk vs Small Distributions" } },
        responsive: true,
        animation: { animateScale: true }
      }
    });

    
    const typeMap = {};
    records.forEach(row => {
      const type = row[3];
      const qty = parseFloat(row[13]) || 0;
      if (!typeMap[type]) typeMap[type] = 0;
      typeMap[type] += qty;
    });

    new Chart(document.getElementById("quantityBarChart"), {
      type: "bar",
      data: {
        labels: Object.keys(typeMap),
        datasets: [{
          label: "Standardized Quantity (liters)",
          data: Object.values(typeMap),
          backgroundColor: "#4dd599"
        }]
      },
      options: {
        plugins: { title: { display: true, text: "Quantity by Distribution Type" } },
        responsive: true,
        animation: { duration: 1000 }
      }
    });

    
    const teamDurations = {};
    records.forEach(row => {
      const team = row[1];
      const duration = parseFloat(row[10]) || 0;
      teamDurations[team] = duration;
    });

    new Chart(document.getElementById("durationLineChart"), {
      type: "line",
      data: {
        labels: Object.keys(teamDurations),
        datasets: [{
          label: "Distribution Duration (min)",
          data: Object.values(teamDurations),
          borderColor: "#007bff",
          fill: false,
          tension: 0.3
        }]
      },
      options: {
        plugins: { title: { display: true, text: "Distribution Duration by Team" } },
        responsive: true,
        animation: { duration: 1000 }
      }
    });

    
    const riskMap = {};
    records.forEach(row => {
      const village = row[2];
      const risk = row[14]?.trim().toLowerCase() === "true" ? 1 : 0;
      if (!riskMap[village]) riskMap[village] = 0;
      riskMap[village] += risk;
    });

    new Chart(document.getElementById("shortageRadarChart"), {
      type: "radar",
      data: {
        labels: Object.keys(riskMap),
        datasets: [{
          label: "Food Shortage Risk Score",
          data: Object.values(riskMap),
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)"
        }]
      },
      options: {
        plugins: { title: { display: true, text: "Food Shortage Risk by Village" } },
        responsive: true,
        animation: { duration: 1000 }
      }
    });

  });
