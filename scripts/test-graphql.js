#!/usr/bin/env node

// Simple script to test GraphQL connection
const { GraphQLClient } = require('graphql-request');

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

const client = new GraphQLClient(`${DIRECTUS_URL}/graphql`);

const GET_BLOG_POSTS = `
  query GetBlogPosts {
    blog(filter: { status: { _eq: "published" } }) {
      id
      title
      slug
      status
      published_date
      tags
    }
  }
`;

async function testGraphQL() {
  try {
    console.log('🔗 Testing Directus GraphQL connection...');
    console.log(`📍 URL: ${DIRECTUS_URL}/graphql`);
    
    const data = await client.request(GET_BLOG_POSTS);
    
    console.log('✅ GraphQL connection successful!');
    console.log(`📊 Found ${data.blog.length} published blog posts:`);
    
    data.blog.forEach(post => {
      console.log(`  - ${post.title} (${post.slug})`);
      console.log(`    Tags: ${JSON.parse(post.tags || '[]').join(', ')}`);
      console.log(`    Published: ${post.published_date}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ GraphQL connection failed:');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Response:', error.response.errors || error.response);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Directus is running on', DIRECTUS_URL);
    console.log('2. Check if GraphQL API is enabled in Directus');
    console.log('3. Verify your blog collection exists and has published posts');
    console.log('4. Check network connectivity');
  }
}

testGraphQL();