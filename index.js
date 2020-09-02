const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employee_tracker_db"
});

connection.connect((err) => {
    if (err) throw err;
    init();
});

init = () => {
    inquirer.prompt([
        {
            name: "startingQuestion",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees By Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "Exit"
            ]
        }
    ]).then((response) => {
        let answer = response.startingQuestion;
        switch (answer) {
            case "View All Employees":
                allEmployees();
                break;
            case "View All Employees By Department":
                byDepartment();
                break;
            case "View All Employees By Manager":
                byManager();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
            case "Exit":
                connection.end();
        };
    });
};

allEmployees = () => {
    connection.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err;
        console.table(results);
        init();
    });
};

byDepartment = () => {

    init();
};

byManager = () => {

    init();
};

addEmployee = () => {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the new employee's first name?",
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the new employee's last name?",
        },
        {
            name: "role",
            type: "list",
            message: "What is the new employee's role?",
            choices: [

            ]
        },
        {
            name: "manager",
            type: "list",
            message: "Who is the new employee's manager?",
            choices: [

            ]
        }
    ]).then((response) => {
        let firstName = response.firstName;
        let lastName = response.lastName;
        let role = response.role;
        let manager = response.manager;
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ?", [firstName, lastName, role, manager], (err, res) => {
            if (err) throw err;
        });
        init();
    });
};

removeEmployee = () => {

    init();
};

updateEmployeeRole = () => {

    init();
};

updateEmployeeManager = () => {

    init();
};