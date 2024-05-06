class ElevationWidget 
{
    constructor() 
    {

    }

    calculate(points)
    {
        // Extract elevations from the points
        const elevations = points.map(point => point[2]);
        // Extract distances from the points
        const distances = points.map(point => point[3]);

        // Round distances to single digit after decimal and add unit "km"
        const roundedDistances = distances.map(distance => distance.toFixed(1) + ' km');

        // Get canvas element
        const ctx = document.getElementById('elevationChart').getContext('2d');

        // Create elevation chart
        const elevationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: roundedDistances,
            datasets: [{
            label: 'Elevation',
            data: elevations,
            borderColor: 'white', // Set line color to white
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Set background color to white with opacity
            borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Elevation Chart',
                    color: 'white',
                    padding: {
                        top: 10,
                        bottom: 5
                    }
                },
                legend: {
                    display: false,
                    labels: {
                        color: 'rgb(255, 99, 132)'
                    }
                }
            },
            maintainAspectRatio: false, // Let the chart resize freely
            title: {
            display: true,
            text: 'Elevation Profile',
            color: 'white' // Set title color to white
            },
            legend: {
            display: false // Hide legend
            },
            tooltip:
            {
                display: false
            },
            scales: {
            y: {
                title: {
                display: true,
                text: 'Elevation (m)',
                color: 'white' // Set y-axis title color to white
                },
                ticks: {
                color: 'white' // Set y-axis ticks color to white
                },
                grid: {
                color: 'rgba(255, 255, 255, 0.2)', // Set y-axis grid lines color to white with opacity
                borderWidth: 0.5, // Set y-axis grid lines thickness
                borderColor: 'rgba(255, 255, 255, 0.5)' // Set y-axis grid lines border color
                }
            },
            x: {
                title: {
                display: true,
                text: 'Distance from Start',
                color: 'white' // Set x-axis title color to white
                },
                ticks: {
                color: 'white' // Set x-axis ticks color to white
                },
                grid: {
                color: 'rgba(255, 255, 255, 0.2)', // Set x-axis grid lines color to white with opacity
                borderWidth: 0.5, // Set x-axis grid lines thickness
                borderColor: 'rgba(255, 255, 255, 0.5)' // Set x-axis grid lines border color
                }
            }
            }
        }
        });

     
    }


}

var elevationWidget = new ElevationWidget();

