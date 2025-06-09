const { Pool } = require('pg');

let pool;

async function getPool() {
  if (!pool) {
    console.log('Creating new database pool...');
    console.log('Database URL exists:', !!process.env.NETLIFY_DATABASE_URL);
    
    if (!process.env.NETLIFY_DATABASE_URL) {
      throw new Error('Database URL not configured');
    }

    pool = new Pool({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

// Initialize database tables
async function initializeDatabase() {
  const pool = await getPool();
  try {
    console.log('Starting database initialization...');
    
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        week_id INTEGER NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, week_id)
      )
    `);

    // Check if teacher account exists, if not create it
    const teacherResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['TEACHER-2024']
    );

    if (teacherResult.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (name, email, role) VALUES ($1, $2, $3)',
        ['Teacher', 'TEACHER-2024', 'teacher']
      );
      console.log('Teacher account created');
    }

    console.log('Database initialization complete');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
}

// Initialize database on cold start
initializeDatabase().catch(console.error);

// Helper function to parse path and method from event
function parseRequest(event) {
  const path = event.path.replace('/.netlify/functions/api', '');
  const method = event.httpMethod;
  const body = JSON.parse(event.body || '{}');
  return { path, method, body };
}

// Main handler function
exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  let requestData;
  try {
    requestData = parseRequest(event);
  } catch (error) {
    console.error('Error parsing request:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid request format' })
    };
  }

  const { path, method, body } = requestData;

  try {
    const pool = await getPool();

    // Login endpoint
    if (path === '/login' && method === 'POST') {
      const { code } = body;
      console.log('Login attempt with code:', code);

      // Simple query to get user
      const userResult = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [code.toLowerCase()]
      );

      if (userResult.rows.length === 0) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid email or unregistered user' })
        };
      }

      const user = userResult.rows[0];
      let progress = [];

      // If student, get their progress
      if (user.role === 'student') {
        const progressResult = await pool.query(
          'SELECT data FROM progress WHERE user_id = $1 ORDER BY week_id',
          [user.id]
        );
        progress = progressResult.rows.map(row => row.data);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          isTeacher: user.role === 'teacher',
          name: user.name,
          email: user.email,
          progress
        })
      };
    }

    // Register student endpoint
    if (path === '/students' && method === 'POST') {
      const { name, email } = body;
      try {
        const result = await pool.query(
          'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *',
          [name, email.toLowerCase(), 'student']
        );
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(result.rows[0])
        };
      } catch (error) {
        if (error.code === '23505') { // Unique violation
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Email already registered' })
          };
        }
        throw error;
      }
    }

    // Get all students endpoint
    if (path === '/students' && method === 'GET') {
      const result = await pool.query(
        'SELECT name, email, created_at as "registeredAt" FROM users WHERE role = $1 ORDER BY created_at DESC',
        ['student']
      );
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.rows)
      };
    }

    // Update student progress endpoint
    if (path.match(/^\/students\/[^/]+\/progress$/) && method === 'PUT') {
      const email = path.split('/')[2];
      const { weekId, updatedWeek } = body;

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const userResult = await client.query(
          'SELECT id FROM users WHERE email = $1',
          [email.toLowerCase()]
        );

        if (userResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'User not found' })
          };
        }

        const userId = userResult.rows[0].id;

        await client.query(
          `INSERT INTO progress (user_id, week_id, data)
           VALUES ($1, $2, $3)
           ON CONFLICT (user_id, week_id)
           DO UPDATE SET data = $3`,
          [userId, weekId, updatedWeek]
        );

        const progressResult = await client.query(
          'SELECT data FROM progress WHERE user_id = $1 ORDER BY week_id',
          [userId]
        );

        await client.query('COMMIT');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(progressResult.rows.map(row => row.data))
        };
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }

    // Delete student endpoint
    if (path.match(/^\/students\/[^/]+$/) && method === 'DELETE') {
      const email = path.split('/')[2];
      const result = await pool.query(
        'DELETE FROM users WHERE email = $1 AND role = $2 RETURNING *',
        [email.toLowerCase(), 'student']
      );

      if (result.rowCount === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Student not found' })
        };
      }

      return {
        statusCode: 204,
        headers
      };
    }

    // Handle unknown endpoints
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };

  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      path,
      method
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Server error',
        details: error.message,
        code: error.code
      })
    };
  }
}; 