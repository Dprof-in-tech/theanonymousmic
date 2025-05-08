# The Anonymous Mic

The Anonymous Mic is a platform that enables anonymous messaging to featured individuals. It allows admins to create posts with people's photos and names, then generate unique anonymous links that can be shared. Visitors can access these links to send completely anonymous messages, with no login or tracking required.

## Features

### Admin Panel
- Upload people's pictures and names (or nicknames)
- Generate unique anonymous links for each person's post
- View messages sent to each anonymous post

### Public/Anonymous Page
- Visitors can access a shared link at theanonymousmic.com
- They see the person's photo
- They can type and submit an anonymous message
- No login, no tracking—completely anonymous

### Database
- Store each person's post (name, picture, unique link)
- Store submitted anonymous messages and link them to the right post

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Vercel Postgres
- **Deployment**: Vercel

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/theanonymousmic.git
cd theanonymousmic
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file with the following variables:
```
POSTGRES_URL="your_postgres_connection_string"
POSTGRES_PRISMA_URL="your_postgres_prisma_connection_string"
POSTGRES_URL_NON_POOLING="your_postgres_non_pooling_connection_string"
POSTGRES_USER="postgres_user"
POSTGRES_HOST="postgres_host"
POSTGRES_PASSWORD="postgres_password"
POSTGRES_DATABASE="postgres_database"
```

4. Initialize the database
```bash
npm run setup-db
```

5. Start the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
theanonymousmic/
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── posts/
│   │   │   ├── messages/
│   │   │   └── events/
│   │   ├── admin/
│   │   ├── p/
│   │   ├── about/
│   │   ├── host/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/
│   └── types/
├── scripts/
│   └── setup-db.ts
```

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nickname VARCHAR(255),
  image_url VARCHAR(512) NOT NULL,
  unique_link VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date VARCHAR(255) NOT NULL,
  video_link VARCHAR(512),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Setting Up Vercel Postgres

1. Create a Vercel account if you don't have one
2. Create a new project and link it to your repository
3. Go to the Storage tab in your Vercel dashboard
4. Create a new Postgres database
5. Copy the environment variables to your `.env.local` file
6. Deploy your application on Vercel

## Deployment

This application is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up Vercel Postgres as described above
4. Deploy

## Security Considerations

- No user authentication is required for sending messages
- No IP addresses or any identifiable information is logged
- Admin panel should be secured with proper authentication in a production environment

## License

[MIT](LICENSE)
/
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── posts/
│   │   │   ├── messages/
│   │   │   └── events/
│   │   ├── admin/
│   │   ├── p/
│   │   ├── about/
│   │   ├── host/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/
│   └── types/
```

## Database Schema

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nickname VARCHAR(255),
  image_url VARCHAR(512) NOT NULL,
  unique_link VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  video_link VARCHAR(512),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment

This application is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up the required environment variables
4. Deploy

## Security Considerations

- No user authentication is required for sending messages
- No IP addresses or any identifiable information is logged
- Admin panel should be secured with proper authentication in a production environment

## License

[MIT](LICENSE)