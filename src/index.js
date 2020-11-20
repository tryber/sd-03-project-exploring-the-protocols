const net = require('net');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';

const endOfResponse = '\r\n\r\n';

const server = net.createServer((socket) => {
  console.log('connected');
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<p data-testid="ip">${clientIP}</H1>`);
      socket.write(`<p data-testid="city">${locationData.city}</H1>`);
      socket.write(`<p data-testid="postal_code">${locationData.postal_code}</H1>`);
      socket.write(`<p data-testid="region">${locationData.region}</H1>`);
      socket.write(`<p data-testid="country">${locationData.country_namez}</H1>`);
      socket.write(`<p data-testid="company">${locationData.company}</H1>`);
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write('</body></html>');
      socket.write(endOfResponse);
      socket.end();
    });

    socket.on('error', (err) => {
      if (err) console.error('\u001b[31m', err, '\u001b[0m');
    });
  });
});

server.listen(8080, () => console.log('Ouvindo na porta 8080'));
