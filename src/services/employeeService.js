const API_BASE_URL = '/api';

class EmployeeService {
  async getEmployees(search = '') {
    const url = search ? `${API_BASE_URL}/employees?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/employees`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    
    return response.json();
  }

  async getEmployee(id) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch employee');
    }
    
    return response.json();
  }

  async createEmployee(employeeData) {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create employee');
    }
    
    return response.json();
  }

  async updateEmployee(id, employeeData) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update employee');
    }
    
    return response.json();
  }

  async deleteEmployee(id) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete employee');
    }
    
    return true;
  }
}

export const employeeService = new EmployeeService();