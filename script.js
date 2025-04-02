// ✅ Declare cpuData before using it
const cpuData = {
    labels: [],
    datasets: [{
        label: 'CPU Usage (%)',
        borderColor: '#00ffff', // Bright Cyan for better contrast
        backgroundColor: 'rgba(0, 255, 255, 0.2)',
        borderWidth: 3, // ✅ Thicker line
        pointRadius: 5, // ✅ Bigger data points
        pointBackgroundColor: '#00ffff', // ✅ Bright dots for visibility
        data: []
    }]
};

const cpuChart = new Chart(document.getElementById('cpuChart'), {
    type: 'line',
    data: cpuData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: true,
                title: { display: true, text: 'Time', color: '#ffffff' },
                ticks: { color: '#ffffff' } // ✅ White text
            },
            y: {
                beginAtZero: true,
                max: 100,
                title: { display: true, text: 'CPU Usage (%)', color: '#ffffff' },
                ticks: { color: '#ffffff' }
            }
        },
        plugins: {
            legend: { labels: { color: '#fff' } } // ✅ White legend text
        }
    }
});


// ✅ Fetch data and update the chart (without re-creating it)
async function fetchStats() {
    try {
        let response = await fetch("http://127.0.0.1:5000/stats");
        let data = await response.json();

        document.getElementById("cpu").innerText = `${data.cpu} %`;
        document.getElementById("memory").innerText = `${data.memory} %`;

        let processTable = document.getElementById("process-list");
        processTable.innerHTML = ""; // Clear old data

        data.processes.forEach(proc => {
            let row = `<tr>
                <td>${proc.pid}</td>
                <td>${proc.name}</td>
                <td>${proc.cpu.toFixed(2)}</td>
            </tr>`;
            processTable.innerHTML += row;
        });

        // ✅ Ensure the graph only keeps the last 10 data points
        let now = new Date().toLocaleTimeString();
        if (cpuData.labels.length >= 10) {
            cpuData.labels.shift(); // Remove oldest data
            cpuData.datasets[0].data.shift();
        }
        cpuData.labels.push(now);
        cpuData.datasets[0].data.push(data.cpu);

        cpuChart.update(); // Refresh the graph properly

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// ✅ Fetch data every 2 seconds
setInterval(fetchStats, 2000);
fetchStats();