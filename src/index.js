const net = require('net');

const { getLocationInfos } = require('./location');

const startOfResponse = null;

const endOfResponse = null;

const server = net.createServer((socket) => {
  socket.on('data', (_data) => {
    const clientIP = null;

    getLocationInfos(clientIP, (_locationData) => {
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Projeto - Explorando Protocolos</title></head><body>');
      socket.write('<H1>Explorando os Protocolos</H1>');
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
