DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE DATABASE employee_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id)
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30,)
    last_name VARCHAR(30,)
    role_id VARCHAR(30),
    manager_id INT,
    PRIMARY KEY (id)
);

