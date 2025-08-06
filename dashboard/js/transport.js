document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/transport_logistics.csv")
        .then(response => response.text())
        .then(csv => {
            const rows = csv.trim().split("\n");
            const headers = rows[0].split(",");
            const body = rows.slice(1);

            const thead = document.querySelector("#transport-table thead");
            const tbody = document.querySelector("#transport-table tbody");

            const headRow = document.createElement("tr");
            headers.forEach(h => {
                const th = document.createElement("th");
                th.textContent = h;
                headRow.appendChild(th);
            });
            thead.appendChild(headRow);

            body.forEach(row => {
                const tr = document.createElement("tr");
                row.split(",").forEach(cell => {
                    const td = document.createElement("td");
                    td.textContent = cell.trim();
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });

            const vehicleTypeCounts = {};
            const cargoRouteCounts = {};
            const travelDurations = [];
            const convoyNames = [];
            let heavy = 0, light = 0;

            body.forEach(row => {
                const cols = row.split(",");

                const vehicle = cols[2];
                const cargo = cols[7];
                const route = cols[13];
                const convoy = cols[1];
                const duration = parseFloat(cols[10]);
                const isHeavy = cols[11].toLowerCase() === "true";

                vehicleTypeCounts[vehicle] = (vehicleTypeCounts[vehicle] || 0) + 1;

                if (!cargoRouteCounts[route]) cargoRouteCounts[route] = {};
                cargoRouteCounts[route][cargo] = (cargoRouteCounts[route][cargo] || 0) + 1;

                convoyNames.push(convoy);
                travelDurations.push(duration);

                if (isHeavy) heavy++; else light++;
            });

            
            new Chart(document.getElementById("vehicleTypeChart"), {
                type: "pie",
                data: {
                    labels: Object.keys(vehicleTypeCounts),
                    datasets: [{
                        data: Object.values(vehicleTypeCounts),
                        backgroundColor: ["#ffbe0b", "#fb5607", "#ff006e", "#8338ec", "#3a86ff"]
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: "Vehicle Type Distribution",
                            color: "#fff",
                            font: { size: 20 }
                        },
                        legend: { labels: { color: "#fff" } }
                    }
                }
            });

            
            const routeLabels = Object.keys(cargoRouteCounts);
            const cargoLabels = Array.from(new Set(routeLabels.flatMap(rt => Object.keys(cargoRouteCounts[rt]))));

            const barDatasets = cargoLabels.map(cargo => {
                return {
                    label: cargo,
                    data: routeLabels.map(rt => cargoRouteCounts[rt][cargo] || 0),
                    backgroundColor: getRandomColor()
                };
            });

            new Chart(document.getElementById("cargoBarChart"), {
                type: "bar",
                data: {
                    labels: routeLabels,
                    datasets: barDatasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: "Cargo Type by Route Type",
                            color: "#fff",
                            font: { size: 20 }
                        },
                        legend: { labels: { color: "#fff" } }
                    },
                    scales: {
                        x: { ticks: { color: "#fff" } },
                        y: { ticks: { color: "#fff" } }
                    }
                }
            });

            
            new Chart(document.getElementById("durationLineChart"), {
                type: "line",
                data: {
                    labels: convoyNames,
                    datasets: [{
                        label: "Travel Duration (min)",
                        data: travelDurations,
                        borderColor: "#06d6a0",
                        fill: false,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: "Convoy Travel Duration",
                            color: "#fff",
                            font: { size: 20 }
                        },
                        legend: { labels: { color: "#fff" } }
                    },
                    scales: {
                        x: { ticks: { color: "#fff" } },
                        y: { ticks: { color: "#fff" } }
                    }
                }
            });

            
            new Chart(document.getElementById("vehicleWeightChart"), {
                type: "doughnut",
                data: {
                    labels: ["Heavy", "Light"],
                    datasets: [{
                        data: [heavy, light],
                        backgroundColor: ["#f72585", "#7209b7"]
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: "Heavy vs Light Vehicles",
                            color: "#fff",
                            font: { size: 20 }
                        },
                        legend: { labels: { color: "#fff" } }
                    }
                }
            });
        });

    function getRandomColor() {
        const colors = ["#3a86ff", "#ff006e", "#fb5607", "#8338ec", "#06d6a0", "#ffbe0b"];
        return colors[Math.floor(Math.random() * colors.length)];
    }
});
