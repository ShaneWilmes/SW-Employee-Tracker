const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const express = require("express");
const { response } = require("express");

// Create a connection and log it to the console
const connection = mysql.createConnection({
    host: "localhost",
    port: 3001,
    user: "root",
    password: "1234",
    database: "employee_db"

});


connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    init();
});

// App initialization and prompting user to make a choice
function init() {
    inquirer.prompt({
        type: "list",
        name: "start",
        message: "Please make a selection from the following:",
        choices: ["View All Employees", "View All Departments", "View All Roles", "View All Employees By Department", "View All Employees By Manager",
            "Add Employee", "Remove Employee", "Update Employee Role", "Add Employee Role", "Remove Role", "Add New Department", "Remove Department"]
    })

        .then(function (response) {
            switch (response.start) {


                case "View All Employees":
                    displayEmployees();
                    break;

                case "View All Departments":
                    viewDepartments();
                    break;
                
                case "View All Roles":
                    viewRoles();
                    break;
                
                case "View All Employees by Department":
                    displayEmpDept();
                    break;

                case "View All Employees by Manager":
                    displayEmpMgr();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Remove Employee":
                    removeEmployee();
                    break;

                case "Update Employee Role":
                    updateRole();
                    break;

                case "Remove Employee Role":
                    removeRole();
                    break;

                case "Add New Department":
                    addDepartment();
                    break;

                case "Remove Department":
                    removeDepartment();
                    break;

                case "Update Employee Manager":
                    updateManager();
                    break;
            }
        })


};

// Display all employees
function displayEmployees() {
    const empQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, 
    CONCAT(manager.first_name,' ',manager.last_name) AS manager, department.name
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON  employee.manager_id = manager.id`
  
    connection.query(empQuery, (err, data) => {
      if (err) throw err;
      console.table(data);
      init();
    })
  };

// View Departments

function viewDepartments(){
    const depQuery = `SELECT * FROM department`
    connection.query(depQuery, (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
      })
}

// View Roles
function viewRoles(){
    const roleQuery = `SELECT * FROM role`
    connection.query(roleQuery, (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
      })
}

// View employees by department
function displayEmpDept() {
    const depQuery1 = ('SELECT * FROM department');
    connection.query(depQuery1, (err, response)=> {
        if (err) throw err;
        const departments = response.map(element => {
            return { name: `${element.name}`}
        });

        inquirer.prompt([{
            type: "list",
            name: "dept",
            message: "Please select a department and to view employees",
            choices: departments

        }]).then(answer => {
            const depQuery2 = `SELECT employee.first_name, employee.last_name, employee.role_id AS role, CONCAT(manager.first_name,' ',manager.last_name) AS manager, department.name as department 
            FROM employee LEFT JOIN role on employee.role_id = role.id 
            LEFT JOIN department ON role.department_id =department.id LEFT JOIN employee manager ON employee.manager_id=manager.id
            WHERE ?`
            connection.query(depQuery2, [{ name: answer.dept }], function (err, res) {
                if (err) throw err;
                console.table(res)
                init();
            })
        })    
    })
};




