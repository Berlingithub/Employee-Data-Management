import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/init.js';

export class Employee {
  constructor({ id, name, email, position, created_at, updated_at }) {
    this.id = id || uuidv4();
    this.name = name;
    this.email = email;
    this.position = position;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static validate(employeeData) {
    const errors = [];
    
    if (!employeeData.name || employeeData.name.trim().length === 0) {
      errors.push('Name is required');
    }
    
    if (!employeeData.email || employeeData.email.trim().length === 0) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(employeeData.email)) {
        errors.push('Invalid email format');
      }
    }
    
    if (!employeeData.position || employeeData.position.trim().length === 0) {
      errors.push('Position is required');
    }
    
    return errors;
  }

  static async findAll() {
    const db = getDatabase();
    const query = 'SELECT * FROM employees ORDER BY created_at DESC';
    return await db.allAsync(query);
  }

  static async findById(id) {
    const db = getDatabase();
    const query = 'SELECT * FROM employees WHERE id = ?';
    return await db.getAsync(query, [id]);
  }

  static async findByEmail(email) {
    const db = getDatabase();
    const query = 'SELECT * FROM employees WHERE email = ?';
    return await db.getAsync(query, [email]);
  }

  static async search(searchTerm) {
    const db = getDatabase();
    const query = `
      SELECT * FROM employees 
      WHERE name LIKE ? OR email LIKE ? OR position LIKE ?
      ORDER BY created_at DESC
    `;
    const term = `%${searchTerm}%`;
    return await db.allAsync(query, [term, term, term]);
  }

  async save() {
    const db = getDatabase();
    const now = new Date().toISOString();
    
    if (this.created_at) {
      // Update existing employee
      const query = `
        UPDATE employees 
        SET name = ?, email = ?, position = ?, updated_at = ?
        WHERE id = ?
      `;
      await db.runAsync(query, [this.name, this.email, this.position, now, this.id]);
    } else {
      // Create new employee
      const query = `
        INSERT INTO employees (id, name, email, position, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await db.runAsync(query, [this.id, this.name, this.email, this.position, now, now]);
    }
    
    return this;
  }
  static async deleteById(id) {
    const db = getDatabase();
    const query = 'DELETE FROM employees WHERE id = ?';
    try {
      const result = await db.runAsync(query, [id]);
      // SQLite's run() returns undefined in some versions, so we'll use a different approach
      // to verify deletion
      const checkQuery = 'SELECT COUNT(*) as count FROM employees WHERE id = ?';
      const checkResult = await db.getAsync(checkQuery, [id]);
      return checkResult.count === 0;
    } catch (error) {
      console.error('Error in deleteById:', error);
      return false;
    }
  }
}