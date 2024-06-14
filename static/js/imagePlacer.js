class imagePlacer{
	constructor(photos)
    {
        this.photos = [];
        this.timestamps = [];
        this.geotags = [];
        this.imagesPanel = null;
    }

    init(photos, timestamps, geotags)
    {
        this.photos = photos;
        this.geotags = geotags;
        this.timestamps = timestamps;
        this.imagesPanel = document.getElementById("image-tab-content");
        this.placeImages();
    }

    addImage(src, timestamp, geotag)
    {
        let imageBox = document.createElement("div");
        imageBox.classList.add("images-box");

        let image = document.createElement("img");
        image.src = src;
        image.dataset.geotag = geotag;
        image.dataset.timestamp = timestamp;
        image.classList.add("images-img");

        let startingPoint = mapObject.points[0];

        image.onclick = (event)=>
        {
            dragAndDrop.spawnMarker(event.target.src, startingPoint[0],startingPoint[1], startingPoint[2]);
            event.target.parentNode.remove();
        }

        image.draggable = true;
        image.ondragstart = (event)=>
        {
            console.log(event);
            dragAndDrop.spawnMarker(event.target.src, startingPoint[0],startingPoint[1], startingPoint[2]);
            
            event.target.parentNode.remove();
        }

        imageBox.appendChild(image);
        this.imagesPanel.appendChild(imageBox);
    }

    placeImages()
    {
        for(let i = 0; i < this.photos.length; i++)
        {
            this.addImage(this.photos[i], this.timestamps[i], this.geotags[i]);
        }
    }

}

var images = new imagePlacer();

