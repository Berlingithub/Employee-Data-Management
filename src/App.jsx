import React, { useState, useEffect } from 'react';
import { Search, Plus, Users } from 'lucide-react';
import EmployeeTable from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import Toast from './components/Toast';
import { employeeService } from './services/employeeService';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async (search = '') => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployees(search);
      setEmployees(data);
    } catch (error) {
      showToast('Failed to load employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    loadEmployees(term);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      await employeeService.deleteEmployee(id);
      await loadEmployees(searchTerm);
      showToast('Employee deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete employee', 'error');
    }
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (editingEmployee) {
        await employeeService.updateEmployee(editingEmployee.id, employeeData);
        showToast('Employee updated successfully', 'success');
      } else {
        await employeeService.createEmployee(employeeData);
        showToast('Employee created successfully', 'success');
      }
      
      setIsModalOpen(false);
      await loadEmployees(searchTerm);
    } catch (error) {
      const message = error.message || 'Failed to save employee';
      showToast(message, 'error');
      throw error; // Re-throw to prevent modal from closing
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Employee Data Management System</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Add your main content here */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                setEditingEmployee(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Add Employee
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <EmployeeTable 
                employees={employees} 
                onEdit={handleEditEmployee} 
                onDelete={handleDeleteEmployee} 
              />
            </div>
          )}
        </div>
      </main>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={editingEmployee}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}

export default App;