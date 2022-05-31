const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const express = require("express");

const connection = mysql.createConnection({
    host: "localhost",
    port:  3001,
    user: "root",
    password: "1234",
    database: "employee_db"

});


connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    init();
  });

  function init() {
      inquirer.prompt({
          type: "list",
          name: "start",
          message: "Please make a selection from the following:",
          choices: ["View All Employees", "View All Departments", "View All Roles", "View All Employees By Department", "View All Employees By Manager",
          "Add Employee", "Remove Employee", "Update Employee Role", "Add Employee Role", "Remove Role", "Add New Department", "Remove Department"]
      })

        
  };
  