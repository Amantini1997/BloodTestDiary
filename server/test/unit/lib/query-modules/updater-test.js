const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
const rewire = require("rewire");
chai.use(sinonChai);
const updater = rewire("../../../../lib/query-modules/updater.js");
const testUsername = "admin";

//Tests for query controller do NOT depend on action-actionLogger
//We can safely assume the function do not disturb execution of the program
const actionLogger = {
  logInsert:function() {
    return 4;
  },
  logUpdate:function() {
    return 3;
  },
  logDelete:function() {
    return 2;
  },
  logOther:function() {
    return 1;
  }
};
updater.__set__("actionLogger",actionLogger);

describe("Update queries tests", function(){
    context("Change test status", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(updater.changeTestStatus);
      })
      it("Reject random update (STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{ token:"30000" }}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400"}]}}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"ERROR"}, testUsername);
        response.success.should.equal(false);
        response.response.should.equal("NO SUCH UPDATE");
        spy.calledOnce.should.equal(true);
      })
      it("Accept completed update (STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", completed_status:"yes"}]}}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"completed"}, testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
        spy.calledOnce.should.equal(true);
      })
      it("Reject completed update (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "ERR", err: { type: "Invalid request.", cause: "stubbed error" }}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"completed"}, testUsername);
        response.success.should.equal(false);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Accept late update (STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", completed_date:"2020-10-30", completed_status:"no", occurrences:"3", frequency:"2-W"}]}}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"late"}, testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
        spy.calledOnce.should.equal(true);
      })
      it("Reject late update (STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "ERR", err: { type: "Invalid request.", cause: "stubbed error" }}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", completed_date:"2020-10-30", completed_status:"no", occurrences:"3", frequency:"2-W"}]}}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"late"}, testUsername);
        response.success.should.equal(false);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Accept in review update (STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", completed_date:"2020-10-30", completed_status:"no", occurrences:"3", frequency:"2-W"}]}}
          },
          insertQuery: async function()
          {
            return {status: "OK", response: {insertId:"505"}}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"inReview"}, testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
        spy.calledOnce.should.equal(true);
      })
      it("Reject in review update (STUBBED)", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "ERR", err: { type: "Invalid request.", cause: "stubbed error" }}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{patient_no:"400", completed_date:"2020-10-30", completed_status:"no", occurrences:"3", frequency:"2-W"}]}}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy({testId:"2000",newStatus:"inReview"}, testUsername);
        response.success.should.equal(false);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
    })
    context("Update User", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(updater.editUser);
      })
      it("Correctly update password (STUBBED)", async function()
      {
        const dbController = {
          selectQuery: async function() {
            return {status:"OK", response:{ rows:[{username:testUsername,iterations:1000,salt:"30000",recovery_email:"yahoo@gmail.com"}]}}
          },
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy({username:testUsername,hashed_password:"373723172173732"}, testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Correctly update email (STUBBED)", async function()
      {
        const dbController = {
          selectQuery: async function() {
            return {status:"OK", response:{ rows:[{username:testUsername,iterations:1000,salt:"30000",recovery_email:"yahoo@gmail.com"}]}}
          },
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy({username:testUsername,recovery_email:"gmail@gmail.com"}, testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Correctly update email and password (STUBBED)", async function()
      {
        const dbController = {
          selectQuery: async function() {
            return {status:"OK", response:{ rows:[{username:testUsername,iterations:1000,salt:"30000",recovery_email:"yahoo@gmail.com"}]}}
          },
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy({username:testUsername,recovery_email:"gmail@gmail.com",hashed_password:"dsjhdshdshjdshdhjdschjdsjsdhj"}, testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Fail due to update query error (STUBBED)", async function() {
        const dbController = {
          selectQuery: async function() {
            return {status:"OK", response:{ rows:[{username:testUsername,iterations:1000,salt:"30000"}]}}
          },
          requestEditing: async function() {
            return {status: "OK", response:{token:"2000"}}
          },
          updateQuery: async function() {
            return {status: "ERR", err:"Error here"}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy({username:testUsername,hashed_password:"373723172173732"}, testUsername);
        response.success.should.equal(false);
        response.response.should.equal("Error here");
      })
    })
    context("Edit Patient", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(updater.editPatient);
      })
      it("Accept patient edit (STUBBED)", async function(){
        setAcceptUpdateQueryDatabase();
        const response = await spy({patient_no:"400",patient_name:"Mark"},"400", testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject patient edit (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({patient_no:"400",patient_name:"Mark"},"400", testUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Reject patient edit - No token passed (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({patient_no:"400",patient_name:"Mark"}, undefined, testUsername);
        response.response.problem.should.equal("Token in use/No token defined");
        spy.calledOnce.should.equal(true);
      })
    })
    context("Edit Carer", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(updater.editCarer);
      })
      it("Accept patient edit (STUBBED)", async function(){
        setAcceptUpdateQueryDatabase();
        const response = await spy({carer_id:"400",carer_email:"Mark@gmail.com"},"400", testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject patient edit (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({carer_id:"400",carer_email:"Mark@gmail.com"},"400", testUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Reject patient edit - No token passed (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({carer_id:"400",carer_email:"Mark@gmail.com"}, undefined, testUsername);
        response.response.problem.should.equal("Token in use/No token defined");
        spy.calledOnce.should.equal(true);
      })
    })
    context("Edit Hospital", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(updater.editHospital);
      })
      it("Accept patient edit (STUBBED)", async function(){
        setAcceptUpdateQueryDatabase();
        const response = await spy({hospital_id:"400",hospital_email:"KCL@gmail.com"},"400", testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject patient edit (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({hospital_id:"400",hospital_email:"KCL@gmail.com"},"400", testUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Reject patient edit - No token passed (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy({hospital_id:"400",hospital_email:"KCL@gmail.com"}, undefined, testUsername);
        response.response.problem.should.equal("Token in use/No token defined");
        spy.calledOnce.should.equal(true);
      })
    })
    context("Edit Test", function(){
      let spy;
      beforeEach(()=>{
          spy = sinon.spy(updater.editTest);
      })
      it("Accept test edit and add new test (depending on data from database) - in review (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{test_id:"400", completed_status:"no", frequency:"4-D", occurrences:2, completed_date:new Date("2020-01-01")}]}}
          },
          insertQuery: async function()
          {
            return {status:"OK", response: { insertId: "test_insert_id"}}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy("400",{test_id:"400",completed_status:"in review"},"400", testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Accept test edit and add new test (depending on data passed) - in review (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{test_id:"400", completed_status:"no", frequency:"4-D", occurrences:2, completed_date:new Date("2020-01-01")}]}}
          },
          insertQuery: async function()
          {
            return {status:"OK", response: { insertId: "test_insert_id"}}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy("400",{test_id:"400",patient_no:"300",completed_status:"in review", occurrences:"3", frequency:"5-W",notes:"Test", due_date:new Date("2020-01-01")},"400", testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Accept test edit without adding new test - in review (STUBBED)", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          },
          selectQuery: async function()
          {
            return {status: "OK", response: {rows:[{test_id:"400", completed_status:"no", occurrences:0}]}}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy("400",{test_id:"400",completed_status:"in review"},"400", testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject test edit - in review (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy("400",{test_id:"400",completed_status:"in review"},"400", testUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
      it("Accept test edit - late (STUBBED)", async function(){
        setAcceptUpdateQueryDatabase();
        const response = await spy("400",{test_id:"400",completed_status:"no"},"400", testUsername);
        response.success.should.equal(true);
        response.response.affectedRows.should.equal(1);
      })
      it("Reject test edit - late (STUBBED)", async function(){
        setRejectUpdateQueryDatabase();
        const response = await spy("400",{test_id:"400",completed_status:"no"},"400", testUsername);
        response.response.cause.should.equal("stubbed error");
        spy.calledOnce.should.equal(true);
      })
    })
    context("Change due date", function(){
      let spy;
      let date;
      beforeEach(()=>{
          spy = sinon.spy(updater.changeTestDueDate);
          date = new Date();
      })
      it("Reject the change", async function(){
        const dbController = {
          updateQuery: async function() {
            return {status: "ERR", err:{ error: "stubbed error" }}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy("300",date);
        response.success.should.equal(false);
        response.response.error.should.equal("stubbed error")
      })
      it("Accept the change", async function(){
        const dbController = {
          requestEditing: async function() {
            return {status: "OK", response:{ token: "TOKEN"}}
          },
          updateQuery: async function() {
            return {status: "OK", response:{affectedRows:1}}
          }
        }
        updater.__set__("databaseController",dbController);
        const response = await spy("300",date);
        response.success.should.equal(true)
        response.response.affectedRows.should.equal(1)
      })
    })
})
describe("Other functionality", function(){
  context("Execute update query", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(updater.updateQueryDatabase);
    })
    it("Correctly execute update query (STUBBED)", async function(){
      const dbController = {
        updateQuery: async function() {
          return {status: "OK",response:{query: "OK", affectedRows: 1,changedRows: 1}}
        }
      }
      updater.__set__("databaseController",dbController);
      const response = await spy("Table","id","SQL","2222","user");
      response.success.should.equal(true);
      response.response.query.should.equal("OK");
    })
    it("Reject update query - random error (STUBBED)", async function(){
      const dbController = {
        updateQuery: async function() {
          return {status: "ERR", err:{type:"STUBBED", error:"STUBBED ERROR"}}
        }
      }
      updater.__set__("databaseController",dbController);
      const response = await spy("Table","id","SQL","2222","user");
      response.success.should.equal(false);
    })
    it("Reject update query - SQL error (STUBBED)", async function(){
      const dbController = {
        updateQuery: async function() {
          return {status: "ERR", err:{type:"SQL Error", error:"STUBBED ERROR"}}
        }
      }
      updater.__set__("databaseController",dbController);
      const response = await spy("Table","id","SQL","2222","user");
      response.success.should.equal(false);
    })
  })
  context("Prepare update query", function(){
    let spy;
    beforeEach(()=>{
        spy = sinon.spy(updater.prepareUpdateSQL);
    })
    it("Prepare Update query 1", function() {
      const sql = spy("Test", {test_id:"400", due_date:"NULL", completed_date:"2019-04-04", patient_no:"NULL"} , "test_id")
      sql.should.equal("Update Test SET due_date = NULL, completed_date = '2019-04-04', patient_no = NULL WHERE test_id = '400';")
    })
    it("Prepare Update query 2", function() {
      const sql = spy("Test", {test_id:"300", due_date:"NULL", completed_date:"NULL", patient_no:"NULL"} , "test_id")
      sql.should.equal("Update Test SET due_date = NULL, completed_date = NULL, patient_no = NULL WHERE test_id = '300';")
    })
    it("Prepare Update query 3", function() {
      const sql = spy("Test", {test_id:"300", due_date:"2020-12-12", completed_date:"NULL", patient_no:"NULL"} , "test_id")
      sql.should.equal("Update Test SET due_date = '2020-12-12', completed_date = NULL, patient_no = NULL WHERE test_id = '300';")
    })
    it("Prepare Update query 4", function() {
      const sql = spy("Test", {test_id:"NULL", due_date:"NULL", completed_date:"NULL", patient_no:"NULL"} , "test_id")
      sql.should.equal("Update Test SET due_date = NULL, completed_date = NULL, patient_no = NULL WHERE test_id = NULL;")
    })
    it("Prepare Update query 5", function() {
      const sql = spy("Test", {test_id:"NULL", due_date:"NULL", completed_date:"NULL", patient_no:"500"} , "test_id")
      sql.should.equal("Update Test SET due_date = NULL, completed_date = NULL, patient_no = '500' WHERE test_id = NULL;")
    })
  })
})

function setRejectUpdateQueryDatabase(){
  const dbController = {
    updateQuery: async function() {
      return {status: "ERR", err: { type: "Invalid request.", cause: "stubbed error" }}
    },
    selectQuery: async function()
    {
      return {status: "OK", response: {rows:[{test_id:"400", completed_status:"no", frequency:"4-D", occurrences:2, completed_date:new Date("2020-01-01")}]}}
    }
  }
  updater.__set__("databaseController",dbController);
}

function setAcceptUpdateQueryDatabase(){
  const dbController = {
  updateQuery: async function() {
    return {status: "OK", response:{affectedRows:1}}
  },
  selectQuery: async function()
  {
    return {status: "OK", response: {rows:[{test_id:"400", completed_status:"no", frequency:"4-D", occurrences:2, completed_date:new Date("2020-01-01")}]}}
  }
  }
  updater.__set__("databaseController",dbController);
}
