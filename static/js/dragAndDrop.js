class DragAndDrop 
{
    constructor()
    {

    }

    spawnMarker(src)
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

            
        });
        
    }

    onDragEnd(event) 
    {
        console.log(event.target);
    }


}

var dragAndDrop = new DragAndDrop();

