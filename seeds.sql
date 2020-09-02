USE employee_tracker_db;

INSERT INTO department (name)
VALUES
    ("Sales"),
    ("Engineering"),
    ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Sales Representative", 65000, 100),
    ("Engineering", 75000, 200),
    ("Legal", 100000, 300);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("John", "Edwards", 100, 1),
    ("Bill", "Bezos", 101, 1),
    ("Mark", "Zucks", 102, 1),
    ("Elon", "Fusk", 103, 1),
    ("Warren", "Gates", 201, 2);