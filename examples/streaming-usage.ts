/**
 * Streaming usage examples for AnonDocs SDK
 */

import { AnonDocsClient } from '../src';

async function streamingExample() {
  const client = new AnonDocsClient({
    baseUrl: 'http://localhost:3000',
    defaultProvider: 'ollama'
  });

  const longText = `
    This is a long document containing sensitive information.
    John Smith works at Acme Corp and lives at 123 Main Street, Springfield.
    His email is john.smith@example.com and phone is 555-0123.
    He was born on January 15, 1980.
  `;

  await client.streamAnonymizeText(longText, {
    provider: 'ollama',
    onProgress: (event) => {
      console.log(`[${event.type}] ${event.progress}% - ${event.message}`);
      
      if (event.currentChunk && event.totalChunks) {
        console.log(`  Chunk ${event.currentChunk}/${event.totalChunks}`);
      }
    },
    onComplete: (result) => {
      console.log('\n=== Anonymization Complete ===');
      console.log('Anonymized text:', result.anonymizedText);
      console.log('Words per minute:', result.wordsPerMinute);
      console.log('Chunks processed:', result.chunksProcessed);
    },
    onError: (error) => {
      console.error('Stream error:', error.message);
    }
  });
}

streamingExample().catch(console.error);

