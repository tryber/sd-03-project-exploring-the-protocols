const https = require('https');

const options = {
  path: '/',
  hostname: 'iplocation.com',
  port: 443,
  method: 'POST',
  headers: {
    ContentType: 'application/x-www-form-urlencoded',
  },
};

const getLocationInfos = (clientIP, cb) => {
  const req = https.request(options, (res) => {
    res.on('data', (locationDataRaw) => {
      console.log('\u001b[34m', 'res on location', '\u001b[0m', res);
      console.log('\u001b[34m', 'req on location', '\u001b[0m', req);
      const locationData = JSON.parse(locationDataRaw.toString());

      console.log('Location data:');
      console.log(locationData);

      cb(locationData);
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.write(`ip=${clientIP}`);

  req.end();
};

module.exports = {
  getLocationInfos,
};
