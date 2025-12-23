const data = {};
data.employees = require('../model/employees.json');

const getEmployees = (req, res) => {
    res.json(data.employees);
};

const createEmployee = (req, res) => {
    const newEmployee = {
        id: data.employees.length + 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };
    data.employees.push(newEmployee);
    res.json(data.employees);
};

const updateEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (employee) {
        employee.firstname = req.body.firstname || employee.firstname;
        employee.lastname = req.body.lastname || employee.lastname;
        res.json(employee);
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
};

const deleteEmployee = (req, res) => {
    const index = data.employees.findIndex(emp => emp.id === parseInt(req.body.id));
    if (index !== -1) {
        const deletedEmployee = data.employees.splice(index, 1);
        res.json(deletedEmployee);
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
};

const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    if (employee) {
        res.json(employee);
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
}

module.exports = { getEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployee };