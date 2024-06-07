class Slideshow{
	constructor()
    {
    }

    init(photosURL, totalTime)
    {
        if(document.getElementById("photo-frame"))
        {
            console.error("cannot init photo frame, destroy current one first")
            return;
        }

        let frame = document.createElement("div");
        frame.id = "photo-frame"
        frame.style.backgroundColor = "rgba(0,0,0,0.92)";
        frame.style.position = "absolute";
        frame.style.left = '0';
        frame.style.right = '0';
        frame.style.top = '0';
        frame.style.bottom = '0';
        frame.style.zIndex = '4';

        for( let i = 0; i < photosURL.length; i++)
        {
            let img = document.createElement("img");
            img.src = photosURL[i];
            img.style.zIndex = '5';
            img.style.height = '80vh';
            img.style.width = 'auto';
            img.style.margin = 'auto';
            img.style.marginTop = '10vh';
            img.style.display = "none";
            img.style.transition = 'all 0.5s';
            img.style.opacity = '0';
            
            frame.appendChild(img);
        }

        document.body.appendChild(frame);
        
        this.switchPhoto(0, photosURL.length, totalTime / photosURL.length);
        
    }

    switchPhoto(currentIndex, totalAmount, totalTime)
    {
        document.getElementById("photo-frame").children[currentIndex].style.display = "block";
        document.getElementById("photo-frame").children[currentIndex].style.opacity = '1';

        setTimeout(function()
        {
           document.getElementById("photo-frame").children[currentIndex].style.opacity = '0';
           
        }, (totalTime*1000) - 500);

        setTimeout(function()
        {
            document.getElementById("photo-frame").children[currentIndex].style.display = "none";
            if(currentIndex + 1 == totalAmount)
            {
                slideshow.destroy()
            }else
            {
                slideshow.switchPhoto(currentIndex+=1, totalAmount, totalTime);
            }
           
        }, totalTime*1000);
    }

    destroy()
    {
        document.getElementById("photo-frame").remove();
    }
}

var slideshow = new Slideshow();