USE employee_tracker_db;

/* Insert 3 Rows into your new table */
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jeff", "Bezos", 1), ("Bill", "Gates", 1), ("Mark","Zuckerberg", 1), ("Elon", "Musk", 1), ("Warren", "Buffet", 1);

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 1000000, 10)

INSERT INTO department (name)
VALUES ("Wealth")