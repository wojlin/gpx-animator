
function checkBadResolution()
{
    let panel = document.getElementById("mobile-blocker");
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    let ratio = screenHeight / screenWidth;
    console.log(ratio)
    if(ratio > 0.75)
    {
        panel.style.display = "block";
    }
    else
    {
        panel.style.display = "none";
    }
}


document.addEventListener('DOMContentLoaded', function() {
    checkBadResolution();
});

// Run the function on window resize
window.addEventListener('resize', function() {
    checkBadResolution();
});

