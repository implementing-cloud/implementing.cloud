#!/usr/bin/env node

const { GraphQLClient } = require('graphql-request');

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

async function checkDirectusCollections() {
  try {
    console.log('🔍 Checking Directus collections and GraphQL schema...');
    
    const client = new GraphQLClient(`${DIRECTUS_URL}/graphql`);
    
    // Get all available query fields
    const schemaQuery = `
      query {
        __schema {
          queryType {
            fields {
              name
              description
              type {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
        }
      }
    `;
    
    const data = await client.request(schemaQuery);
    
    console.log('📋 Available GraphQL queries:');
    
    const fields = data.__schema.queryType.fields;
    
    // Group by type
    const collections = [];
    const systemQueries = [];
    
    fields.forEach(field => {
      if (field.name.startsWith('__') || field.name.includes('schema')) {
        systemQueries.push(field.name);
      } else {
        collections.push({
          name: field.name,
          type: field.type.name || field.type.ofType?.name,
          kind: field.type.kind
        });
      }
    });
    
    console.log('\\n🗂️ Collection queries:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name} -> ${collection.type} (${collection.kind})`);
    });
    
    console.log(`\\n⚙️ System queries: ${systemQueries.length} found`);
    
    // Now try to query each collection to see which ones work
    console.log('\\n🧪 Testing collection queries...');
    
    for (const collection of collections.slice(0, 5)) { // Test first 5
      try {
        const testQuery = `
          query {
            ${collection.name} {
              __typename
            }
          }
        `;
        
        await client.request(testQuery);
        console.log(`  ✅ ${collection.name} - accessible`);
      } catch (error) {
        console.log(`  ❌ ${collection.name} - ${error.message.split('\\n')[0]}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to check Directus collections:');
    console.error('Error:', error.message);
    
    if (error.response?.errors) {
      console.error('GraphQL Errors:', error.response.errors);
    }
  }
}

checkDirectusCollections();