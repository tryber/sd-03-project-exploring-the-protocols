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
const endOfResponse = '/r/n/r/n';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const clientData = getHeaderValue(data.toString(), 'User-Agent');
    const cpuInfo = `${[
      'CPU Info:',
      `<li>Quantidade de cores: ${os.cpus().length}</li>`,
      `<li>Modelo: ${os.cpus()[0].model}</li>`,
      `<li>Frequência: ${os.cpus()[0].speed} mhz</li>`,
    ].join('\r\n')}`;

    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write(`<p data-testid="ip">${clientIP}</p>`);
      socket.write(`<p data-testid="device">${clientData}</p>`);
      socket.write(`<p data-testid="arch">${os.arch()}</p>`);
      socket.write(`<div data-testid="cpu">${cpuInfo}</div>`);
      socket.write(`<p data-testid="memory">${os.totalmem()}</p>`);
      socket.write(`<p data-testid="city">${locationData.city}</p>`);
      socket.write(`<p data-testid="postal_code">${locationData.postalCode}</p>`);
      socket.write(`<p data-testid="region">${locationData.region}</p>`);
      socket.write(`<p data-testid="country">${locationData.country}</p>`);
      socket.write(`<p data-testid="company">${locationData.company}</p>`);
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
