const express = require('express');
const router = express.Router();

const data = {};
data.employees = require('../../data/employees.json');

router.route('/')
    .get((req, res) => {
        res.json(data.employees);
    })
    .post((req, res) => {
        const newEmployee = {
            id: data.employees.length + 1,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        };
        data.employees.push(newEmployee);
        res.json(data.employees);
    })
    .put((req, res) => {
        const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
        if (employee) {
            employee.firstname = req.body.firstname || employee.firstname;
            employee.lastname = req.body.lastname || employee.lastname;
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    })
    .delete((req, res) => {
        const index = data.employees.findIndex(emp => emp.id === parseInt(req.body.id));
        if (index !== -1) {
            const deletedEmployee = data.employees.splice(index, 1);
            res.json(deletedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    });

router.route('/:id')
    .get((req, res) => {
        const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    });

module.exports = router;