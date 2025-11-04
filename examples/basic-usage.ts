/**
 * Basic usage examples for AnonDocs SDK
 */

import { AnonDocsClient } from '../src';

async function basicExamples() {
  // Initialize client
  const client = new AnonDocsClient({
    baseUrl: 'http://localhost:3000',
    defaultProvider: 'ollama'
  });

  // Check health
  const health = await client.health();
  console.log('API Status:', health.status);

  // Simple text anonymization
  const result = await client.anonymizeText(
    'My name is John Smith and my email is john@example.com',
    { provider: 'ollama' }
  );

  console.log('Anonymized:', result.anonymizedText);
  console.log('PII Detected:', result.piiDetected);
  console.log('Processing time:', result.processingTimeMs, 'ms');
}

// Error handling example
async function errorHandlingExample() {
  const client = new AnonDocsClient();

  try {
    await client.anonymizeText('Test text');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}

// Run examples
basicExamples().catch(console.error);

