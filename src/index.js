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
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const clientDevice = getHeaderValue(data.toString(), 'User-Agent');

    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<H3 data-testid="ip">ip: ${clientIP}</H3>`);
      socket.write(`<H3 data-testid="city"> Cidade: ${locationData.city}</H3>`);
      socket.write(`<H3 data-testid="postal_code"> Código Postal: ${locationData.postal_code}</H3>`);
      socket.write(`<H3 data-testid="region"> Região: ${locationData.region}</H3>`);
      socket.write(`<H3 data-testid="country"> País: ${locationData.country_name}</H3>`);
      socket.write(`<H3 data-testid="company"> Companhia: ${locationData.company}</H3>`);
      socket.write(`<p data-testid="device"> Dispositivo: ${clientDevice}</H3>`);
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write('</body></html>');
      socket.write(endOfResponse);
      socket.end();
    });
  });
});

server.listen(8080);
