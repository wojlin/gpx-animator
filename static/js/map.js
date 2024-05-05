class MapClass
{
    constructor()
    {
        this.map = null;
        this.display = false;
        this.points = [];

        this.optionsDict = null;
        this.lastStyle = "";

        this.trackExist = false;
        this.glowExist = false;
        this.markerExist = false;
        this.elevationEnabled = false;
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
            essential: false 
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

    enableElevation(state, elevationFactor)
    {   
        let factor = parseFloat(elevationFactor) / 100.0;
        if(state == false) 
        {
            console.log("disable")
            mapObject.map.disableTerrain();
        } 
        else 
        {
            console.log("enable", factor)
            mapObject.map.enableTerrain(factor);
        }
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
                        'line-width': parseFloat(width),
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
                        'line-width': parseFloat(width),
                        'line-opacity': parseFloat(opacity / 100),
                        'line-blur': parseFloat(width / 2),
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

        this.optionsDict = optionsDict;

        mapObject.zoomTo(mapObject.points[0][0], mapObject.points[0][1], optionsDict["zoom-level"].value)

        let mapStyle = optionsDict["map-select"].options[optionsDict["map-select"].selectedIndex ].value;

        console.log(mapStyle)

        if(mapStyle != this.lastStyle)
        {
            if(mapStyle == "hybrid")
            {
                mapObject.map.setStyle(maptilersdk.MapStyle.HYBRID);
            }
            else if (mapStyle == "satellite")
            {
                mapObject.map.setStyle(maptilersdk.MapStyle.SATELLITE);
            }
            else if (mapStyle == "outdoor")
            {
                mapObject.map.setStyle(maptilersdk.MapStyle.OUTDOOR);
            }
            else if (mapStyle == "backdrop")
            {
                mapObject.map.setStyle(maptilersdk.MapStyle.BACKDROP);
            }
            else if (mapStyle == "winter")
            {
                mapObject.map.setStyle(maptilersdk.MapStyle.WINTER);
            }
            else if (mapStyle == "topo")
            {
                mapObject.map.setStyle(maptilersdk.MapStyle.TOPO);
            }
            else if (mapStyle == "landscape")
            {
                mapObject.map.setStyle(maptilersdk.MapStyle.LANDSCAPE);
            }
            else if (mapStyle == "ocean")
            {
                mapObject.map.setStyle(maptilersdk.MapStyle.OCEAN);
            }
            else if (mapStyle == "toner")
            {
                mapObject.map.setStyle(maptilersdk.MapStyle.TONER);
            }
            else if (mapStyle == "osm")
            {
                mapObject.map.setStyle(maptilersdk.MapStyle.OPENSTREETMAP);
            }
            else if (mapStyle == "streets")
            {
                mapObject.map.setStyle(maptilersdk.MapStyle.STREETS);
            }
            else if (mapStyle == "dataviz")
            {
                mapObject.map.setStyle(maptilersdk.MapStyle.DATAVIZ);
            }
            else if (mapStyle == "basic")
            {
                mapObject.map.setStyle(maptilersdk.MapStyle.BASIC);
            }
            else if (mapStyle == "bright")
            {
                mapObject.map.setStyle(maptilersdk.MapStyle.BRIGHT);
            }
            else
            {
                console.error("missing map style!");
            }
            this.glowExist = false;
            this.trackExist = false;
            this.lastStyle = mapStyle;
        }
        
        setTimeout( function() 
        { 
            console.log('loading all datasets');

            if(mapObject.optionsDict["display-glow"].checked)
            {
                console.log("displaying glow");

 
                if (!(!mapObject.map.getLayer("glow"))) 
                {
                    mapObject.map.removeLayer("glow");
                    mapObject.map.removeSource("glow");
                }
                
                let color = mapObject.optionsDict["glow-color"].value;
                let width = parseFloat(mapObject.optionsDict["glow-width"].value);
                let opacity = parseFloat(mapObject.optionsDict["glow-opacity"].value);
                console.log('glow', color, width, opacity);
                mapObject.addGlow(color, width, opacity);
                mapObject.glowExist = true;

         
            }else
            {
                console.log("hiding glow");
                if (!(!mapObject.map.getLayer("glow"))) 
                {
                    mapObject.map.removeLayer("glow");
                    mapObject.map.removeSource("glow");
                }
                
                mapObject.glowExist = false;
            }

            
            if(mapObject.optionsDict["display-line"].checked)
            {
                console.log("displaying line");
                if (!(!mapObject.map.getLayer("track"))) 
                {
                    mapObject.map.removeLayer("track");
                    mapObject.map.removeSource("track");
                }
                
                let color = mapObject.optionsDict["line-color"].value;
                let width = parseFloat(mapObject.optionsDict["line-width"].value);
                let opacity = parseFloat(mapObject.optionsDict["line-opacity"].value);
                console.log('track', color, width, opacity);
                mapObject.addTrack(color, width, opacity);
                mapObject.trackExist = true;
            }else
            {
                console.log("hiding line");
                if (!(!mapObject.map.getLayer("track"))) 
                {
                    mapObject.map.removeLayer("track");
                    mapObject.map.removeSource("track");
                }
                
                mapObject.trackExist = false;
            }


            if(mapObject.optionsDict["display-marker"].checked)
            {
                console.log("displaying marker");
                if(mapObject.markerExist)
                {
                    document.getElementById("marker").remove();
                }
                
                let size = mapObject.optionsDict["marker-size"].value;
                let url = mapObject.optionsDict["icon-select"].options[mapObject.optionsDict["icon-select"].selectedIndex ].value 
                let color = mapObject.optionsDict["marker-color"].value
                mapObject.addMarker(color, size, url);
                mapObject.markerExist = true;
            }else
            {
                console.log("hiding marker");
                if(mapObject.markerExist)
                {
                    document.getElementById("marker").remove();
                }
                
                mapObject.markerExist = false;
            }



            if(mapObject.optionsDict["enable-elevation"].checked)
            {
                console.log("enabling elevation");
                mapObject.enableElevation(mapObject.optionsDict["enable-elevation"].checked, mapObject.optionsDict["elevation-factor"].value);
                mapObject.elevationEnabled = true;
            }
            else
            {
                console.log("hiding elevation");
                mapObject.enableElevation(mapObject.optionsDict["enable-elevation"].checked, mapObject.optionsDict["elevation-factor"].value);
                mapObject.elevationEnabled = false;
            }

        },
         500);

            
       

        

        
       
        
        
        
     
    }

 
}


var mapObject = new MapClass();




