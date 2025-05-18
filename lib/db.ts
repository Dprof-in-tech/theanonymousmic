/* eslint-disable @typescript-eslint/no-unused-vars */
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

// Helper functions for admin authentication
export async function createAdmin(adminData: {
  username: string;
  email: string;
  password: string;
}) {
  try {
    const { username, email, password } = adminData;
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const result = await sql`
      INSERT INTO admins (username, email, password)
      VALUES (${username}, ${email}, ${hashedPassword})
      RETURNING id, username, email, created_at as "createdAt";
    `;
    
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to create admin account');
  }
}

export async function getAdminByEmail(email: string) {
  try {
    const result = await sql`
      SELECT id, username, email, password, created_at as "createdAt"
      FROM admins
      WHERE email = ${email};
    `;
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to get admin by email');
  }
}

// Add this function to your db.ts file
export async function resetAdminPassword(email: string, newPassword: string) {
  try {
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the admin's password
    const result = await sql`
      UPDATE admins
      SET password = ${hashedPassword}
      WHERE email = ${email}
      RETURNING id, username, email;
    `;
    
    if (result.rows.length === 0) {
      throw new Error('Admin not found');
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Password reset error:', error);
    throw new Error('Failed to reset admin password');
  }
}

export async function verifyAdminCredentials(email: string, password: string) {
  try {
    // Get the admin record
    const admin = await getAdminByEmail(email);
    
    // If no admin found with that email, return null
    if (!admin) {
      return null;
    }
    
    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    // If password is invalid, return null
    if (!isPasswordValid) {
      return null;
    }
    
    // Return admin without the password
    const { password: _, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Failed to verify admin credentials');
  }
}

export async function generateAuthToken(admin: { id: number, username: string, email: string }) {
  try {
    // Get JWT secret from environment variables
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    
    // Generate the token
    const token = jwt.sign(
      { 
        userId: admin.id,
        username: admin.username,
        email: admin.email,
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate authentication token');
  }
}

export async function verifyAuthToken(token: string) {
  try {
    // Get JWT secret from environment variables
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
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
    
    // Create admins table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Check if an admin account already exists
    const adminCheck = await sql`SELECT COUNT(*) FROM admins`;
    const adminCount = parseInt(adminCheck.rows[0].count);
    
    // Create a default admin account if none exists
    if (adminCount === 0) {
      // Generate a secure password hash
      const defaultPassword = 'Admin@123'; // You should change this in production
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);
      
      // Insert the default admin
      await sql`
        INSERT INTO admins (username, email, password)
        VALUES ('anonymousMic', 'admin@example.com', ${hashedPassword})
      `;
      
      console.log('Default admin account created');
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}