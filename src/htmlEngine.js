import { readFileSync } from 'node:fs';

// Class to create an HTML String from a given path
// This class will parse out the HTML and generate new HTML based on what is provided
// As an example, Javascript can be inserted into the given HTML file by pointing to the 
// javascript file within the HTML like so: <script src={javascript.js}></script>
// This segement will be replaced with a script block containing the javascript in this file.
class HTMLEngine {
    #htmlString = '<body>No Body Provided</body>';

    constructor(htmlPath) {
        try {
            this.#htmlString = readFileSync(htmlPath, 'utf8');
            const htmlComponents = this.#htmlString.split('<');
            const indexScript = htmlComponents.findIndex((value) => value.indexOf('script') !== -1);
            // Found script component, insert the script
            if (indexScript !== -1) {
                this.#insertJavascript(htmlComponents);
            }
        } catch (err) {
            console.log("Unable to open source html file: ", err.message);
        }
    }

    #insertJavascript(htmlComponents) {
        const indexScript = htmlComponents.findIndex((value) => value.indexOf('script') !== -1);
        const endIndexScript = htmlComponents.findIndex((value) => value.indexOf('/script>') !== -1);
        let htmlScriptString = htmlComponents[indexScript];
        const srcIndex = htmlScriptString.indexOf('src');
        if (srcIndex === -1) {
            return;
        }
        const startIndex = htmlScriptString.indexOf('{', srcIndex);
        const endIndex = htmlScriptString.indexOf('}', srcIndex);
        if (startIndex === -1 || endIndex === -1) {
            return;
        }
        let attributeString = htmlScriptString.replace(/src={.*}/, '');
        let pathString = htmlScriptString.slice(startIndex + 1, endIndex);
        let javascriptString = `console.log('No script component found');`;

        try {
            javascriptString = readFileSync(pathString, 'utf8');
        } catch (err) {
            console.log("Unable to open source javascript file: ", err.message);
        }
        javascriptString = `<` + attributeString + javascriptString + `</script>`;

        // Insert the script file into the html string, removing the old script element
        const firstHalf = htmlComponents.slice(0, indexScript);
        const secondHalf = htmlComponents.slice(endIndexScript + 1, htmlComponents.length);
        secondHalf.unshift(''); // Added to ensure the arrays join correctly

        this.#htmlString = firstHalf.join('<') + javascriptString + secondHalf.join('<');
    }
    
    getHTMLString() {
        return this.#htmlString;
    }
}

export {
    HTMLEngine
};