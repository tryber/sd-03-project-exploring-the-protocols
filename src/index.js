const net = require('net');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  console.log(data);
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const startOfResponse = `${[
  'HTTP/1.1 200 OK',
  'Content-Type: text/html; charset=UTF-8',
].join('\r\n')}\r\n\r\n`;

const endOfResponse = '\r\n\r\n';

const server = net.createServer((c) => {
  c.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    getLocationInfos(clientIP, ({ city, postal_code: postalCode, region, country, company}) => {
      c.write(startOfResponse);
      c.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      c.write('<title>Trybe 🚀</title></head><body>');
      c.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      c.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      c.write(`<p data-testid="ip">${clientIP}</p>`);
      c.write(`<p data-testid="city">${city}</p>`);
      c.write(`<p data-testid="postal_code">${postalCode}</p>`);
      c.write(`<p data-testid="region">${region}</p>`);
      c.write(`<p data-testid="country">${country}</p>`);
      c.write(`<p data-testid="company">${company}</p>`);
      c.write('</body></html>');
      c.write(endOfResponse);
    });
  });
});

server.listen(8080);
