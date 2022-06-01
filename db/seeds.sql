USE employee_db;

INSERT INTO  department (name)
VALUES('BUSINESS'), ('SALES'), ('ADMIN'), ('HR');

INSERT INTO role (title, department_id, salary)
VALUES ('Bussiness Manager', 1, 125000),
 ('Assistant Manager', 1, 95000),
 ('Sales Manager', 2, 110000),
 ('Sales Agent', 2, 95000),
 ('Admin Manager', 3, 85000),
 ('Admin Asst.', 3, 60000),
 ('HR Manager', 4, 95000),
 ('Service Asst.', 4, 75000),

 INSERT INTO employee (first_name, last_name, role_id, manager_id)
 VALUES ('Paul', 'Smith', 1, NULL),
  ('Brian', 'Roberts', 1, 1),
  ('Richard', 'Jefferson', 2, NULL),
  ('Carley', 'Stevens', 2, 2),
  ('John', 'Lannen', 3, NULL),
  ('David','Conover', 3, 3),
  ('Regina', 'Jones', 4, NULL),
  ('Stacy', 'Johnson', 4, 4);

  



