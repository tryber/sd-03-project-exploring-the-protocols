const net = require('net');
const os = require('os');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));
  // console.log(headerData);

  return headerData.split(': ').pop();
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';

const endOfResponse = '\r\n\r\n';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const device = getHeaderValue(data.toString(), 'User-Agent');
    // console.log(data);

    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write('<h3>Dados do Cliente</h3>');
      socket.write(`<p data-testid="ip">Ip: ${clientIP}</p>`);
      socket.write(`<p data-testid="city"">Cidade: ${locationData.city}</p>`);
      socket.write(`<p data-testid="postal-code">Código Postal: ${locationData.postal_code}</p>`);
      socket.write(`<p data-testid="region">Região: ${locationData.region}</p>`);
      socket.write(`<p data-testid="country">País: ${locationData.country_name}</p>`);
      socket.write(`<p data-testid="company">Empresa: ${locationData.company}</p>`);
      socket.write(`<p data-testid="device">Aparelho: ${device}</p>`);
      socket.write(`<p data-testid="arch">Arquitetura: ${os.arch()}</p>`);
      socket.write(`<p data-testid="cpu">CPU: ${os.cpus().length}</p>`);
      socket.write(`<p data-testid="memory">Memória: ${os.totalmem() / (1000 * 1000 * 1000)}</p>`);
      socket.write('</body></html>');
      socket.write(endOfResponse);
      socket.end();
      // console.log(locationData);
    });
  });
});

server.listen(8080);
