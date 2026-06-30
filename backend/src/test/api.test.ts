import http from 'http';

const MOCK_TOKEN = 'mock-bearer-token-roll-2303051050480-secret-dkvATBGvtUZcgFRc';

/**
 * Helper function to send HTTP requests to localhost:3000
 */
const makeRequest = (
  method: string,
  path: string,
  headers: Record<string, string> = {}
): Promise<{ status: number; body: string }> => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: headers
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode || 0, body });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });
    req.end();
  });
};

/**
 * Main Test runner function
 */
async function runTests() {
  console.log("==========================================");
  console.log("   RUNNING BACKEND API INTEGRATION TESTS  ");
  console.log("==========================================\n");
  
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`[\u001b[32mPASS\u001b[0m] ${message}`);
      passed++;
    } else {
      console.log(`[\u001b[31mFAIL\u001b[0m] ${message}`);
      failed++;
    }
  };

  try {
    // 1. GET /health (Health Check)
    const res1 = await makeRequest('GET', '/health');
    assert(res1.status === 200, 'GET /health returns 200 OK status');
    const body1 = JSON.parse(res1.body);
    assert(body1.status === 'UP', 'GET /health body contains status "UP"');

    // 2. GET /api/v1/notifications without Auth Header
    const res2 = await makeRequest('GET', '/api/v1/notifications');
    assert(res2.status === 401, 'GET /api/v1/notifications without token returns 401 Unauthorized');

    // 3. GET /api/v1/notifications with Invalid Bearer Token
    const res3 = await makeRequest('GET', '/api/v1/notifications', {
      'Authorization': 'Bearer invalid_secret_token_12345'
    });
    assert(res3.status === 403, 'GET /api/v1/notifications with bad token returns 403 Forbidden');

    // 4. GET /api/v1/notifications with Valid Bearer Token (Priority Sort check)
    const res4 = await makeRequest('GET', '/api/v1/notifications', {
      'Authorization': `Bearer ${MOCK_TOKEN}`
    });
    assert(res4.status === 200, 'GET /api/v1/notifications with valid Bearer token returns 200 OK');
    
    const body4 = JSON.parse(res4.body);
    assert(Array.isArray(body4.notifications), 'Response body contains a notifications array');
    
    // Sort logic validation
    let foundRead = false;
    let priorityOk = true;
    for (const item of body4.notifications) {
      if (item.is_read) {
        foundRead = true;
      } else if (foundRead) {
        // Found an unread notification after a read notification, which violates priority order!
        priorityOk = false;
      }
    }
    assert(priorityOk, 'Notifications sort constraint: Unread notifications are positioned before Read notifications');

    // 5. GET /api/v1/notifications/unread-count
    const res5 = await makeRequest('GET', '/api/v1/notifications/unread-count', {
      'Authorization': `Bearer ${MOCK_TOKEN}`
    });
    assert(res5.status === 200, 'GET /api/v1/notifications/unread-count returns 200 OK status');
    const body5 = JSON.parse(res5.body);
    assert(typeof body5.unread_count === 'number', 'Response body contains integer unread_count field');

    console.log("\n==========================================");
    console.log(`   INTEGRATION SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
    console.log("==========================================");

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error: any) {
    console.error("Test execution interrupted with error:", error.message);
    process.exit(1);
  }
}

// Execute suite
runTests();
