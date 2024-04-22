const http = require('http');
const url = require('url');
const fs = require('fs');
const port = 5678;
const hostman = `127.0.0.1`;

const server = http.createServer();
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const dataJson = JSON.parse(data);

const replaceCarac = (item, target) => {
    let output = item.replace(/{%IMAGE%}/g, target.image)
    output = output.replace(/{%PRODUCTNAME%}/g, target.productName)
    output = output.replace(/{%FROM%}/g, target.from)
    output = output.replace(/{%QUANTITY%}/g, target.quantity)
    output = output.replace(/{%NUTRITIENTS%}/g, target.nutrients)
    output = output.replace(/{%PRICE%}/g, target.price)
    output = output.replace(/{%DESCRIPTION%}/g, target.description)
    output = output.replace(/{%ID%}/g, target.id) 
    return output;
}

const templateCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');

server.on('request', (req, res) => {
    const {query, pathname} = url.parse(req.url, true);
    // let pathname = url.parse(req.url).pathname;
    if (pathname === '/overview' || pathname === '/') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        });

        const overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
        let myCard = dataJson.map(item => replaceCarac(templateCard, item)).join('');
        let result = overview.replace(/{%CARD%}/g, myCard);
        res.end(result);
    } else if (pathname === '/product') {
        const productTemplate = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
        // let myProduct = dataJson.map(item => replaceCarac(productTemplate, item)).join('');
        let product = dataJson[query.id]
        let myProduct = replaceCarac(productTemplate,product)

        res.writeHead(200, {
            'Content-type': 'text/html',
        });
        res.end(myProduct);
    } else {
        res.end('Unknown path!!');
    }
});

server.listen(port, hostman, () => {
    console.log(`Server is listening on http://${hostman}:${port}`);
});
