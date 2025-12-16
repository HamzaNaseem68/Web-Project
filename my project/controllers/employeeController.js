const Employee = require('../models/Employee');

exports.getAllEmployees = (req, res) => {
    const employees = Employee.getAll();
    res.json(employees);
};

exports.addEmployee = (req, res) => {
    const { name, role, salary } = req.body;
    if (!name || !role || !salary) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const newEmployee = Employee.add({ name, role, salary });
    res.status(201).json(newEmployee);
};

exports.updateEmployee = (req, res) => {
    const { id } = req.params;
    const updatedEmployee = Employee.update(id, req.body);
    if (updatedEmployee) {
        res.json(updatedEmployee);
    } else {
        res.status(404).json({ error: "Employee not found" });
    }
};

exports.deleteEmployee = (req, res) => {
    const { id } = req.params;
    const success = Employee.delete(id);
    if (success) {
        res.json({ message: "Employee deleted successfully" });
    } else {
        res.status(404).json({ error: "Employee not found" });
    }
};
