const net = require('net');
const os = require('os');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data.split('\r\n').find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';

const endOfResponse = '\r\n\r\n';

const server = net.createServer((c) => {
  c.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const clientData = getHeaderValue(data.toString(), 'User-Agent');
    const cpuInfo = `${[
      'CPU Info:',
      `<li>Quantidade de cores: ${os.cpus().length}</li>`,
      `<li>Modelo: ${os.cpus()[0].model}</li>`,
      `<li>Frequência: ${os.cpus()[0].speed} mhz</li>`,
    ].join('\r\n')}`;

    getLocationInfos(
      clientIP,
      ({ city, postal_code: postalCode, region, country_name: country, company }) => {
        c.write(startOfResponse);
        c.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
        c.write('<title>Trybe 🚀</title></head><body>');
        c.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
        c.write(
          '<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>',
        );
        c.write(`<p data-testid="ip">${clientIP}</p>`);
        c.write(`<p data-testid="device">${clientData}</p>`);
        c.write(`<p data-testid="arch">${os.arch()}</p>`);
        c.write(`<div data-testid="cpu">${cpuInfo}</div>`);
        c.write(`<p data-testid="memory">${os.totalmem()}</p>`);
        c.write(`<p data-testid="city">${city}</p>`);
        c.write(`<p data-testid="postal_code">${postalCode}</p>`);
        c.write(`<p data-testid="region">${region}</p>`);
        c.write(`<p data-testid="country">${country}</p>`);
        c.write(`<p data-testid="company">${company}</p>`);
        c.write('</body></html>');
        c.write(endOfResponse);
      },
    );
  });
});

server.listen(8080);
