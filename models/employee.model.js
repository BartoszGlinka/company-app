const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    idDepartment: { type: String, required: true, ref: 'Department' },
    salary: { type: Number, required: true }
});

mongoose.model('Employee', employeeSchema);

module.exports = mongoose.model('Employee', employeeSchema);