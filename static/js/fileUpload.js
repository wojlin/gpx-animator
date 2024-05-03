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

        this.button.onclick = ()=>
        {
            this.input.click();
        }

        this.input.addEventListener("change", this.onChange);


        //If user Drag File Over DropArea
        this.dropArea.addEventListener("dragover", this.onDragOver);

        //If user leave dragged File from DropArea
        this.dropArea.addEventListener("dragleave", this.onDragLeave);
        
        //If user drop File on DropArea
        this.dropArea.addEventListener("drop", this.onDrop);

        
        
        this.gpx = null;
        this.name = null;
        this.photos = null;

    }

    onChange(event)
    {
        //getting user select file and [0] this means if user select multiple files then we'll select only the first one
        this.file = event.srcElement.files[0];
        this.dropArea.classList.add("active");
        this.showFile(); //calling function
    }

    onDragOver(event)
    {
        event.preventDefault(); //preventing from default behaviour
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
        event.preventDefault(); //preventing from default behaviour
        //getting user select file and [0] this means if user select multiple files then we'll select only the first one
        this.file = event.dataTransfer.files[0];
        console.log(this.file)
        this.showFile(); //calling function
    }


    showFile()
    {
        let fileType = this.file.type; 

        let validExtensions = ["application/gpx+xml"]; 

        if(validExtensions.includes(fileType)){ //if user selected file is an image file
          let fileReader = new FileReader(); //creating new FileReader object
          fileReader.onload = ()=>{

                let filename = this.file.name; // Get the filename

                let fileContent = fileReader.result.substring(32);            
                let binaryData = atob(fileContent);
                let textData = new TextDecoder().decode(new Uint8Array(Array.prototype.map.call(binaryData, function (c) {
                    return c.charCodeAt(0);
                })));

                // Now 'textData' contains the XML data from the GPX file
                console.log(textData);

                var parser = new DOMParser();
                var gpx = parser.parseFromString(textData, "text/xml");
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
                
                this.name = name;
                this.gpx = points;

                document.getElementById("upload-text").innerHTML = filename;



          }
          fileReader.readAsDataURL(this.file);
          
          
          this.showNextButton();
          

        }
        else{
          alert("This is not an GPX File!");
          this.dropArea.classList.remove("active");
          this.dragText.textContent = "Drag & Drop to Upload File";
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
        this.showBox();
        hideTitle();
        setTimeout(function()
        {
            document.getElementById("upload-title").innerHTML = "add photos";
            upload.hideNextButton();
            document.getElementById("upload-text").innerHTML = "";
            showTitle(["Now add photos from your trip", "(it would be great if they have loaction metadata)"])

        }, 2000); 
    }

    showBox()
    {
        let titleBox = document.getElementById("content-box");
        titleBox.classList.add('upload-animation');
    }

}


var currentPhase = 0;

var upload = new fileUpload("gpx-upload");



function showTitle(text)
{
    let titleBox = document.getElementById("title-box");
    titleBox.classList.add('fade-in');
    titleBox.classList.remove('fade-out');

    let content = "";
    for(let i = 0; i < text.length; i++)
    {
        content += "<p>" + text[i] + "</p>";
    }

    titleBox.innerHTML = content;
    
}

function hideTitle()
{
    let titleBox = document.getElementById("title-box");
    titleBox.classList.add('fade-out');
    titleBox.classList.remove('fade-in');
}

showTitle(["Welcome to GPX animator!", "First step is to upload a GPX file of your trip"])







