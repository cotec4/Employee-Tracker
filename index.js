const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
let roles = [];
let managers = [];
let departments = [];

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
    connection.query("SELECT * FROM employee", (err, result) => {
        if (err) throw err;
        console.table(result);
        init();
    });
};

byDepartment = () => {
    connection.query("SELECT * FROM department", (err, result) => {
        if (err) throw err;
        departments = [];
        let departmentArray = result;
        for (let i = 0; i < departmentArray.length; i++) {
            departments.push(departmentArray[i].name);
        };
        inquirer.prompt([
            {
                name: "department",
                type: "list",
                message: "Of which department would you like to see all employees?",
                choices: departments
            }
        ]).then((response) => {
            let departmentID;
            for (let i = 0; i < departmentArray.length; i++) {
                if (response.department === departmentArray[i].name)
                    departmentID = departmentArray[i].id;
            };
            connection.query("SELECT * FROM employee, role WHERE role.department_id = ? AND employee.role_id = role.id", departmentID, (err, result) => {
                if (err) throw err;
                for (let i = 0; i < result.length; i++)
                    console.log(`${result[i].first_name} ${result[i].last_name}`);
                console.log("\n");
                init();
            });
        });
    });
};

byManager = () => {
    connection.query("SELECT * FROM employee WHERE manager_id IS NULL", (err, result) => {
        if (err) throw err;
        managers = [];
        let managersArray = result;
        for (let i = 0; i < result.length; i++)
            managers.push(result[i].first_name + " " + result[i].last_name);
        inquirer.prompt([
            {
                name: "manager",
                type: "list",
                message: "Of which manager would you like to see all employees?",
                choices: managers
            }
        ]).then((response) => {
            let managerID;
            for (let i = 0; i < managersArray.length; i++) {
                if (response.manager === managersArray[i].first_name + " " + managersArray[i].last_name)
                    managerID = managersArray[i].id;
            };
            connection.query("SELECT * FROM employee WHERE manager_id = ?", managerID, (err, result) => {
                if (err) throw err;
                for (let i = 0; i < result.length; i++)
                    console.log(`${result[i].first_name} ${result[i].last_name}`);
                console.log("\n");
                init();
            });
        });
    });
};

addEmployee = () => {
    connection.query("SELECT * FROM employee WHERE manager_id IS NULL", (err, result) => {
        if (err) throw err;
        managers = [];
        let managersArray = result;
        for (let i = 0; i < result.length; i++)
            managers.push(result[i].first_name + " " + result[i].last_name);
        connection.query("SELECT * FROM role", (err, response) => {
            if (err) throw err;
            let rolesArray = response;
            for (let i = 0; i < response.length; i++)
                roles.push(response[i].title);
            inquirer.prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "What is the new employee's first name?",
                    validate: (input) => {
                        if (input === "") return false;
                        return true;
                    }
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the new employee's last name?",
                    validate: (input) => {
                        if (input === "") return false;
                        return true;
                    }
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the new employee's role?",
                    choices: roles
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Who is the new employee's manager?",
                    choices: managers
                }
            ]).then((response) => {
                let firstName = response.firstName;
                let lastName = response.lastName;
                let roleID;
                for (let i = 0; i < rolesArray.length; i++) {
                    if (response.role === rolesArray[i].title) {
                        roleID = rolesArray[i].id;
                    };
                };
                let managerID;
                for (let i = 0; i < managersArray.length; i++) {
                    if (response.manager === managersArray[i].first_name + " " + managersArray[i].last_name)
                        managerID = managersArray[i].id;
                };
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${roleID}, ${managerID})`, (err, res) => {
                    if (err) throw err;
                    console.log(`\n Employee ${firstName} ${lastName} added to the employee table \n`);
                    init();
                });
            });
        });
    });
};

removeEmployee = () => {
    let employeeList = [];
    let employeeListArray;
    connection.query("SELECT * FROM employee ORDER BY id ASC", (err, res) => {
        if (err) throw err;
        employeeListArray = res;
        for (let i = 0; i < res.length; i++)
            employeeList.push(res[i].first_name + " " + res[i].last_name);
        inquirer.prompt([
            {
                name: "employeeToRemove",
                type: "list",
                message: "Which employee would you like to remove?",
                choices: employeeList
            },
            {
                name: "yesOrNO",
                type: "list",
                message: "Are you sure you'd like to remove this employee?",
                choices: ["Yes", "No"]
            }
        ]).then((response) => {
            let employeeToRemoveID;
            for (let i = 0; i < employeeList.length; i++) {
                if (response.employeeToRemove === employeeListArray[i].first_name + " " + employeeListArray[i].last_name)
                    employeeToRemoveID = employeeListArray[i].id;
            };
            if (response.yesOrNO === "Yes") {
                connection.query("DELETE FROM employee WHERE id=?", employeeToRemoveID, (err, res) => {
                    if (err) throw err;
                    console.log(`\n Employee ${response.employeeToRemove} removed from the employee table \n`);
                    init();
                });
            }
            else
                init();
        });
    });
};

updateEmployeeRole = () => {

    init();
};

updateEmployeeManager = () => {

    init();
};