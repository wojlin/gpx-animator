class Options{
	constructor()
    {
        this.optionsBox = document.getElementById('options-tab-content');
        
    }

    addEvents()
    {
        let opts = this.findInputsRecursively(this.optionsBox);
        for(let i = 0; i < opts.length; i++)
        {
            opts[i].addEventListener('change', function(e) 
            {
             
                if (!mapObject.display) 
                {
                    console.log("map does not exist yet");
                }
                else
                {
                    console.log("applying options to map");
                    mapObject.applyOptionsToMap();
                }
               
            });
        }
    }

    getOptions()
    {   
        let opts = this.findInputsRecursively(this.optionsBox);
        return opts; 
    }

    findInputsRecursively(element, inputs = []) {
        // Check if the current element is an input element
        if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
            inputs.push(element);
        }
    
        // Recursively search in each child element
        element.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                options.findInputsRecursively(child, inputs);
            }
        });
    
        return inputs;
    }
}

var options = new Options();
options.addEvents();