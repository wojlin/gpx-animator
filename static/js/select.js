class Select{
	constructor(id, placeholder)
    {
        this.currentSrc = "";
        this.currentName = "";

        this.id = id;
        this.placeholder = document.getElementById(placeholder);
        this.select = document.getElementById(id);
        this.currentState = false;
        

        this.options = document.createElement("div");
        this.options.classList.add("select-container");

        this.addSelectedOption();

        this.optionsContainer = document.createElement("div");
        this.options.appendChild(this.optionsContainer);


        this.selectOption = this.selectOption.bind(this);
        this.toogleSelect = this.toogleSelect.bind(this);
        
        

        for(let i = 0; i < this.select.children.length; i++)
        {
            let src = this.select.children[i].dataset.src;
            let name = this.select.children[i].dataset.name;
            let option = document.createElement("div");
            option.classList.add("select-option")
            let span = document.createElement("span");
            span.innerHTML = name;
            span.classList.add("select-name")
            let img = document.createElement("img");
            img.src = src;
            img.classList.add("select-image")
            option.appendChild(img);
            option.appendChild(span);

            option.onclick = (event)=>
            {
                this.selectOption(event);
            }
            
            option.dataset.src = src;
            option.dataset.name = name;

            this.optionsContainer.appendChild(option)
        }

        this.select.style.display = "none";

        this.placeholder.appendChild(this.options);
        this.optionsContainer.style.display = "none";
    }

    addSelectedOption()
    {
        let src = this.select.children[0].dataset.src;
        let name = this.select.children[0].dataset.name;
        this.currentSrc = src;
        this.currentName = name;
        let option = document.createElement("div");
        option.classList.add("select-selected")
        let span = document.createElement("span");
        span.innerHTML = name;
        span.id=this.id+"-title-span";
        span.classList.add("select-name")
        let selector = document.createElement("span");
        selector.classList.add("select-selector")
        selector.innerHTML = "▲";
        selector.id = this.id+"-selector";
        let img = document.createElement("img");
        img.id=this.id+"-title-img";
        img.src = src;
        img.classList.add("select-image")
        option.appendChild(img);
        option.appendChild(span);
        option.appendChild(selector);
        

        option.onclick = (event)=>
        {
            this.toogleSelect();
        }

        this.options.appendChild(option)
    }

    toogleSelect()
    {
        if(this.currentState)
        {
            this.optionsContainer.style.display = "none";
            document.getElementById(this.id+"-selector").innerHTML = "▲";
        }
        else
        {
            this.optionsContainer.style.display = "block";
            document.getElementById(this.id+"-selector").innerHTML = "▼";
        }

        this.currentState = !this.currentState;
    }

    selectOption(element)
    {
        let target = element.target;
        let src = target.dataset.src;
        let name = target.dataset.name;
        
        this.currentName = name;
        this.currentSrc = src;

    

        document.getElementById(this.id+"-title-img").src = src;
        document.getElementById(this.id+"-title-span").innerHTML = name;

        console.log(this.getCurrentOption());

        this.toogleSelect();
    }

    getCurrentOption()
    {
        return [this.currentSrc, this.currentName];
    }
}

var iconSelect = new Select("icon-select", "icon-select-placeholder");
var modeSelect = new Select("mode-select", "mode-select-placeholder");
