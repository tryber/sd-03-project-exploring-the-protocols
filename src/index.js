const net = require('net');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};
console.log(getHeaderValue);
const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';

const endOfResponse = '\r\n\r\n';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log(data.toString(), '=> inicio');
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    console.log(clientIP, 'clientIP');
    const userAgent = getHeaderValue(data.toString(), 'User-Agent');
    console.log(userAgent);
    getLocationInfos(clientIP, (locationData) => {
      console.log(locationData.toString());
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<H3 data-testid="city">city: ${locationData.city}</H3>`);
      socket.write(`<H3 data-testid="postal_code">postal_code: ${locationData.postal_code}</H3>`);
      socket.write(`<H3 data-testid="region">region: ${locationData.region}</H3>`);
      socket.write(`<H3 data-testid="country">country: ${locationData.country_name}</H3>`);
      socket.write(`<H3 data-testid="company">company: ${locationData.company}</H3>`);
      socket.write(`<h1 data-testid="ip">${clientIP}</h1>`);
      socket.write(`<H3 data-testid="device">device: ${userAgent}</H3>`);
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
