const http = require('http');

// Get the port from the .env file or use a default
const port = process.env.PORT || 3000;

// Options for the HTTP request
const options = {
  hostname: 'localhost',
  port: port,
  path: '/api/health',
  method: 'GET'
};

console.log(`Testing health check endpoint at http://localhost:${port}/api/health`);

// Make the request
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  
  let data = '';
  
  // A chunk of data has been received
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  // The whole response has been received
  res.on('end', () => {
    console.log('RESPONSE:', data);
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.status === 'healthy') {
        console.log('✅ Health check endpoint is working correctly!');
      } else {
        console.log('❌ Health check endpoint returned unexpected data.');
      }
    } catch (e) {
      console.log('❌ Failed to parse response as JSON:', e.message);
    }
  });
});

// Handle errors
req.on('error', (e) => {
  console.error(`❌ Problem with request: ${e.message}`);
});

// End the request
req.end();