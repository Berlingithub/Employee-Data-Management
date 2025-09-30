import request from 'supertest';
import app from '../index.js';
import { initDatabase, closeDatabase } from '../database/init.js';

describe('Employee API Endpoints', () => {
  beforeEach(async () => {
    await initDatabase();
  });

  afterAll(() => {
    closeDatabase();
  });

  describe('POST /api/employees', () => {
    test('should create a new employee', async () => {
      const employeeData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        position: 'Software Engineer'
      };

      const response = await request(app)
        .post('/api/employees')
        .send(employeeData)
        .expect(201);

      expect(response.body).toMatchObject(employeeData);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('created_at');
    });

    test('should return validation error for missing fields', async () => {
      const response = await request(app)
        .post('/api/employees')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toContain('Name is required');
      expect(response.body.details).toContain('Email is required');
      expect(response.body.details).toContain('Position is required');
    });

    test('should return error for invalid email format', async () => {
      const employeeData = {
        name: 'John Doe',
        email: 'invalid-email',
        position: 'Software Engineer'
      };

      const response = await request(app)
        .post('/api/employees')
        .send(employeeData)
        .expect(400);

      expect(response.body.details).toContain('Invalid email format');
    });

    test('should return error for duplicate email', async () => {
      const employeeData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        position: 'Software Engineer'
      };

      // Create first employee
      await request(app)
        .post('/api/employees')
        .send(employeeData)
        .expect(201);

      // Try to create second employee with same email
      const response = await request(app)
        .post('/api/employees')
        .send({ ...employeeData, name: 'Jane Doe' })
        .expect(409);

      expect(response.body.error).toContain('already exists');
    });
  });

  describe('GET /api/employees', () => {
    test('should return all employees', async () => {
      // Create test employees
      const employees = [
        { name: 'John Doe', email: 'john@example.com', position: 'Engineer' },
        { name: 'Jane Smith', email: 'jane@example.com', position: 'Designer' }
      ];

      for (const emp of employees) {
        await request(app).post('/api/employees').send(emp);
      }

      const response = await request(app)
        .get('/api/employees')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('email');
      expect(response.body[0]).toHaveProperty('position');
    });

    test('should search employees by name', async () => {
      await request(app)
        .post('/api/employees')
        .send({ name: 'John Doe', email: 'john@example.com', position: 'Engineer' });

      await request(app)
        .post('/api/employees')
        .send({ name: 'Jane Smith', email: 'jane@example.com', position: 'Designer' });

      const response = await request(app)
        .get('/api/employees?search=John')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('John Doe');
    });
  });

  describe('GET /api/employees/:id', () => {
    test('should return employee by id', async () => {
      const createResponse = await request(app)
        .post('/api/employees')
        .send({ name: 'John Doe', email: 'john@example.com', position: 'Engineer' });

      const employeeId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/employees/${employeeId}`)
        .expect(200);

      expect(response.body.id).toBe(employeeId);
      expect(response.body.name).toBe('John Doe');
    });

    test('should return 404 for non-existent employee', async () => {
      const response = await request(app)
        .get('/api/employees/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('Employee not found');
    });
  });

  describe('PUT /api/employees/:id', () => {
    test('should update employee', async () => {
      const createResponse = await request(app)
        .post('/api/employees')
        .send({ name: 'John Doe', email: 'john@example.com', position: 'Engineer' });

      const employeeId = createResponse.body.id;
      const updateData = { name: 'John Smith', email: 'john@example.com', position: 'Senior Engineer' };

      const response = await request(app)
        .put(`/api/employees/${employeeId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe('John Smith');
      expect(response.body.position).toBe('Senior Engineer');
    });

    test('should return 404 for non-existent employee', async () => {
      const response = await request(app)
        .put('/api/employees/non-existent-id')
        .send({ name: 'John Doe', email: 'john@example.com', position: 'Engineer' })
        .expect(404);

      expect(response.body.error).toBe('Employee not found');
    });
  });

  describe('DELETE /api/employees/:id', () => {
    test('should delete employee', async () => {
      const createResponse = await request(app)
        .post('/api/employees')
        .send({ name: 'John Doe', email: 'john@example.com', position: 'Engineer' });

      const employeeId = createResponse.body.id;

      await request(app)
        .delete(`/api/employees/${employeeId}`)
        .expect(204);

      // Verify employee is deleted
      await request(app)
        .get(`/api/employees/${employeeId}`)
        .expect(404);
    });

    test('should return 404 for non-existent employee', async () => {
      const response = await request(app)
        .delete('/api/employees/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('Employee not found');
    });
  });
});