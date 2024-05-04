function addMap(points)
{
    for(let i = 0; i < points.length; i++)
    {
        let saved = points[i][0];
        points[i][0] = points[i][1];
        points[i][1] = saved;
    }

    let startingPoint = points[0];
    let endingPoint = points[points.length - 1];

    document.getElementById("map-container").style.display = "block";

    maptilersdk.config.apiKey = 'iBMdZnhZEwU4AcVpsPuh';
    const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: maptilersdk.MapStyle.HYBRID,
    center: startingPoint, // starting position [lng, lat]
    zoom: 14, // starting zoom
    terrain: true,
    terrainControl: true,
    maxPitch: 85,
    maxZoom: 18
    });

    

    const startMarker = new maptilersdk.Marker()
    .setLngLat(startingPoint)
    .addTo(map);

    const endMarker = new maptilersdk.Marker()
    .setLngLat(endingPoint)
    .addTo(map);


    var geojson = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'geometry': { 'type': 'LineString', 'coordinates': points,}
        }
            ]
    };

    map.on('load', function () 
    {
    map.addSource('line', {'type': 'geojson','data': geojson});
    map.addLayer({
    'id': 'line-animation',
    'type': 'line',
    'source': 'line',
    'layout': {
        'line-cap': 'round',
        'line-join': 'round'
    },
    'paint': {
        'line-color': '#ed6498',
        'line-width': 5,
        'line-opacity': 0.8
    }
    });

    });
}


