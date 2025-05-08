import { sql } from '@vercel/postgres';

// Helper functions for posts
export async function createPost(postData: {
  name: string;
  nickname?: string;
  imageUrl: string;
  uniqueLink: string;
}) {
  try {
    const { name, nickname, imageUrl, uniqueLink } = postData;
    
    const result = await sql`
      INSERT INTO posts (name, nickname, image_url, unique_link)
      VALUES (${name}, ${nickname || null}, ${imageUrl}, ${uniqueLink})
      RETURNING id, name, nickname, image_url as "imageUrl", unique_link as "uniqueLink", created_at as "createdAt";
    `;
    
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to create post');
  }
}

export async function getPostByUniqueLink(uniqueLink: string) {
  try {
    const result = await sql`
      SELECT id, name, nickname, image_url as "imageUrl", unique_link as "uniqueLink", created_at as "createdAt"
      FROM posts
      WHERE unique_link = ${uniqueLink};
    `;
    
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to get post by unique link');
  }
}

export async function getPostById(id: number) {
  try {
    const result = await sql`
      SELECT id, name, nickname, image_url as "imageUrl", unique_link as "uniqueLink", created_at as "createdAt"
      FROM posts
      WHERE id = ${id};
    `;
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to get post by ID');
  }
}

export async function getAllPosts() {
  try {
    const result = await sql`
      SELECT id, name, nickname, image_url as "imageUrl", unique_link as "uniqueLink", created_at as "createdAt"
      FROM posts
      ORDER BY created_at DESC;
    `;
    
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to get all posts');
  }
}

// Helper functions for messages
export async function createMessage(messageData: {
  postId: number;
  content: string;
}) {
  try {
    const { postId, content } = messageData;
    
    const result = await sql`
      INSERT INTO messages (post_id, content)
      VALUES (${postId}, ${content})
      RETURNING id, post_id as "postId", content, created_at as "createdAt";
    `;
    
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to create message');
  }
}

export async function getMessagesByPostId(postId: number) {
  try {
    const result = await sql`
      SELECT id, post_id as "postId", content, created_at as "createdAt"
      FROM messages
      WHERE post_id = ${postId}
      ORDER BY created_at DESC;
    `;
    
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to get messages by post ID');
  }
}

// Helper functions for events
export async function createEvent(eventData: {
  title: string;
  description?: string;
  date: string;
  imageUrl: string;
  hostName: string;
  videoLink?: string;
}) {
  try {
    const { title, description, date, imageUrl, hostName, videoLink } = eventData;
    
    const result = await sql`
      INSERT INTO events (title, description, date, image_url, host_name, video_link)
      VALUES (${title}, ${description || null}, ${date}, ${imageUrl}, ${hostName}, ${videoLink || null})
      RETURNING id, title, description, date, image_url as "imageUrl", host_name as "hostName", video_link as "videoLink", created_at as "createdAt";
    `;
    
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to create event');
  }
}

export async function getAllEvents() {
  try {
    const result = await sql`
      SELECT id, title, description, date, image_url as "imageUrl", host_name as "hostName", video_link as "videoLink", created_at as "createdAt"
      FROM events
      ORDER BY date DESC;
    `;
    
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to get all events');
  }
}

export async function getEventById(id: number) {
  try {
    const result = await sql`
      SELECT id, title, description, date, image_url as "imageUrl", host_name as "hostName", video_link as "videoLink", created_at as "createdAt"
      FROM events
      WHERE id = ${id};
    `;
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to get event by ID');
  }
}

// Database schema initialization function
export async function initializeDatabase() {
  try {
    // Create posts table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        nickname VARCHAR(255),
        image_url VARCHAR(512) NOT NULL,
        unique_link VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Create messages table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Create events table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date VARCHAR(255) NOT NULL,
        video_link VARCHAR(512),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}