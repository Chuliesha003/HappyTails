// Quick test script for AI symptoms endpoint
const http = require('http');

const postData = JSON.stringify({
  symptoms: 'dog vomiting and not eating',
  petType: 'Dog',
  age: '4'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/ai/symptoms',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Making request to:', options.hostname + ':' + options.port + options.path);
console.log('Post data:', postData);

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('Response body length:', body.length);
    try {
      const data = JSON.parse(body);
      console.log('Response:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Raw response:', body);
      console.log('JSON parse error:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  console.error('Error code:', e.code);
  console.error('Error errno:', e.errno);
});

req.write(postData);
req.end();