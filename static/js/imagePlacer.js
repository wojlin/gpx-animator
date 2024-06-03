class imagePlacer{
	constructor(photos)
    {
        this.photos = [];
        this.imagesPanel = null;
    }

    init(photos)
    {
        this.photos = photos;
        this.imagesPanel = document.getElementById("image-tab-content");
        this.placeImages();
    }

    addImage(src)
    {
        let imageBox = document.createElement("div");
        imageBox.classList.add("images-box");

        let image = document.createElement("img");
        image.src = src;
        image.classList.add("images-img")
        image.onclick = (event)=>
        {
            dragAndDrop.spawnMarker(event.target.src);
            
            event.target.parentNode.remove();
        }
        imageBox.appendChild(image);
        this.imagesPanel.appendChild(imageBox);
    }

    placeImages()
    {
        for(let i = 0; i < this.photos.length; i++)
        {
            let imageBox = document.createElement("div");
            imageBox.classList.add("images-box");

            let image = document.createElement("img");
            image.src = this.photos[i];
            image.classList.add("images-img")
            image.onclick = (event)=>
            {
                dragAndDrop.spawnMarker(event.target.src);
                
                event.target.parentNode.remove();
            }
            imageBox.appendChild(image);
            this.imagesPanel.appendChild(imageBox);
        }
    }

}

var images = new imagePlacer();

