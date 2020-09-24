const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

describe('Employee', () => {
    before(async () => {

        try {
          const fakeDB = new MongoMemoryServer();
      
          const uri = await fakeDB.getConnectionString();
      
          await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      
        } catch(err) {
          console.log(err);
        }
      
    });

    describe('Reading data', () => {

        before(async () => {
          const testEmpOne = new Employee({ firstName: 'Joe', lastName: 'Doe', idDepartment: 'IT', salary: 6500});
          await testEmpOne.save();

          const testDepOne = new Department({ name: 'Department #1' });
          await testDepOne.save();

          const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Nue', idDepartment: testDepOne, salary: 7500});
          await testEmpTwo.save();
        });

        it('should return all the data with "find" method', async () => {
            const employees = await Employee.find();
            const expectedLength = 2;
            expect(employees.length).to.be.equal(expectedLength);
        });

        it('should return proper document by various params with "findOne" method', async () => {
            const employee = await Employee.findOne({ firstName: 'Joe', lastName: 'Doe', idDepartment: 'IT', salary: 6500 });
            const expectedEmployeeName = 'Joe';
            expect(employee.firstName).to.be.equal(expectedEmployeeName);
        });

        
        /*it('should return proper document with ref object by various params with "findOne" method', async () => {
            const idDepartment = await Department.findOne({ name: 'Department #1' });
            const employee = await Employee.find({ firstName: 'Amanda', lastName: 'Nue', idDepartment: idDepartment , salary: 7500 }).populate('Department');
            const expectedEmployeeName = 'Amanda';
            expect(employee.firstName).to.be.equal(expectedEmployeeName);
        });*/

        after(async () => {
            await Employee.deleteMany();
            await Department.deleteMany();
        });
    });

    describe('Creating data', () => {

        it('should insert new document with "insertOne" method', async () => {
            const employee = new Employee({ firstName: 'Joe', lastName: 'Doe', idDepartment: 'IT', salary: 6500 });
            await employee.save();
            expect(employee.isNew).to.be.false;
        });

        after(async () => {
            await Employee.deleteMany();
        });  
    });

    describe('Updating data', () => {

        beforeEach(async () => {
            const testEmpOne = new Employee({ firstName: 'Joe', lastName: 'Doe', idDepartment: 'IT', salary: 6500});
            await testEmpOne.save();
          
            const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Nue', idDepartment: 'Marketing', salary: 7500});
            await testEmpTwo.save();
        });

        it('should properly update one document with "updateOne" method', async () => {
            await Employee.updateOne({ firstName: 'Joe' }, { $set: { firstName: 'Henry' }});
            const updatedEmployee = await Employee.findOne({ firstName: 'Henry' });
            expect(updatedEmployee).to.not.be.null;
        });
      
        it('should properly update one document with "save" method,', async () => {
            const employee = await Employee.findOne({ firstName: 'Joe' });
            employee.firstName = 'Henry';
            await employee.save();
          
            const updatedEmployee = await Employee.findOne({ firstName: 'Henry' });
            expect(updatedEmployee).to.not.be.null;
        });
        
        it('should properly update multiple documents with "updateMany" method', async () => {
            await Employee.updateMany({}, { $set: { firstName: 'Updated!' }});
            const employees = await Employee.find();
            expect(employees[0].firstName).to.be.equal('Updated!');
            expect(employees[1].firstName).to.be.equal('Updated!');
        });

        afterEach(async () => {
            await Employee.deleteMany();
        });
    });

    describe('Removing data', () => {
        beforeEach(async () => {
            const testEmpOne = new Employee({ firstName: 'Joe', lastName: 'Doe', idDepartment: 'IT', salary: 6500});
            await testEmpOne.save();
          
            const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Nue', idDepartment: 'Marketing', salary: 7500});
            await testEmpTwo.save();
         });

        it('should properly remove one document with "deleteOne" method', async () => {
            await Employee.deleteOne({ firstName: 'Joe', lastName: 'Doe', idDepartment: 'IT', salary: 6500 });
            const removeEmployee = await Employee.findOne({ firstName: 'Joe', lastName: 'Doe', idDepartment: 'IT', salary: 6500 });
            expect(removeEmployee).to.be.null;
        });
    
        it('should properly remove one document with "remove" method', async () => {
            const employee = await Employee.findOne({ firstName: 'Amanda', lastName: 'Nue', idDepartment: 'Marketing', salary: 7500 });
            await employee.remove();
            const removedEmployee = await Employee.findOne({ firstName: 'Amanda', lastName: 'Nue', idDepartment: 'Marketing', salary: 7500 });
            expect(removedEmployee).to.be.null;
        });
      
        it('should properly remove multiple documents with "deleteMany" method', async () => {
            await Employee.deleteMany();
            const employees = await Employee.find();
            expect(employees.length).to.be.equal(0);
        });

        afterEach(async () => {
            await Employee.deleteMany();
        });
      
    });
      
});