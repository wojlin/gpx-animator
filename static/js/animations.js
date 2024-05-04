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


var imagesState = true;
var optionsState = true;

function toggleImagesTab()
{
    if(imagesState)
    {
        document.getElementById("image-tab").classList.remove("show-image-tab");
        document.getElementById("image-tab").classList.add("hide-image-tab");
    }
    else
    {
        document.getElementById("image-tab").classList.remove("hide-image-tab");
        document.getElementById("image-tab").classList.add("show-image-tab");
    }

    imagesState = !imagesState
}

function toggleOptionsTab()
{
    if(optionsState)
    {
        document.getElementById("options-tab").classList.remove("show-options-tab");
        document.getElementById("options-tab").classList.add("hide-options-tab");
    }
    else
    {
        document.getElementById("options-tab").classList.remove("hide-options-tab");
        document.getElementById("options-tab").classList.add("show-options-tab");
    }

    optionsState = !optionsState;
}