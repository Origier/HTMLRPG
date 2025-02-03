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
            res.writeHead(200, {'content-type': 'text/html'});
            const bodyArgs = parseBody(body);
            playerLocation.x += parseInt(bodyArgs.right) - parseInt(bodyArgs.left);
            playerLocation.y += parseInt(bodyArgs.up) - parseInt(bodyArgs.down);
            engine.insertVariables({playerLocation: playerLocation});
            res.write(engine.getHTMLString());
            res.end();
        })
    }
});

myServer.listen(8080);