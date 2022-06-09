const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const express = require("express");
const { response } = require("express");

// Create a connection and log it to the console
const connection = mysql.createConnection({
    host: "localhost",
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
        message: "Which action would you like to perform?:",
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

                case "View All Employees By Department":
                    displayEmpDept();
                    break;

                case "View All Employees By Manager":
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

                case "Add Employee Role":
                    addRole();
                    break;

                case "Remove Role":
                    removeRole();
                    break;

                case "Add New Department":
                    addDepartment();
                    break;

                case "Remove Department":
                    removeDepartment();
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
        console.table(data);  // data mandatory argument for console.table
        init();
    })
};

// View Departments
function viewDepartments() {
    const depQuery = `SELECT * FROM department`
    connection.query(depQuery, (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    })
}

// View Roles
function viewRoles() {
    const roleQuery = `SELECT * FROM role`
    connection.query(roleQuery, (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    })
}

// View employees by department
function displayEmpDept() {

    const depQuery1 = `SELECT * FROM department`
    connection.query(depQuery1, (err, data) => {

        if (err) throw err;

        const departments = data.map(element => {

            return { name: `${element.name}`, value: `${element.id}` }
        });


        inquirer.prompt([{
            type: "list",
            name: "dept",
            message: "Select a department to view its employees",
            choices: departments

        }])
            .then(answer => {

                const depQuery2 = `SELECT employee.first_name, employee.last_name, employee.role_id AS role, CONCAT(manager.first_name,' ',manager.last_name) AS manager, department.name as department 
            FROM employee LEFT JOIN role on employee.role_id = role.id 
            LEFT JOIN department ON role.department_id =department.id LEFT JOIN employee manager ON employee.manager_id=manager.id
            WHERE department_id=`+ answer.dept
                connection.query(depQuery2, function (err, res) {
                    if (err) throw err;
                    console.table(res)
                    init();
                })
            })
    })
};

// View employees by their Manager
function
    displayEmpMgr() {
    let query1 = `SELECT * FROM employee WHERE manager_id IS NULL`

    connection.query(query1, function (err, res) {
        if (err) throw err;
        const managers = res.map(function (element) {
            return {
                name: `${element.first_name} ${element.last_name}`,
                value: element.id
            }
        });
        inquirer.prompt([{
            type: "list",
            name: "empManager",
            message: "Select a Manager to view their employees",
            choices: managers
        }])
            .then(response => {
                console.log(response.empManager)
                let query2 = `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id AS role, CONCAT(manager.first_name, ' ', manager.last_name) as manager, department.name AS department FROM employee
            LEFT JOIN role on employee.role_id = role.id
            LEFT JOIN department on department.id = role.department_id
            LEFT JOIN employee manager on employee.manager_id = manager.id
            WHERE employee.manager_id = ?`
                connection.query(query2, [response.empManager], (err, data) => {
                    if (err) throw err;
                    console.table(data);
                    init()
                })
            })
    })
};

// Add a new employee
function addEmployee() {
    let addQuery = `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, department.name,
    role.salary, employee.manager_id 
      FROM employee
      INNER JOIN role on role.id = employee.role_id
      INNER JOIN department ON department.id = role.department_id`
    connection.query(addQuery, (err, results) => {
        if (err) throw err;
        {
            inquirer
                .prompt(
                    [
                        {
                            type: 'input',
                            name: 'first_name',
                            message: 'Enter the first name of the employee'
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: 'Enter in the last name of the employee'
                        },
                        {
                            type: 'input',
                            name: 'role_id',
                            message: 'What role ID do you want this employee to be?'
                        },
                    ]
                )
                .then((response) => {
                    const firstName = response.first_name
                    const lastName = response.last_name
                    const roleId = response.role_id
                    connection.query(
                        `INSERT INTO employee (first_name, last_name, role_ID) VALUES (?, ?, ?);`, [firstName, lastName, roleId]
                    );
                    console.log('\n Added ' + firstName, lastName + ' to the database! \n')
                    init();
                })
        }
    })
};

// Remove an employee
function removeEmployee() {
    let query1 = `SELECT * FROM employee`
    connection.query(query1, (err, res) => {
        if (err) throw err;
        inquirer.prompt([{
            type: "list",
            name: "empID",
            message: "Select an employee to be removed",
            choices: res.map(employee => {
                return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
            })
        }])
            .then(answer => {
                let query2 = `DELETE FROM employee WHERE ?`
                connection.query(query2, [{ id: answer.empID }], (err) => {
                    if (err) throw err;
                    console.log('Removed employee');
                    init();
                })

            })
    })
};

// Remove a role
function removeRole() {
    inquirer
        .prompt(
            [
                {
                    type: 'input',
                    name: 'removedRole',
                    message: 'Which Role ID would you like to remove?'
                }
            ]
        )
        .then((response) => {
            let removedRole = response.removedRole
            connection.query(
                `DELETE FROM role WHERE role_id = ?`, [removedRole]
            )
            init();
        })
};

// Update employee role(s)

function updateRole() {
    let query = `SELECT * FROM employee`

    connection.query(query, (err, response) => {
        const employees = response.map(function (element) {
            return {
                name: `${element.first_name} ${element.last_name}`,
                value: element.id
            }
        });

        inquirer.prompt([{
            type: "list",
            name: "employeeID",
            message: "Select an employee role to update",
            choices: employees
        }])
            .then(input1 => {
                connection.query('SELECT * FROM role', (err, data) => {
                    const roles = data.map(function (role) {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    });

                    inquirer.prompt([{
                        type: "list",
                        name: "roleID",
                        message: "Describe the role",
                        choices: roles
                    }])
                    
                        .then(input2 => {
                            console.log("input employee.id", input1.employeeID)
                            const query1 = `UPDATE employee
                        SET employee.role_id = ?
                        WHERE employee.id = ?`
                            connection.query(query1, [input2.roleID, input1.employeeID], function (err, res) {
                                

                            })
                            init();
                        })
                })


            })
    })
};

// Add a role
function addRole() {
    let query1 = `SELECT * FROM role`
    connection.query(query1, (err, data) => {
        if (err) throw err
        inquirer.prompt([
            {
                type: "input",
                name: "roleID",
                message: "Enter ID for new role"
            },
            {
                type: "input",
                name: "title",
                message: "Enter title for new role"
            },
            {
                type: "input",
                name: "salary",
                message: "Enter new role salary"
            },
            {
                type: "input",
                name: "deptID",
                message: "Enter new role department ID"
            }])
            .then((response) => {
                const newRole = response.roleID
                const roleTitle = response.title
                const salary = response.salary
                const deptID = response.deptID
                connection.query(
                    `INSERT INTO role (roleID, title, salary, deptID) VALUES (?, ?, ?, ?);`, [newRole, roleTitle, salary, deptID]
                );
                console.log('\n Added ' + newRole, roleTitle, salary, deptID + ' to the database! \n')
                init();
            })

    })
};

// Add a department
function addDepartment() {
    let query1 = `SELECT * FROM department`


    {
        inquirer
            .prompt(
                [
                    {
                        type: 'input',
                        name: 'dept',
                        message: 'Enter the name of the new department'
                    },
                    {
                        type: 'input',
                        name: 'dept_id',
                        message: 'What ID do you want this department to be?'
                    },
                ]
            )
            .then((response) => {
                const deptName = response.dept
                const deptId = response.dept_id
                connection.query(
                    `INSERT INTO department (name, id) VALUES (?, ?);`, [deptName, deptId]
                )

                console.log('\n Added ' + deptName, deptId + ' to the database! \n')
                init();



            });
    }

};




// Remove a department
function removeDepartment() {
    let query1 = `SELECT * FROM department`
    connection.query(query1, (err, res) => {
        if (err) throw err
        inquirer.prompt([{
            type: "input",
            name: "deptID",
            message: "Select a department id to remove",
            choices: res.map(departments => {
                return { name: `${departments.name}`, value: departments.id }
            })
        }])
            .then(function (answers) {
                let query2 = `DELETE FROM department WHERE ?`
                connection.query(query2, [{ id: answers.deptID }]), function (err) {
                    if (err) throw err;


                }
                console.log("Department removed")
                init();
            })
    })
};












