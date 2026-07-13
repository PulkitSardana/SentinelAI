const autocannon = require('autocannon');

async function runBenchmark() {
  const url = 'http://localhost:4000/api/v1/transactions';
  console.log(`Starting benchmark against ${url}...`);

  const instance = autocannon({
    url,
    connections: 50, // 50 concurrent connections
    pipelining: 1,
    duration: 10, // 10 seconds
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Assuming idempotency key is randomized or omitted so it doesn't just hit cache
    },
    setupClient: (client) => {
      client.setBody(JSON.stringify({
        amount: Math.floor(Math.random() * 50000),
        currency: 'USD',
        merchant_id: '123e4567-e89b-12d3-a456-426614174000',
        account_id: '987fcdeb-51a2-43d7-9012-345678901234',
      }));
    }
  }, console.log);

  autocannon.track(instance, { renderProgressBar: true });

  instance.on('done', (result) => {
    console.log('\n--- Benchmark Results ---');
    console.log(`Requests/sec: ${result.requests.average}`);
    console.log(`Latency (p99): ${result.latency.p99} ms`);
    console.log(`Errors: ${result.errors}`);
    console.log(`2xx Responses: ${result['2xx']}`);
    console.log('-------------------------\n');
    console.log('If Requests/sec > 500 and Latency < 100ms, the architecture is highly performant and no premature optimization (like migrating to Kafka or gRPC) is required at this stage.');
  });
}

runBenchmark();
