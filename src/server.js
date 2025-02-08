import { HTMLEngine } from './htmlEngine.js';
import { createServer } from 'node:http';


// HTML File Paths
const homePath = './html/home.html';
const mapPath = './html/map.html';

// Save player location as a variable to update with post requests
let playerLocation = {
    x: 0,
    y: 0,
    toString: function() {
        return `${this.x}, ${this.y}`;
    }
};

let playerDefaultSymbol = '&#929;';

// Map to represent the world map - contains sizing information along with object information
// TODO: Implement HTML to resend a post response to the server anytime the screen size changes
let map = {
    size: { x: 1000, y: 1000 },
    origin: { x: 0, y: 0 },
    landMarks: [],
    defaultChar: 'ˮ'
};

// Field of view to the game
let playerView = { height: 0, width: 0 };
const viewPaddingHorizontal = 40;
const viewPaddingVertical = 200;
const boxSize = 8;  // Size of a UTF-8 character 8x8 pixels - this is intended to create square map pixels

function renderMapHTMLString(mapObj, viewField, playerLocation) {   
    const gridColumns = Math.floor(viewField.width / boxSize);
    const gridRows = Math.floor(viewField.height / boxSize);
    let htmlOut = "";
    let columnsString = "";
    let i = 1;
    while (i <= gridColumns) {
        let j = 1;
        columnsString += " 8px";
        while (j <= gridRows) {
            htmlOut += `<div>${mapObj.defaultChar}</div>`;
            j += 1;
        }
        i += 1;
    }
    return { html: htmlOut, columns: columnsString };
}

function parseBody(requestBody) {
    const bodyArgs = requestBody.split('&');
    let argsObj = {};
    for (let arg of bodyArgs) {
        let components = arg.split('=');
        argsObj[components[0]] = components[1];
    }
    return argsObj;
}


// Handles the current html that is loaded by the server
let currentPath = homePath;

let engine = new HTMLEngine(currentPath);

const myServer = createServer((req, res) =>  {
    if (req.method === 'GET') {
        if (req.url === '/' || req.url === '/home') {
            currentPath = homePath;
            engine = new HTMLEngine(currentPath);
        }
        engine.insertVariables({playerLocation: playerLocation});
        res.writeHead(200, {'content-type': 'text/html'});
        res.write(engine.getHTMLString());
        res.end();
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        })

        req.on('end', () => {
            if (req.url === '/moveplayer') {
                res.writeHead(200, {'content-type': 'text/html'});
                const bodyArgs = parseBody(body);
                for (let arg in bodyArgs) {
                    switch (arg) {
                        case 'left':
                            playerLocation.x -= 1;
                            break;
                        case 'right':
                            playerLocation.x += 1;
                            break;
                        case 'down':
                            playerLocation.y -= 1;
                            break;
                        case 'up':
                            playerLocation.y += 1;
                            break;
                    } 
                }
                const renderOut = renderMapHTMLString(map, playerView);
                const htmlMap = renderOut.html;
                const columns = renderOut.columns;
                engine = new HTMLEngine(currentPath);
                engine.insertVariables({playerLocation: playerLocation, mapArea: htmlMap, columns: columns});
                res.write(engine.getHTMLString());
            } else if (req.url === '/map') {
                currentPath = mapPath;
                const bodyArgs = parseBody(body);
                playerView.height = bodyArgs.height - viewPaddingVertical;
                playerView.width = bodyArgs.width - viewPaddingHorizontal;
                const renderOut = renderMapHTMLString(map, playerView);
                const htmlMap = renderOut.html;
                const columns = renderOut.columns;
                engine = new HTMLEngine(currentPath);
                engine.insertVariables({playerLocation: playerLocation, mapArea: htmlMap, columns: columns});
                res.write(engine.getHTMLString());
            } else {
                res.write('No endpoint found');
            }
            res.end();
        })
    }
});

myServer.listen(8080);