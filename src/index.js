const net = require('net');
const os = require('os');

const formatCpu = (cpu) => `<li>Modelo ${cpu.model} com velocidade ${cpu.speed}</li>`;

const serverInfo = {
  arch: os.arch(),
  cpus: os.cpus(),
  memory: os.freemem(),
};

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
    const device = getHeaderValue(data.toString(), 'User-Agent');

    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<p data-testid="ip">${clientIP}</p>`);
      socket.write(`<p data-testid="city">${locationData.city}</p>`);
      socket.write(`<p data-testid="postal_code">${locationData.postal_code}</p>`);
      socket.write(`<p data-testid="region">${locationData.region}</p>`);
      socket.write(`<p data-testid="country">${locationData.country_namez}</p>`);
      socket.write(`<p data-testid="company">${locationData.company}</p>`);
      socket.write(`<p data-testid="device">${device}</p>`);
      socket.write(`<p data-testid="arch">${serverInfo.arch}</p>`);
      socket.write(`<ul data-testid="cpu">
<h3>${serverInfo.cpus.length}</h3>
${serverInfo.cpus.map(formatCpu).join('')}</ul>`);
      socket.write(`<p data-testid="memory"> ${serverInfo.memory}</p >`);
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

server.on('error', (err) => console.err('\u001b[31m', err, '\u001b0m'));

server.listen(8080, () => console.log('Ouvindo na porta 8080'));
