class TrackAnimation
{
    constructor(points)
    {
        this.speedFactor = 200; 
        this.animation; 
        this.startTime = 0;
        this.progress = 0; 
        this.resetTime = false; 
        this.pauseButton = document.getElementById('pause-button');
        this.playButton = document.getElementById('play-button');
        this.points = points;

        this.current = 0;

        this.geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': []
                    }
                }
            ]
        };
        
        this.animateLine = this.animateLine.bind(this);


        
    }

    updatePoints(points)
    {
        this.points = points;
        this.geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': []
                    }
                }
            ]
        };
    }

    play()
    {
        this.resetTime = true;
        elevationWidget.currentIndex = 0;
        elevationWidget.data = [];
        this.animateLine();  
    }

    pause()
    {
        cancelAnimationFrame(this.animation);
    }


    startAnimation()
    {
        this.startTime = performance.now();
        this.animateLine();
    }


    animateLine(timestamp) 
    {
        if (this.resetTime) 
        {
            this.startTime = performance.now() - this.progress;
            this.resetTime = false;
        } 
        else 
        {
            this.progress = timestamp - this.startTime;
        }

        if (this.progress > this.speedFactor * 360) 
        {
            this.startTime = timestamp;
            this.geojson.features[0].geometry.coordinates = [];
            elevationWidget.currentIndex = 0;
            elevationWidget.data = [];
            
        } 
        else 
        {
            this.current = this.progress / (this.speedFactor * 360);
            console.log(this.current)
 
            let point = mapObject.interpolatePoints(this.points, this.current);
            
            

            this.geojson.features[0].geometry.coordinates.push([point[0], point[1], point[2]]);

            elevationWidget.currentIndex++;

            elevationWidget.data = [];

            let iFound = 0;

            for(let i  = 0; i < this.points.length; i ++)
            {   
                elevationWidget.data.push(null);
                if(point[3] < this.points[i][3])
                {
                    break;
                }
            }

        

            elevationWidget.data[elevationWidget.data.length - 1] = point[2];

    
            elevationWidget.update();

            mapObject.marker.setLngLat([point[0], point[1]]);
            document.getElementById("show-distance-text").innerHTML =  parseFloat(point[3]).toFixed(1).toString() + " KM";
            mapObject.map.getSource('glow').setData(this.geojson);
            mapObject.map.getSource('track').setData(this.geojson);
            
        }
        // Request the next frame of the animation.
        this.animation = requestAnimationFrame(this.animateLine);
    }

}




function showTitle(text)
{
    let titleBox = document.getElementById("title-box");
    titleBox.classList.add('fade-in');
    titleBox.classList.remove('fade-out');

    let content = "";
    for(let i = 0; i < text.length; i++)
    {
        content += "<p>" + text[i] + "</p>";
    }

    titleBox.innerHTML = content;
    
}

function hideTitle()
{
    let titleBox = document.getElementById("title-box");
    titleBox.classList.add('fade-out');
    titleBox.classList.remove('fade-in');
}

showTitle(["Welcome to GPX animator!", "First step is to upload a GPX file of your trip"])


var imagesState = true;
var optionsState = true;

function toggleImagesTab()
{
    if(imagesState)
    {
        document.getElementById("image-tab").classList.remove("show-image-tab");
        document.getElementById("image-tab").classList.add("hide-image-tab");
    }
    else
    {
        document.getElementById("image-tab").classList.remove("hide-image-tab");
        document.getElementById("image-tab").classList.add("show-image-tab");
    }

    imagesState = !imagesState
}

function toggleOptionsTab()
{
    if(optionsState)
    {
        document.getElementById("options-tab").classList.remove("show-options-tab");
        document.getElementById("options-tab").classList.add("hide-options-tab");
    }
    else
    {
        document.getElementById("options-tab").classList.remove("hide-options-tab");
        document.getElementById("options-tab").classList.add("show-options-tab");
    }

    optionsState = !optionsState;
}

var trackAnimation = new TrackAnimation([]);