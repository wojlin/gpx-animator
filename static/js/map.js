class MapClass
{
    constructor()
    {
        this.map = null;
        this.display = false;
        this.points = [];

        this.trackExist = false;
        this.glowExist = false;
        this.markerExist = false;
    }

    addMap(points)
    {
        document.getElementById("map-container").style.display = "block";
        maptilersdk.config.apiKey = 'iBMdZnhZEwU4AcVpsPuh';
        this.map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.HYBRID,
        center: [21, 54], 
        zoom: 3,
        terrain: true,
        terrainControl: true,
        maxPitch: 85,
        maxZoom: 18
        });
        this.display = true;
        this.points = this.switchLatLon(points);

 
        
    
    }

    zoomTo(lat, lon, zoom)
    {
        this.map.flyTo({
            zoom: zoom,
            center: [lat,lon],
            essential: true 
        });
        
    }


    switchLatLon(points)
    {
        for(let i = 0; i < points.length; i++)
        {
            let saved = points[i][0];
            points[i][0] = points[i][1];
            points[i][1] = saved;
        }
        return points;
    }

    addStartAndEndPoints()
    {
        let startingPoint = this.points[0];
        let endingPoint = this.points[points.length - 1];

        let startMarker = new maptilersdk.Marker()
        .setLngLat(this.startingPoint)
        .addTo(this.map);

        let endMarker = new maptilersdk.Marker()
        .setLngLat(this.endingPoint)
        .addTo(this.map);
    }


    addMarker(markerColor, markerSize, markerURL)
    {
        let startingPoint = this.points[0];


        let geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'message': '',
                        'iconSize': [markerSize, markerSize]
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': startingPoint
                    }
                }
            ]
        };


        geojson.features.forEach(function (marker) 
        {

            let el = document.createElement('div');
            el.className = 'marker-container';
            el.id = "marker";
            el.style.maskImage = 'url(' + markerURL + ')';
            el.style.width = marker.properties.iconSize[0] + 'px';
            el.style.height = marker.properties.iconSize[1] + 'px';

            let colorOverlay = document.createElement('div');
            colorOverlay.classList.add('marker-color-overlay');
            colorOverlay.style.backgroundColor = markerColor; 

            el.appendChild(colorOverlay);
    

            new maptilersdk.Marker({element: el})
                .setLngLat(marker.geometry.coordinates)
                .addTo(mapObject.map);
        });


    }

    addTrack(color, width, opacity)
    {

        let geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': { 'type': 'LineString', 'coordinates': this.points,}
                }
                    ]
            };
        
       
            this.map.addSource('track', {'type': 'geojson','data': geojson});
            this.map.addLayer(
                {
                    'id': 'track',
                    'type': 'line',
                    'source': 'track',
                    'layout': 
                    {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    'paint': 
                    {
                        'line-color': color,
                        'line-width': parseFloat(width / 4),
                        'line-opacity': parseFloat(opacity / 100),
                        
                    }
            }); 
    }


    addGlow(color, width, opacity)
    {

        let geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': { 'type': 'LineString', 'coordinates': this.points,}
                }
                    ]
            };
        
       
            this.map.addSource('glow', {'type': 'geojson','data': geojson});
            this.map.addLayer(
                {
                    'id': 'glow',
                    'type': 'line',
                    'source': 'glow',
                    'layout': 
                    {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    'paint': 
                    {
                        'line-color': color,
                        'line-width': parseFloat(width / 2),
                        'line-opacity': parseFloat(opacity / 100),
                        'line-blur': parseFloat(width / 3),
                    }
            }); 
    }


    

    applyOptionsToMap()
    {
        let optionsList = options.getOptions();
        console.log(optionsList);

        let optionsDict = {};
        for(let i = 0; i < optionsList.length; i++)
        {
            optionsDict[optionsList[i].id] = optionsList[i];
        }



        if(optionsDict["display-glow"].checked)
        {
            console.log("displaying glow");
            if(this.glowExist)
            {
                this.map.removeLayer("glow");
                this.map.removeSource("glow");
            }
            
            this.addGlow( optionsDict["glow-color"].value, optionsDict["glow-width"].value, optionsDict["glow-opacity"].value);
            this.glowExist = true;
        }else
        {
            console.log("hiding glow");
            if(this.glowExist)
            {
                this.map.removeLayer("glow");
                this.map.removeSource("glow");
            }
            
            this.glowExist = false;
        }

        
        if(optionsDict["display-line"].checked)
        {
            console.log("displaying line");
            if(this.trackExist)
            {
                this.map.removeLayer("track");
                this.map.removeSource("track");
            }
            
            this.addTrack(optionsDict["line-color"].value, optionsDict["line-width"].value, optionsDict["line-opacity"].value);
            this.trackExist = true;
        }else
        {
            console.log("hiding line");
            if(this.trackExist)
            {
                this.map.removeLayer("track");
                this.map.removeSource("track");
            }
            
            this.trackExist = false;
        }


        if(optionsDict["display-marker"].checked)
        {
            console.log("displaying marker");
            if(this.markerExist)
            {
                document.getElementById("marker").remove();
            }
            
            let size = optionsDict["marker-size"].value;
            let url = optionsDict["icon-select"].options[optionsDict["icon-select"].selectedIndex ].value 
            let color = optionsDict["marker-color"].value
            this.addMarker(color, size, url);
            this.markerExist = true;
        }else
        {
            console.log("hiding marker");
            if(this.markerExist)
            {
                document.getElementById("marker").remove();
            }
            
            this.markerExist = false;
        }


       


    
     
    }

 
}


var mapObject = new MapClass();




