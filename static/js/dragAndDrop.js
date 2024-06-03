class DragAndDrop 
{
    constructor()
    {

    }

    spawnMarker(src) // this method spawn marker on the map with image src inside
    {
        let startingPoint = mapObject.points[0];
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
                        'coordinates': [startingPoint[0],startingPoint[1], startingPoint[2]]
                    }
                }
            ]
        };


        geojson.features.forEach(function (marker) 
        {

            let container = document.createElement('div');
            container.className = "gallery-marker-container-root";

            container.dataset.src = src;
            container.dataset.lat = startingPoint[0];
            container.dataset.lon = startingPoint[1];

            

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

            
            
            el.appendChild(img);
            container.appendChild(el)
            

            let dragMarker = new maptilersdk.Marker({element: container,draggable: true})
                .setLngLat(marker.geometry.coordinates)
                .addTo(mapObject.map);
                dragMarker.on('dragend', dragAndDrop.onDragEnd);

            manager.imageMarkers.push(dragMarker);
            console.log(manager.imageMarkers)

        });
        
    }

    onDragEnd(event) 
    {
        for(let i = 0; i < manager.imageMarkers.length; i++)
        {   
            // ensurng that we will not take own marker for check
            if(event.target._flatPos == manager.imageMarkers[i]._flatPos) 
            {
                continue;
            }

            let ownPosX = event.target._pos["x"];
            let ownPosY = event.target._pos["y"];
            let targetPosX = manager.imageMarkers[i]._pos["x"];
            let targetPosY = manager.imageMarkers[i]._pos["y"];

            console.log(ownPosX, ownPosY, targetPosX, targetPosY)
            
            // checking the position tolerance for merge
            if(Math.abs(targetPosX - ownPosX) < 10 && Math.abs(targetPosY - ownPosY) < 10) 
            {
                dragAndDrop.mergeMarkers(event.target, manager.imageMarkers[i]);
            }
        }
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

