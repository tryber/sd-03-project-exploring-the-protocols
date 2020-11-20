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
    const arch = os.arch();
    const cpus = os.cpus();
    const memory = os.freemem();

    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      socket.write(
        '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">',
      );
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(
        '<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>',
      );
      socket.write('<h3>Informações do Cliente:</h3>');
      socket.write(`<p data-testid="ip">IP do cliente: ${locationData.ip}</p>`);
      socket.write(`<p data-testid="city">Cidade: ${locationData.city}</p>`);
      socket.write(`<p data-testid="postal_code">Código postal: ${locationData.postal_code}</p>`);
      socket.write(`<p data-testid="region">Região: ${locationData.region}</p>`);
      socket.write(`<p data-testid="country">País: ${locationData.country}</p>`);
      socket.write(`<p data-testid="company">Companinha: ${locationData.company}</p>`);
      socket.write(`<p data-testid="divice">Dispositivo: ${userAgent}</p>`);
      socket.write('<h3>Informações do Servidor:</h3>');
      socket.write(`<p data-testid="arch">Arch: ${arch}</p>`);
      socket.write('<p>CPUS:<p/>');
      socket.write('<ul data-testid="cpu">');
      cpus.forEach(({ model, speed }) => socket.write(`<li>Modelo: ${model} - Velocidade: ${speed}</li>`));
      socket.write('</ul>');
      socket.write(`<p data-testid="memory">Memória: ${memory}</p>`);
      socket.write('</body></html>');
      socket.write(endOfResponse);
      socket.end();
    });
  });
});

server.listen(8080);
