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
  