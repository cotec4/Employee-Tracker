const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: ""
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
    ]).then((answer) => {
        let answer = answer.startingQuest;
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
        }
    })
}


allEmployees = () => {
    connection.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err;
        console.table(results);
    });
    init();
};

byDepartment = () => {

    init();
};

byManager = () => {

    init();
};

addEmployee = () => {

    init();
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