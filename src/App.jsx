import React, { useState, useEffect } from 'react';
import { Search, Plus, Users } from 'lucide-react';
import EmployeeTable from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import Toast from './components/Toast';
import { employeeService } from './services/employeeService';

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

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
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

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Employee Manager</h1>
            </div>
            <button
              onClick={handleAddEmployee}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <EmployeeTable
            employees={employees}
            loading={loading}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
          />
        </div>
      </main>

      {/* Employee Modal */}
      {isModalOpen && (
        <EmployeeModal
          employee={editingEmployee}
          onSave={handleSaveEmployee}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;