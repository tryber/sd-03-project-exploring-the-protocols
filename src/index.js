const net = require('net');
const os = require('os');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';

const endOfResponse = '\r\n\r\n';

// Solução junto com Rhian e Hebertão
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const userAgent = getHeaderValue(data.toString(), 'User-Agent');

    const cpusPrint = () => {
      const str = [];
      const cpus = os.cpus();

      str.push(`Core quantity ${cpus.length}`);

      cpus.forEach(({ model, speed }) => str.push(`Model: ${model},
      Speed: ${speed}`));

      return str.join('\r\n');
    };

    getLocationInfos(clientIP, (locationData) => {
      console.log(locationData);
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<H3 data-testid="ip">ip: ${clientIP}</H3>`);
      socket.write(`<H3 data-testid="city">city: ${locationData.city}</H3>`);
      socket.write(`<H3 data-testid="postal_code">postal_code: ${locationData.postal_code}</H3>`);
      socket.write(`<H3 data-testid="region">region: ${locationData.region}</H3>`);
      socket.write(`<H3 data-testid="company">company: ${locationData.company}</H3>`);
      socket.write(`<H3 data-testid="country">country: ${locationData.country_name}</H3>`);
      socket.write(`<H3 data-testid="device">device: ${userAgent}</H3>`);
      socket.write(`<H3 data-testid="arch" >arch: ${os.arch}</H3>`);
      socket.write(`<H3 data-testid="cpu" >cpu: ${cpusPrint()}</H3>`);
      socket.write(`<H3 data-testid="memory" >memory: ${os.totalmem}</H3>`);
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080, () => console.log('Listening...'));
