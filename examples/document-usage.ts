/**
 * Document anonymization examples for AnonDocs SDK
 */

import { AnonDocsClient } from '../src';
import { readFileSync } from 'fs';

async function documentExample() {
  const client = new AnonDocsClient({
    baseUrl: 'http://localhost:3000',
    defaultProvider: 'ollama'
  });

  // Node.js: Read file as Buffer
  const fileBuffer = readFileSync('./sample-document.txt');

  // Anonymize document
  const result = await client.anonymizeDocument(fileBuffer, {
    provider: 'ollama'
  });

  console.log('Document anonymized successfully');
  console.log('Anonymized text:', result.anonymizedText);
  console.log('PII found:', result.piiDetected);
}

// Streaming document example
async function streamingDocumentExample() {
  const client = new AnonDocsClient({
    baseUrl: 'http://localhost:3000',
    defaultProvider: 'ollama'
  });

  const fileBuffer = readFileSync('./sample-document.pdf');

  await client.streamAnonymizeDocument(fileBuffer, {
    provider: 'ollama',
    onProgress: (event) => {
      console.log(`Progress: ${event.progress}% - ${event.message}`);
    },
    onComplete: (result) => {
      console.log('Document processing complete');
      console.log('Processing time:', result.processingTimeMs, 'ms');
    },
    onError: (error) => {
      console.error('Error:', error.message);
    }
  });
}

// Browser: Using File from input
function browserExample() {
  const client = new AnonDocsClient({
    baseUrl: 'http://localhost:3000'
  });

  // Get file from input element
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  const file = fileInput?.files?.[0];

  if (file) {
    client.streamAnonymizeDocument(file, {
      provider: 'ollama',
      onProgress: (event) => {
        console.log(`${event.progress}%`);
      },
      onComplete: (result) => {
        console.log('Done!', result);
      }
    });
  }
}

documentExample().catch(console.error);

