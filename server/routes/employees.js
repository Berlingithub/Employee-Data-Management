import express from 'express';
import { Employee } from '../models/Employee.js';

const router = express.Router();

// GET /api/employees - Get all employees or search
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let employees;
    
    if (search) {
      employees = await Employee.search(search);
    } else {
      employees = await Employee.findAll();
    }
    
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// GET /api/employees/:id - Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// POST /api/employees - Create new employee
router.post('/', async (req, res) => {
  try {
    const { name, email, position } = req.body;
    
    // Validate input
    const errors = Employee.validate({ name, email, position });
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    // Check if email already exists
    const existingEmployee = await Employee.findByEmail(email);
    if (existingEmployee) {
      return res.status(409).json({ error: 'Employee with this email already exists' });
    }
    
    // Create and save employee
    const employee = new Employee({ name, email, position });
    await employee.save();
    
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', async (req, res) => {
  try {
    const { name, email, position } = req.body;
    const { id } = req.params;
    
    // Validate input
    const errors = Employee.validate({ name, email, position });
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    // Check if employee exists
    const existingEmployee = await Employee.findById(id);
    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Check if email is taken by another employee
    const emailCheck = await Employee.findByEmail(email);
    if (emailCheck && emailCheck.id !== id) {
      return res.status(409).json({ error: 'Email is already taken by another employee' });
    }
    
    // Update employee
    const employee = new Employee({ 
      id, 
      name, 
      email, 
      position,
      created_at: existingEmployee.created_at
    });
    await employee.save();
    
    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if employee exists
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Try to delete the employee
    const deleted = await Employee.deleteById(id);
    
    if (!deleted) {
      console.error('Failed to delete employee with ID:', id);
      return res.status(500).json({ error: 'Failed to delete employee' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/employees/:id:', error);
    res.status(500).json({ 
      error: 'Failed to delete employee',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;