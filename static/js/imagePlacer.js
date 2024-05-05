class imagePlacer{
	constructor(photos)
    {
        this.photos = photos;
        this.imagesPanel = document.getElementById("image-tab-content");
        this.placeImages();
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
            imageBox.appendChild(image);
            this.imagesPanel.appendChild(imageBox);
        }
    }

}

