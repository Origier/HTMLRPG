import { appendFileSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';

// Base Script and HTML files will be read into these variables
let myHTML = '';
let myScript = '';

// Read in the HTML from our index file
try {
    myHTML = readFileSync('./html/index.html', 'utf8');
} catch (err) {
    console.log("Some unknown error occured ", err.message);
}

myHTML = myHTML === '' ? '<body>Hello world</body>' : myHTML;

// Read in the Javascript from our index.js file
try {
    myScript = readFileSync('./src/index.js', 'utf8');
} catch (err) {
    console.log("Some unknown error occured ", err.message);
}

myScript = myScript === '' ? 'console.log("The script was not generated properly");' : myScript; 
myScript = `<script>` + myScript + `</script>`;

// Insert the script component into the html component
const componentsHTML = myHTML.split('<');

// Find the last part of the body
const index = componentsHTML.findIndex((value) => value === '/body');

// Split into halves and rejoin with the componentsScript array between the halves
const firstHalf = componentsHTML.slice(0, index - 1);
const secondHalf = componentsHTML.slice(index - 1, componentsHTML.length);
secondHalf.unshift('');
myHTML = firstHalf.join('<') + myScript + secondHalf.join('<');


const myServer = createServer((req, res) =>  {
    res.write(myHTML);
    res.end();
});

myServer.listen(8080);