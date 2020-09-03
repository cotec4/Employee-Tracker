USE employee_tracker_db;

INSERT INTO department (name)
VALUES
    ("Sales"),
    ("Engineering"),
    ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Sales Representative", 65000, 1),
    ("Product Engineer", 75000, 2),
    ("Legal Associate", 100000, 3),
    ("General Counsel", 200000, 3),
    ("SVP of Sales", 225000, 1),
    ("CTO", 200000, 2);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (101, "John", "Edwards", 5, NULL),
    (102, "Bill", "Bezos", 6, NULL),
    (103, "Mark", "Zucks", 4, NULL),
    (104, "Elon", "Fusk", 3, 103),
    (105, "Warren", "Gates", 6, 101),
    (106, "Jim", "Irsay", 2, 102);