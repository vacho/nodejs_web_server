const data = {
    employees: require('../model/employees.json'),
    setEmployees: function (data) { this.employees = data; }
};

const getEmployees = (req, res) => {
    res.json(data.employees);
};

const createEmployee = (req, res) => {
    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };
    if (!newEmployee.firstname || !newEmployee.lastname) {
        res.status(404).json({ message: 'Firstname and Lastname are required' });
    }
    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (employee) {
        employee.firstname = req.body.firstname ? req.body.firstname : employee.firstname;
        employee.lastname = req.body.lastname ? req.body.lastname : employee.lastname;
        const filtered = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
        const unsorted = [...filtered, employee];
        data.setEmployees(unsorted.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
        res.json(data.employees);
    } else {
        res.status(400).json({ message: `Employee ${req.body.id} not found`});
    }
};

const deleteEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (employee) {
        const filtered = data.employees.filter(emp => emp.id === parseInt(req.body.id));
        data.setEmployees([...filtered]);
        res.json(data.employees);
    } else {
        res.status(400).json({ message: `Employee ${req.body.id} not found`});
    }
};

const getEmployee = (req, res) => {
    res.json(data.employees);
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    if (employee) {
        res.json(employee);
    } else {
        res.status(404).json({ message: `Employee ${req.params.id} not found` });
    }
}

module.exports = { getEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployee };