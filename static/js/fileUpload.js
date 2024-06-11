class fileUpload{
	constructor(id)
    {
        this.currentStage = 0;

    	this.id = id;

        this.dropArea = document.getElementById(id);
        this.dragText = this.dropArea.querySelector("header"),
        this.button = this.dropArea.querySelector("button"),
        this.input = this.dropArea.querySelector("input");
        
        this.file;


        this.onChange = this.onChange.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.showFile = this.showFile.bind(this);
        this.nextStage = this.nextStage.bind(this);

        this.button.onclick = ()=>
        {
            this.input.click();
        }

        this.input.addEventListener("change", this.onChange);
        this.dropArea.addEventListener("dragover", this.onDragOver);
        this.dropArea.addEventListener("dragleave", this.onDragLeave);
        this.dropArea.addEventListener("drop", this.onDrop);

        
        
        this.gpx = null;
        this.name = null;
        this.photos = [];

    }

    onChange(event)
    {
        //getting user select file and [0] this means if user select multiple files then we'll select only the first one
        this.file = event.srcElement.files;
        this.dropArea.classList.add("active");
        this.showFile(); //calling function
    }

    onDragOver(event)
    {
        event.preventDefault();
        this.dropArea.classList.add("active");
        this.dragText.textContent = "Release to Upload File";
    }

    onDragLeave(event)
    {
        this.dropArea.classList.remove("active");
        this.dragText.textContent = "Drag & Drop to Upload File";
    }

    onDrop(event)
    {
        event.preventDefault(); 
        //getting user select file and [0] this means if user select multiple files then we'll select only the first one
        this.file = event.dataTransfer.files;
        console.log(this.file)
        this.showFile(); //calling function
    }


    showFile()
    {
        for( let i = 0; i < this.file.length; i++)
        {

        
            if(this.currentStage == 0)
            {
                let fileType = this.file[i].type; 
                let validExtensions = ["application/gpx+xml"]; 

                if(validExtensions.includes(fileType))
                { 
                    let fileReader = new FileReader();
                    fileReader.onload = ()=>
                    {
                        let filename = this.file[i].name;

                        let fileContent = fileReader.result.substring(32);            
                        let binaryData = atob(fileContent);
                        let textData = new TextDecoder().decode(new Uint8Array(Array.prototype.map.call(binaryData, function (c) {
                            return c.charCodeAt(0);
                        })));

                        console.log(textData);

                        let parser = new DOMParser();
                        let gpx = parser.parseFromString(textData, "text/xml");
                        console.log(gpx)

                        let content = gpx.getElementsByTagName("gpx")[0].getElementsByTagName("trk")[0];
                        let name = content.getElementsByTagName("name")[0].innerHTML;
                        
                        let points = [];
                        let pointsRaw = content.getElementsByTagName("trkseg")[0].children;
                        console.log(pointsRaw)
                        for( let i = 0; i < pointsRaw.length; i++)
                        {   
                            let x = parseFloat(pointsRaw[i].getAttribute("lat"));
                            let y = parseFloat(pointsRaw[i].getAttribute("lon"));
                            let z = parseFloat(pointsRaw[i].getElementsByTagName("ele")[0].innerHTML);
                            points.push([x,y,z]);
                        }
                        
                        console.log(name)
                        console.log(points)
                        
                        let track = new Track(points);
                        points = track.points;
                        console.log(points)
                        
                        this.name = name;
                        this.gpx = points;

                        document.getElementById("upload-text").innerHTML = filename;



                    }
                    fileReader.readAsDataURL(this.file[i]);
                
                
                    this.showNextButton();
                

                }
                else
                {
                    alert("This is not an GPX File!");
                    this.dropArea.classList.remove("active");
                    this.dragText.textContent = "Drag & Drop to Upload File";
                }
            }
            else if(this.currentStage == 1)
            {
                let fileType = this.file[i].type; 
                let validExtensions = ["image/jpeg", "image/png", "image/jpg"]; 
                if(validExtensions.includes(fileType))
                { 
                    let fileReader = new FileReader();
                    fileReader.onload = ()=>
                    {

                        let fileContent = fileReader.result;          
                        
                        this.photos.push(fileContent);
                        
                        document.getElementById("upload-text").innerHTML = "uploaded " + this.photos.length + " images";
            

                    }
                    fileReader.readAsDataURL(this.file[i]);
                
                
                    this.showNextButton();
                

                }
                else
                {
                    alert("This is not an image File!");
                    this.dropArea.classList.remove("active");
                    this.dragText.textContent = "Drag & Drop to Upload File";
                }
            }

        }
        
    }

    showNextButton()
    {
        document.getElementById("gpx-next").style.display = "block";
    }

    hideNextButton()
    {
        document.getElementById("gpx-next").style.display = "none";
    }

    nextStage()
    {
        this.currentStage++;

        if(this.currentStage == 1)
        {    
            this.showBox();
            hideTitle();
            setTimeout(function()
            {
                document.getElementById("upload-title").innerHTML = "add photos";
                upload.hideNextButton();
                document.getElementById("upload-text").innerHTML = "";
                showTitle(["Now add photos from your trip", "(it would be great if they have loaction metadata or date timestamp)"])

            }, 2000); 
        }else
        {
            
            hideTitle();
            let titleBox = document.getElementById("content-box");
            titleBox.classList.add('upload-animation');
            setTimeout(function()
            {
                console.log("adding map...");
                titleBox.remove();


                mapObject.addMap(upload.gpx);

                document.getElementById("image-tab").style.display = "block";
                document.getElementById("options-tab").style.display = "block";
                
                setTimeout( function() 
                { 
                    mapObject.applyOptionsToMap(); 
                    trackAnimation.updatePoints(upload.gpx);
                }, 3000);

                images.init(upload.photos);

            }, 2500); 
        }
    }

    showBox()
    {
       
        let titleBox = document.getElementById("content-box");
        titleBox.classList.add('upload-animation');
        setTimeout(function()
        {
            titleBox.classList.remove('upload-animation');

        }, 6000); 
        
        
    }

}


var upload = new fileUpload("gpx-upload");











