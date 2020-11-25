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

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const userAgent = getHeaderValue(data.toString(), 'User-Agent');

    getLocationInfos(clientIP, ({
      company, city, country_name: countryName, region, postal_code: postalCode,
    }) => {
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><br>');
      socket.write(`<span data-testid="ip">Ip: ${clientIP}</span><br>`);
      socket.write(`<span data-testid="city">Cidade: ${city}</span><br>`);
      socket.write(`<span data-testid="postal_code">Código Postal: ${postalCode}</span><br>`);
      socket.write(`<span data-testid="region">Região: ${region}</span><br>`);
      socket.write(`<span data-testid="country">País: ${countryName}</span><br>`);
      socket.write(`<span data-testid="company">Empresa: ${company}</span><br>`);
      socket.write(`<span data-testid="device">Aparelho: ${userAgent}</span><br>`);
      socket.write(`<span data-testid="arch">Arquitetura: ${os.arch()}</span><br>`);
      socket.write(`<span data-testid="cpu">CPU: ${os.cpus().length}</span><br>`);
      socket.write(`<span data-testid="memory">Memória: ${os.totalmem() / (1000 * 1000 * 1000)}</span><br>`);
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
