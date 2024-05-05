class TrackAnimation
{
    constructor(points)
    {
        this.speedFactor = 30; 
        this.animation; 
        this.startTime = 0;
        this.progress = 0; 
        this.resetTime = false; 
        this.pauseButton = document.getElementById('pause-button');
        this.playButton = document.getElementById('play-button');
        this.points = points;

        this.geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': points
                    }
                }
            ]
        };
        

        this.playButton.addEventListener('click', function () 
        {
            this.resetTime = true;
            animateLine();   
        });

        this.pauseButton.addEventListener('click', function () 
        {
                cancelAnimationFrame(animation);        
        });


        
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
            geojson.features[0].geometry.coordinates = [];
        } 
        else 
        {
            let current = this.progress / (this.speedFactor * 360);

            console.log(current);

            //geojson.features[0].geometry.coordinates.push([0, 0]);

            //mapObject.map.getSource('glow').setData(geojson);
            //mapObject.map.getSource('track').setData(geojson);
            
        }
        // Request the next frame of the animation.
        animation = requestAnimationFrame(animateLine);
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