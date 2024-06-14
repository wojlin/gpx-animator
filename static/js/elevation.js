class ElevationWidget 
{
    constructor() 
    {
        this.chart = null;
        this.data = [];
        this.wholeElevations = [];
        this.wholeDistances = [];
        this.currentIndex = 0;
    }


    generateArrayInRange(min, max, step) {
        let result = [];
    
    // Adjust min and max values to fit main digits
    const adjustedMin = Math.floor(min / step) * step;
    const adjustedMax = Math.ceil(max / step) * step;
    
    for (let i = adjustedMin; i <= adjustedMax; i += step) {
        result.push(i);
    }
    
    return result;
    }

    calculate(points)
    {
        
        // Extract elevations from the points
        const elevations = points.map(point => point[2]);
        // Extract distances from the points
        const distances = points.map(point => point[4]);
        

        // Round distances to single digit after decimal and add unit "km"
        const roundedDistances = distances.map(distance => parseFloat(distance.toFixed(1)));

        this.wholeElevations = elevations;
        this.wholeDistances = roundedDistances;

        let minY =  Math.min.apply(null, elevations);
        let maxY = Math.max.apply(null, elevations);

        let minX =  Math.min.apply(null, distances);
        let maxX = Math.max.apply(null, distances);

        // Get canvas element
        const ctx = document.getElementById('elevationChart').getContext('2d');


        let ticksY = this.generateArrayInRange(minY, maxY, 100);
        let ticksX = this.generateArrayInRange(minX, maxX, 1);

        console.log(ticksX, ticksY)

        // Create elevation chart
        elevationWidget.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: roundedDistances,
            datasets: [
                {
            label: 'Elevation',
            data: elevations,
            borderColor: 'white', // Set line color to white
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Set background color to white with opacity
            borderWidth: 3,
            fill: false, // Disable fill to only show lines
            pointRadius: 0, // Increase the point radius for better visibility
            pointHoverRadius: 0 // Increase the hover radius for better interactivity
            }
        ]
        },
        options: {
            animation: false, // Disable animations
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
                },

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
                    count: ticksY.length,
                    min: ticksY[0], // Minimum Y value
                    max: ticksY[ticksY.length - 1], // Maximum Y value
                    suggestedMax: ticksY[ticksY.length - 1],
                    suggestedMin: ticksY[0],
                    stepSize: 100, // Step size for the Y-axis
                 
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
                text: 'Distance from Start (km)',
                color: 'white' // Set x-axis title color to white
                },
                ticks: {
                    count: ticksX.length,
                    min: ticksX[0], // Minimum Y value
                    max: ticksX[ticksX.length - 1], // Maximum Y value
                    suggestedMax: ticksX[ticksX.length - 1],
                    suggestedMin: ticksX[0],
                    stepSize: 1, // Step size for the Y-axis
                 
                     color: 'white' // Set y-axis ticks color to white
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

    update()
    {   
    
        var datasets = this.chart.data.datasets;

  
        if (datasets.length > 1) {
            // Remove the last dataset (ball) if it exists
            datasets.pop();
        }

        this.chart.data.datasets.push({
            label: "current position",
            data: this.data,
            backgroundColor: 'red', // Customize the ball color
            pointStyle: 'circle', // Set the point style to circle
            pointRadius: 10, // Increase the point radius for better visibility
            pointHoverRadius: 10 // Increase the hover radius for better interactivity
          });
        


        this.chart.update();


    }


}

var elevationWidget = new ElevationWidget();

