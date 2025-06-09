# Algebra 2 Tutoring Backend

## Database Setup

### Local Development
By default, the application uses a local MongoDB instance. Make sure you have MongoDB installed locally.

1. Install MongoDB Community Edition:
   - Mac: `brew install mongodb-community`
   - Windows: Download from MongoDB website
   - Linux: Follow MongoDB installation guide for your distribution

2. Start MongoDB locally:
   - Mac: `brew services start mongodb-community`
   - Windows: MongoDB runs as a service
   - Linux: `sudo systemctl start mongod`

### Production Setup (Recommended)

For production use, we recommend using MongoDB Atlas:

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier is fine)
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Create a database user
6. Add your IP address to the whitelist
7. Copy the connection string

Create a `.env` file in the backend directory with:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/algebra2tutoring
PORT=5000
TEACHER_ACCESS_CODE=TEACHER-2024
NODE_ENV=production
```

Replace `<username>`, `<password>`, and the rest of the URI with your MongoDB Atlas connection string.

## Starting the Server

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Database Structure

The database stores:
- Student information (name, email)
- Progress tracking for each student
- Weekly curriculum completion status

Data is automatically persisted to MongoDB and can be accessed from any device. 