#!/usr/bin/env node

const { GraphQLClient } = require('graphql-request');

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

async function testSimpleGraphQL() {
  try {
    console.log('🔗 Testing basic GraphQL connection...');
    
    const client = new GraphQLClient(`${DIRECTUS_URL}/graphql`);
    
    // Test with introspection query to see available types
    const introspectionQuery = `
      query {
        __schema {
          types {
            name
            kind
          }
        }
      }
    `;
    
    console.log('📡 Running introspection query...');
    const data = await client.request(introspectionQuery);
    
    console.log('✅ GraphQL introspection successful!');
    
    // Look for blog-related types
    const blogTypes = data.__schema.types.filter(type => 
      type.name.toLowerCase().includes('blog')
    );
    
    console.log('📋 Blog-related GraphQL types found:');
    blogTypes.forEach(type => {
      console.log(`  - ${type.name} (${type.kind})`);
    });
    
    // Try a simple query to list collections
    console.log('\n📊 Testing collections query...');
    
    const collectionsQuery = `
      query {
        __type(name: "Query") {
          fields {
            name
            type {
              name
            }
          }
        }
      }
    `;
    
    const collectionsData = await client.request(collectionsQuery);
    const blogFields = collectionsData.__type.fields.filter(field => 
      field.name.includes('blog')
    );
    
    console.log('🗂️ Available blog queries:');
    blogFields.forEach(field => {
      console.log(`  - ${field.name}`);
    });
    
  } catch (error) {
    console.error('❌ GraphQL test failed:');
    console.error('Error:', error.message);
    
    if (error.response?.errors) {
      console.error('GraphQL Errors:', error.response.errors);
    }
  }
}

testSimpleGraphQL();