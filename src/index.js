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

    // Pega o IP do cliente usado na request do Ngrok p/ jogar na função (cb) que renderiza no HTML
    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`Seu IP atual é: <span data-testid="ip">${clientIP}</span>`);
      socket.write(`<span data-testid="company">${locationData.isp}</span>`);
      socket.write(`<span data-testid="city">${locationData.city},</span>`);
      socket.write(`<span data-testid="region">${locationData.region},</span>`);
      socket.write(`<span data-testid="postal_code">${locationData.postal_code},</span>`);
      socket.write(`<span data-testid="country">${locationData.country_name}.</span>`);
      socket.write(`<p>Seu user-agent: <span data-testid="device">${userAgent}</span></p>`);
      socket.write('<p>Dados do servidor</p>');
      socket.write(`Sistema operacional: <span data-testid="arch">${os.arch()}</span>`);
      socket.write(`CPUs: <span data-testid="cpu">${os.cpus().length}</span>`);
      socket.write(`Memória total: <span data-testid="memory">${os.totalmem}</span>`);
      socket.write('<p><iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></p>');
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080, () => console.log('Escutando na porta 8080'));
