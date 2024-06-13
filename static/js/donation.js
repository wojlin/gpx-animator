class Donation{
	constructor()
    {
        this.container = this.get("donation-container");
        this.bear = this.get("donation-bear");
        this.clouds = 
        [
            this.get("donation-cloud-1"),
            this.get("donation-cloud-2"),
            this.get("donation-cloud-3"),
            this.get("donation-cloud-4")
        ];

        this.showAfter = 5;

        setTimeout(function()
        {
            donation.show()
        }, 1000 * this.showAfter); 
    }

    get(id)
    {
        return document.getElementById(id);
    }

    show()
    {

        donation.container.classList.add("donation-add-class")

        setTimeout(function()
        {
            donation.clouds[0].style.opacity = 1;
        }, 2200 ); 

        setTimeout(function()
        {
            donation.clouds[1].style.opacity = 1;
        }, 2400 ); 

        setTimeout(function()
        {
            donation.clouds[2].style.opacity = 1;
        }, 2600 ); 

        setTimeout(function()
        {
            donation.clouds[3].style.opacity = 1;
        }, 2800 ); 


         
    }

    close()
    {
        this.bear.src = "static/images/bear-dead.png";

        setTimeout(function()
        {
            donation.clouds[3].style.opacity = 0;
        }, 200 ); 

        setTimeout(function()
        {
            donation.clouds[2].style.opacity = 0;
        }, 400 ); 

        setTimeout(function()
        {
            donation.clouds[1].style.opacity = 0;
        }, 600 ); 

        setTimeout(function()
        {
            donation.clouds[0].style.opacity = 0;
        }, 800 ); 

        setTimeout(function()
        {
            donation.container.classList.add("donation-hide-class")
        }, 1000 ); 

        setTimeout(function()
        {
            donation.container.style.display = "none";
        }, 6000 ); 
        
    }


}

var donation = new Donation();