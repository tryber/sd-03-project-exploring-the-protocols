const net = require('net');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';

// const startOfResponse = `GET / HTTP/1.1
// Host: localhost:8080
// Content-Type: text/html; charset=UTF-8

// `;

const endOfResponse = '\r\n\r\n';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const header = 'X-Forwarded-For';
    const clientIP = getHeaderValue(data.toString(), header);
    console.log(clientIP);

    getLocationInfos(clientIP, (locationData) => {
      console.log(locationData);
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<H3 data-testid="ip">IP: ${clientIP}</H3>`);
      socket.write(`<H3 data-testid="city">IP: ${locationData.city}</H3>`);
      socket.write(`<H3 data-testid="postal_code">IP: ${locationData.postal_code}</H3>`);
      socket.write(`<H3 data-testid="region">IP: ${locationData.region}</H3>`);
      socket.write(`<H3 data-testid="country">IP: ${locationData.country_name}</H3>`);
      socket.write(`<H3 data-testid="company">IP: ${locationData.company}</H3>`);

      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
