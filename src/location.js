const https = require('https');

const options = {
  hostname: 'iplocation.com',
  port: 443,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

const getLocationInfos = (clientIP, cb) => {
  const req = https.request(options, (res) => {
    res.on('data', (locationDataRaw) => {
      const locationData = JSON.parse(locationDataRaw.toString());
      console.log('Location data:');
      console.log(locationData);
      res.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      res.write('<title>Trybe 🚀</title></head><body>');
      res.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      res.write(`<p data-testid="city">${locationDataRaw.city}</p>`);
      res.write(`<p data-testid="postal_code">${locationDataRaw.postal_code}</p>`);
      res.write(`<p data-testid="region">${locationDataRaw.region}</p>`);
      res.write(`<p data-testid="country">${locationDataRaw.country}</p>`);
      res.write(`<p data-testid="company">${locationDataRaw.company}</p>`);
      res.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      res.write('</body></html>');
      cb(locationData);
    });
    // res.write(`ip=${clientIP}`);
  });

  req.on('error', (e) => {
    console.error(e);
  });

  // TO DO: Enviar mensagem (IP) ao server
  req.write(`ip=${clientIP}`);

  req.end();
};

module.exports = {
  getLocationInfos,
};
