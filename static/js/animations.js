class TrackAnimation
{
    constructor(points)
    {
        this.firstPlay = true;

        this.isPlaying = false;
        this.isPaused = false;

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

    hardRestart()
    {
        if(mapObject.recordingEnabled && recorder.isRecording)
        {
            recorder.stop();
            recorder.showRecordingPanel();
        }

        if (!window.screenTop && !window.screenY) 
        {
            document.exitFullscreen();
        }
        
        cancelAnimationFrame(this.animation);

        this.isPlaying = false;
        this.isPaused = false;

        this.firstPlay = true;

        for(let i = 0; i < manager.imageMarkers.length; i++)
        {
            let marker = manager.imageMarkers[i]._element;
            marker.dataset.passed = false;
            marker.style.display = "block";

            let close = marker.getElementsByClassName("gallery-marker-remove")[0];
            close.style.display = "block";
        }

        this.resetTime = true;
        elevationWidget.currentIndex = 0;
        elevationWidget.data = [];


        this.geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': mapObject.points
                    }
                }
            ]
        };

        let geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': mapObject.points
                    }
                }
            ]
        };

        if(mapObject.showElevation)
        {
            elevationWidget.data = [0];       
            elevationWidget.update();
        }

        if(!(!mapObject.map.getSource('glow')))
        {
            mapObject.map.getSource('glow').setData(geojson);
        }

        if(!(!mapObject.map.getSource('track')))
        {
            mapObject.map.getSource('track').setData(geojson);
        }

        if(mapObject.markerExist)
        {
            mapObject.marker.setLngLat([mapObject.points[0][0], mapObject.points[0][1]]);
        }

        if(mapObject.showDistance && mapObject.markerExist)
        {
            document.getElementById("show-distance-text").innerHTML =  0 + " KM";
        }

        mapObject.flyTo(mapObject.points[0][0], mapObject.points[0][1])
        
        
        this.current = 0;
        this.progress = 0;
        this.startTime = 0;
        this.startTime = performance.now(); 
    }

    restart()
    {

        

        for(let i = 0; i < manager.imageMarkers.length; i++)
        {
            let marker = manager.imageMarkers[i]._element;
            marker.dataset.passed = false;
            marker.style.display = "none";

            let close = marker.getElementsByClassName("gallery-marker-remove")[0];
            close.style.display = "none";
        }

        this.resetTime = true;
        elevationWidget.currentIndex = 0;
        elevationWidget.data = [];


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

        let geojson = {
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

        if(!(!mapObject.map.getSource('glow')))
        {
            mapObject.map.getSource('glow').setData(geojson);
        }

        if(!(!mapObject.map.getSource('track')))
        {
            mapObject.map.getSource('track').setData(geojson);
        }

        if(mapObject.markerExist)
        {
            mapObject.marker.setLngLat([mapObject.points[0][0], mapObject.points[0][1]]);
        }

        if(mapObject.showDistance && mapObject.markerExist)
        {
            document.getElementById("show-distance-text").innerHTML =  0 + " KM";
        }

        mapObject.flyTo(mapObject.points[0][0], mapObject.points[0][1])
        
        
        this.current = 0;
        this.progress = 0;
        this.startTime = 0;
        this.startTime = performance.now(); 
    }

    play()
    {
        if(!this.isPlaying)
        {
            if(this.firstPlay)
            {
                this.restart();
                this.firstPlay = false;
            }

            if(mapObject.recordingEnabled)
            {

                recorder.record();

                

                
            }

            if (!document.fullscreenElement) 
            {
                document.documentElement.requestFullscreen();
            } 

            hideTabs();
            
            this.isPlaying = true;
            this.isPaused = false;
            this.resetTime = true;
            elevationWidget.currentIndex = 0;
            elevationWidget.data = [];
            this.animateLine(); 
        }
    }

    pause()
    {
        if(!this.isPaused)
        {
            cancelAnimationFrame(this.animation);

            if(mapObject.recordingEnabled && recorder.isRecording)
            {
                recorder.stop();
                recorder.showRecordingPanel();
            }

            if (!window.screenTop && !window.screenY) 
            {
                document.exitFullscreen();
            }

            this.isPaused = true;
        }
    }


    startAnimation()
    {
        this.startTime = performance.now();
        this.animateLine();
    }


    async animateLine(timestamp) 
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
            this.pause();
        } 
        else 
        {
            this.current = this.progress / (this.speedFactor * 360);

            if(this.current > 0.99)
            {
                this.hardRestart();
            }

            console.log(this.current, recorder.isRecording)
 
            let output = mapObject.interpolatePoints(this.points, this.current);
            let point = output["point"];
            let index = output["index"];
            this.geojson.features[0].geometry.coordinates.push([point[0], point[1], point[2]]);

            if(mapObject.showElevation)
            {
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
            }
            
            if(mapObject.markerExist)
            {
                mapObject.marker.setLngLat([point[0], point[1]]);
            }
            
            if(mapObject.showDistance)
            {
                document.getElementById("show-distance-text").innerHTML =  parseFloat(point[3]).toFixed(1).toString() + " KM";
            }

            if(!(!mapObject.map.getSource('glow')))
            {
                mapObject.map.getSource('glow').setData(this.geojson);
            }

            if(!(!mapObject.map.getSource('track')))
            {
                mapObject.map.getSource('track').setData(this.geojson);
            }

            for(let i = 0; i < manager.imageMarkers.length; i++)
            {
                let marker = manager.imageMarkers[i]._element;
                if(marker.dataset.pointIndex == index && marker.dataset.passed == "false")
                {
                    console.log("passed marker:", marker);
                    marker.dataset.passed = true;
                    if(mapObject.showPhotos)
                    {

                        let urls = [];
                        let photoContainer = marker.children[0].children[0];
                        for(let i = 0; i < photoContainer.childNodes.length; i++)
                        {
                            urls.push(photoContainer.children[i].src);
                        }
                        console.log(urls)

                        if(mapObject.photoDisplayType == "marker")
                        {
                            marker.style.display = "block";
                        }
                        else
                        {
                            slideshow.init(urls, mapObject.pauseDuration * urls.length)
                        }
                        

                        if(mapObject.pauseOnPhoto)
                        {
                            await this.sleep(mapObject.pauseDuration * 1000 * urls.length);
                            this.startTime += mapObject.pauseDuration * 1000 * urls.length;
                        }
                    }
                }
            }

            mapObject.flyTo(point[0], point[1])
            
        }
        // Request the next frame of the animation.
        this.animation = requestAnimationFrame(this.animateLine);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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

function hideTabs()
{
    document.getElementById("options-tab").classList.remove("show-options-tab");
    document.getElementById("options-tab").classList.add("hide-options-tab");
    document.getElementById("image-tab").classList.remove("show-image-tab");
    document.getElementById("image-tab").classList.add("hide-image-tab");
}

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








window.addEventListener("keyup", function (event) {
    if (event.defaultPrevented) {
      return; 
    }
  
    switch (event.key)
     {
      case "p":
        trackAnimation.play();
        break;
      case "s":
        trackAnimation.pause();
        break;
      case "r":
        trackAnimation.hardRestart();
        break;
      case "h":
        hideTabs();
        break;
      default:
        return; 
    }
  
    event.preventDefault();
  }, true);
  