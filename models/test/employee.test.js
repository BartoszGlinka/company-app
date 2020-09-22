const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

    it('should throw an error if no "firstName, lastName, idDepartment, salary" args', () => {
      const dep = new Employee({}); // create new Department, but don't set `name` attr value
    
      dep.validate(err => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.exist;
        expect(err.errors.idDepartment).to.exist;
        expect(err.errors.salary).to.exist;
      });
    });

    it('should throw an error if "firstName, lastName, idDepartment, salary" dont have the correct types', () => {

        const cases = [{}, []];
        for(let type of cases) {
          const dep = new Employee({ firstName: type, lastName: type, idDepartment: type, salary: type  });
      
          dep.validate(err => {
            expect(err.errors.firstName).to.exist;
            expect(err.errors.lastName).to.exist;
            expect(err.errors.idDepartment).to.exist;
            expect(err.errors.salary).to.exist;
          });
      
        }
      
    });

    it('should throw no error if "firstName, lastName, idDepartment, salary" have the correct types', () => {
        const casesStr = ['John ', 'Test'];
        const casesNumb = 5000;
        for(let typeStr of casesStr) {
            const dep = new Employee({ firstName: typeStr, lastName: typeStr, idDepartment: typeStr, salary : casesNumb});

          dep.validate(err => {
            expect(err).to.not.exist;
          });
        }
    });
    
    after(() => {
      mongoose.models = {}
    });
  });