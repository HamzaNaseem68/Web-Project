// In-memory data store to replace database for this lab task
let employees = [
  { id: 1, name: "Ali Khan", role: "Guard", salary: 500 },
  { id: 2, name: "Sara Ahmed", role: "Trainer", salary: 700 },
];

class Employee {
  static getAll() {
    return employees;
  }

  static add(data) {
    const newEmployee = {
      id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
      ...data
    };
    employees.push(newEmployee);
    return newEmployee;
  }

  static update(id, data) {
    const index = employees.findIndex(e => e.id == id);
    if (index !== -1) {
      employees[index] = { ...employees[index], ...data };
      return employees[index];
    }
    return null;
  }

  static delete(id) {
    const initialLength = employees.length;
    employees = employees.filter(e => e.id != id);
    return employees.length !== initialLength;
  }
}

module.exports = Employee;
