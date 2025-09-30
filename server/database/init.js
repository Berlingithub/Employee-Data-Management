import sqlite3 from 'sqlite3';
import { promisify } from 'util';

let db = null;

export const getDatabase = () => {
  if (!db) {
    const dbPath = process.env.NODE_ENV === 'test' ? ':memory:' : './server/database/employees.db';
    db = new sqlite3.Database(dbPath);
    
    // Promisify database methods
    db.runAsync = promisify(db.run).bind(db);
    db.getAsync = promisify(db.get).bind(db);
    db.allAsync = promisify(db.all).bind(db);
  }
  return db;
};

export const initDatabase = async () => {
  const database = getDatabase();
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      position TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    await database.runAsync(createTableQuery);
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

export const closeDatabase = () => {
  if (db) {
    db.close();
    db = null;
  }
};