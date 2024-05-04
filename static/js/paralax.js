class Paralax
{
    constructor()
    {
        this.panelTemplateId = "background-level-";
        this.levelsAmount = 10;
        this.panels = [];

        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.centerX = this.screenWidth / 2;
        this.centerY = this.screenHeight / 2;

        this.distanceX = 0;
        this.distanceY = 0;

        this.config = this.config.bind(this);
        this.updateCursorPosition = this.updateCursorPosition.bind(this);


        for( let i = 1; i <= this.levelsAmount; i++)
        {   
            this.panels.push(document.getElementById(this.panelTemplateId+i));
        }

        document.addEventListener("DOMContentLoaded", function() 
        {
            paralax.config();
        });
        
        
    }


    config()
    {
        for( let i = 1; i <= this.levelsAmount; i++)
        {   
            let panel = document.getElementById(this.panelTemplateId+i);
            panel.style.width = (this.screenWidth * 1.3) + "px";
        }
        
        
        document.addEventListener('mousemove', this.updateCursorPosition);
    }


    updateCursorPosition(event) 
    {
        let mouseX = event.clientX;
        let mouseY = event.clientY;

        this.distanceX = (mouseX - this.centerX) / this.screenWidth;
        this.distanceY = (mouseY - this.centerY) / this.screenHeight;
        
        this.updateParalax(this.distanceX, this.distanceY);
        
    }

    updateParalax(x, y)
    {
        for( let i = 1; i <= this.levelsAmount; i++)
        {   
            let moveX = x * (6/i);
            let moveY = y * (6/i);
            this.panels[i-1].style.marginTop = -moveY + "%";
            this.panels[i-1].style.marginLeft = -moveX + "%";
        }
    }

}

var paralax = new Paralax();

window.addEventListener("resize", () => {
    //window.location.reload();
});