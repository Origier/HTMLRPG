import { HTMLEngine } from './htmlEngine.js';
import { createServer } from 'node:http';

const engine = new HTMLEngine('./html/index.html');

const myServer = createServer((req, res) =>  {
    res.write(engine.getHTMLString());
    res.end();
});

myServer.listen(8080);