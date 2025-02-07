import { HTMLEngine } from './htmlEngine.js';
import { createServer } from 'node:http';

// Save player location as a variable to update with post requests
let playerLocation = {
    x: 0,
    y: 0,
    toString: function() {
        return `${this.x}, ${this.y}`;
    }
};

function parseBody(requestBody) {
    const bodyArgs = requestBody.split('&');
    let argsObj = {};
    for (let arg of bodyArgs) {
        let components = arg.split('=');
        argsObj[components[0]] = components[1];
    }
    return argsObj;
}

const myServer = createServer((req, res) =>  {
    const engine = new HTMLEngine('./html/index.html');
    if (req.method === 'GET') {
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

                engine.insertVariables({playerLocation: playerLocation});
                res.write(engine.getHTMLString());
            } else {
                res.write('No endpoint found');
            }
            res.end();
        })
    }
});

myServer.listen(8080);