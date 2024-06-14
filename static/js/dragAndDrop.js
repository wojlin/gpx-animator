class DragAndDrop 
{
    constructor()
    {

    }

    autoplacerMarkers(method="", elem)
    {
        elem.disabled = true;
        let failed = 0;
        for(let i = images.imagesPanel.children.length - 1; i >= 0; i--)
        { 
            console.log(i);

            let image = images.imagesPanel.children[i].children[0];

            let lat = 0;
            let lon = 0;

            if(method == 'timestamp')
            {

                if(!image.hasAttribute("data-timestamp")) 
                {
                    failed += 1;
                    continue;
                }

                if(image.dataset.timestamp == "") 
                {
                    failed += 1;
                    continue;
                }

                try
                {
                    let timestamp = image.dataset.timestamp.split(',');
                    console.log(timestamp);
                    let found = false;
                    for(let x = 0; x < mapObject.points.length; x++)
                    {
                        let data = mapObject.points[x][3]
                        let regex = /[a-zA-Z:,.\/?!\-\\]+/g;
                        let result = data.split(regex).filter(Boolean);   
                        if(
                            parseInt(result[0]) == parseInt(timestamp[0]) && 
                            parseInt(result[1]) == parseInt(timestamp[1]) &&
                            parseInt(result[2]) == parseInt(timestamp[2]) &&
                            parseInt(result[3]) == parseInt(timestamp[3]) &&
                            (parseInt(result[4]) <= parseInt(timestamp[4]) + 3 && parseInt(result[4]) >= parseInt(timestamp[4]) - 3)
                        )
                        {
                            console.log(timestamp, result)
                            lat = mapObject.points[x][1];
                            lon = mapObject.points[x][0];
                            found = true

                        }
                    }
                    if(!found)
                    {
                        failed += 1;
                    }
                }
                catch
                {
                    failed += 1;
                    continue;
                }
                
            }
            else
            {

                if(!image.hasAttribute("data-geotag")) 
                {
                    failed += 1;
                    continue;
                }

                if(image.dataset.geotag == "") 
                {
                    failed += 1;
                    continue;
                }
                
                try
                {
                    let geotag = image.dataset.geotag.split(',');
                    console.log(geotag)
                    lat = parseFloat(geotag[0]);
                    lon = parseFloat(geotag[1]);
                }
                catch
                {
                    failed +=1;
                    continue;
                }
                
            }

            if(lat == 0 || lon == 0)
            {
                //alert("autoplace did not work, image have corrupted timestamp or geotag");
                continue;
            }

            console.log(lat, lon);
            dragAndDrop.spawnMarker(image.src, lon, lat, 0);
            images.imagesPanel.children[i].remove()
        }
        elem.disabled = false;
        if(failed > 0)
        {
            alert("failed to autoplace " + failed + " images!");
        }

        for(let i = 0; i < manager.imageMarkers.length; i++)
        {
            dragAndDrop.afterPlace(manager.imageMarkers[i]);
        }

        setTimeout(function()
        {
            for(let i = 0; i < manager.imageMarkers.length; i++)
            {
                dragAndDrop.afterPlace(manager.imageMarkers[i]);
            }
        }, 1000 ); 
        
    }



    spawnMarker(src, lat, lon, height) // this method spawn marker on the map with image src inside
    {
        let markerSize = 50;


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
                        'coordinates': [lat, lon, height]
                    }
                }
            ]
        };


        geojson.features.forEach(function (marker) 
        {

            let container = document.createElement('div');
            container.className = "gallery-marker-container-root";
            

            container.dataset.src = src;
            container.dataset.lat = lat;
            container.dataset.lon = lon;
            container.dataset.pointIndex = 0;
            container.dataset.passed = false;
            

            let img = document.createElement('div');
            img.className = 'gallery-marker-image-container';

            let imgObject = document.createElement('img');
            imgObject.className = 'gallery-marker-image-object';
            imgObject.src = src;

            img.appendChild(imgObject);

            let el = document.createElement('div');
            el.className = 'gallery-marker-container';
            el.style.backgroundImage = 'url(static/images/gallery.png)';
            el.style.backgroundSize = 'contain';
            el.style.width = 50 + 'px';
            el.style.height = 50 + 'px';
            
            let close = document.createElement('div');
            close.innerHTML = "🗙";
            close.className = "gallery-marker-remove";
            
            close.onclick = function(event) 
            {
                dragAndDrop.removeMarker(event.target);
            };

            
            el.appendChild(img);
            container.appendChild(el);
            el.appendChild(close);
            

            let dragMarker = new maptilersdk.Marker({element: container,draggable: true})
                .setLngLat(marker.geometry.coordinates)
                .addTo(mapObject.map);
                dragMarker.on('dragend', dragAndDrop.onDragEnd);

            manager.imageMarkers.push(dragMarker);
            console.log(manager.imageMarkers)

        });
        
    }

    removeMarker(element)
    {
        let parent = element.parentNode.parentNode;
        let imagesPanel = parent.children[0].children[0];
        for(let i = 0; i < imagesPanel.children.length; i++)
        {   
            let image = imagesPanel.children[i].src;
            console.log(image);
            images.addImage(image);
        }
        parent.remove();
    }

    afterPlace(marker)
    {
        for(let i = 0; i < manager.imageMarkers.length; i++)
        {   
            // ensurng that we will not take own marker for check
            if(marker._flatPos == manager.imageMarkers[i]._flatPos) 
            {
                continue;
            }

            let ownPosX = marker._pos["x"];
            let ownPosY = marker._pos["y"];
            let targetPosX = manager.imageMarkers[i]._pos["x"];
            let targetPosY = manager.imageMarkers[i]._pos["y"];

            let posTolerance = 15
            
            // checking the position tolerance for merge
            if(Math.abs(targetPosX - ownPosX) < posTolerance && Math.abs(targetPosY - ownPosY) < posTolerance) 
            {
                dragAndDrop.mergeMarkers(marker, manager.imageMarkers[i]);
                return;
            }
        }

        // find closest point on track and move marker there
        let container = marker;
        let dataset = marker._element.dataset;
        let lat = container._lngLat["lat"];
        let lon = container._lngLat["lng"];
        let index = mapObject.coordsToTrackIndex(lat, lon);
        console.log(index)
        dataset.lon = mapObject.points[index][0];
        dataset.lat = mapObject.points[index][1];
        dataset.pointIndex = index;
        container.setLngLat([dataset.lon, dataset.lat])
    }

    onDragEnd(event) 
    {
        dragAndDrop.afterPlace(event.target);
    }

    

    mergeMarkers(sourceMarker, targetMarker)
    {       
        let sourceMarkerImages = sourceMarker._element.children[0].children[0];
        let targetMarkerImages = targetMarker._element.children[0].children[0];
        
        for(let i = 0; i < sourceMarkerImages.children.length; i++)
        {
            console.log(sourceMarkerImages.children[i]);
            targetMarkerImages.appendChild(sourceMarkerImages.children[i]);
        }
        
        for(let i = 0; i < manager.imageMarkers.length; i++)
        {   
            if(sourceMarker._flatPos == manager.imageMarkers[i]._flatPos) 
            {
                manager.imageMarkers.splice(i, 1);
                sourceMarker.remove();
                break;
            }
        }  
        
        console.log("merged markers");
        console.log(manager.imageMarkers);
    }
    
}

var dragAndDrop = new DragAndDrop();

