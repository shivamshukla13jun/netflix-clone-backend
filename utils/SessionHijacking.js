function generateRandomSessionId() {
  // Generate a random string of length 20
  const length = 20;
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let sessionId = '';
  for (let i = 0; i < length; i++) {
    sessionId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return sessionId;
}
const request = require('request');

async function testSessionHijackingVulnerability(url, sessionId) {
  // Send a request to the server with the session ID
  const cookieJar = request.jar();
  const cookie = request.cookie(`sessionId=${sessionId}`);
  cookieJar.setCookie(cookie, url);

  request({ url, jar: cookieJar }, (error, response, body) => {
    if (error) {
      console.error(error);
      return error.message;
    }

    // Check if the response contains the user's private data
    if (body.includes('privateData')) {
      return `Session hijacking vulnerability found: ${sessionId}`
      console.log(`Session hijacking vulnerability found: ${sessionId}`);
    } else {
      return `Session hijacking vulnerability not found: ${sessionId}`
      console.log(`Session hijacking vulnerability not found: ${sessionId}`);
    }
  });
}

module.exports={testSessionHijackingVulnerability,generateRandomSessionId}