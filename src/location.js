const https = require('https');

const options = {
  hostname: 'iplocation.com',
  port: 443,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

const getLocationInfos = (clientIP, cb) => {
  // let city;
  // let postalCode;
  // let region;
  // let country;
  // let company;

  const req = https.request(options, (res) => {
    res.on('data', (locationDataRaw) => {
      const locationData = JSON.parse(locationDataRaw.toString());
      console.log('Location data:');
      console.log(locationData);

      // console.log(`Cidade: ${city}`);
      // console.log(`Código Postal (da cidade): ${postalCode}`);
      // console.log(`Região e nome da região: ${region}`);
      // console.log(`Nome do país: ${country}`);
      // console.log(`Companhia (nome da provedora de internet): ${company}`);


      city = locationData.city;
      postalCode = locationData.postal_code;
      region = locationData.region;
      country = locationData.country_name;
      company = locationData.company;

      cb(locationData);
    });
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
