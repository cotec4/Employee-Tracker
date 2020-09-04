const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
let roles = [];
let managers = [];
let departments = [];
let employees = [];

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
                "View All Roles",
                "View All Departments",
                "View All Employees By Department",
                "View All Employees By Manager",
                "Add Employee",
                "Add Role",
                "Add Department",
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
                viewTable("employee");
                break;
            case "View All Roles":
                viewTable("role");
                break;
            case "View All Departments":
                viewTable("department");
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
            case "Add Role":
                addRole();
                break;
            case "Add Department":
                addDepartment();
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

viewTable = (tableName, isInit = true) => {
    connection.query("SELECT * FROM ??", tableName, (err, result) => {
        if (err) throw err;
        console.table(result);
        if (isInit) return init();
        return result
    });
};

byDepartment = () => {
    departments = [];
    connection.query("SELECT * FROM department", (err, result) => {
        if (err) throw err;
        let departmentArray = result;
        departments = departmentArray.map((department) => {
            return department.name
        });
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
        roles = [];
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

addRole = () => {
    connection.query("SELECT * FROM department", (err, result) => {
        if (err) throw err;
        departments = [];
        let departmentArray = result;
        departments = result.map((department) => {
            return department.name
        });
        inquirer.prompt([
            {
                type: "input",
                name: "newRole",
                message: "What role do you want to add?"
            },
            {
                type: "input",
                name: "newRoleSalary",
                message: "What is the salary for the new role?",
                validate: (answer) => {
                    const parseAnswer = parseInt(answer);
                    if (isNaN(parseAnswer)) return false;
                    else return true;
                }
            },
            {
                type: "list",
                name: "newRoleDepartment",
                message: "Which department is the new role in?",
                choices: departments
            },
        ]).then((answer) => {
            let departmentID;
            departmentID = departmentArray.find((department) => {
                return department.name === answer.newRoleDepartment;
            });
            connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answer.newRole, answer.newRoleSalary, departmentID.id], (err, result) => {
                if (err) throw err;
                console.log(`${answer.newRole} added`)
                console.log("\n");
                init();
            })
        });
    });
};

addDepartment = () => {
    inquirer.prompt([
        {
            message: "What department would you like to add?",
            type: "input",
            name: "newDepartment"
        }
    ]).then((answer) => {
        connection.query("INSERT INTO department (name) VALUES (?)", answer.newDepartment, (err, result) => {
            if (err) throw err;
            console.log(`${answer.newDepartment} added as a department`);
            console.log("\n");
            init();
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
    employees = [];
    roles = [];
    connection.query("SELECT * FROM employee", (err, result) => {
        let employeesArray = result;
        if (err) throw err;
        for (let i = 0; i < result.length; i++)
            employees.push(result[i].first_name + " " + result[i].last_name);
        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee's role would you like to update?",
                choices: employees
            }
        ]).then((answer) => {
            let employeeID;
            let employee = answer.employee;
            for (let i = 0; i < employeesArray.length; i++) {
                if (answer.employee === employeesArray[i].first_name + " " + employeesArray[i].last_name)
                    employeeID = employeesArray[i].id;
            }
            connection.query("SELECT * FROM role", (err, response) => {
                let rolesArray = response;
                if (err) throw err;
                for (let i = 0; i < rolesArray.length; i++)
                    roles.push(rolesArray[i].title);
                inquirer.prompt([
                    {
                        type: "list",
                        name: "newRole",
                        message: `What would you like ${employee}'s new role to be?`,
                        choices: roles
                    }
                ]).then((response) => {
                    let roleID;
                    let role = response.newRole;
                    for (let i = 0; i < rolesArray.length; i++) {
                        if (response.newRole === rolesArray[i].title)
                            roleID = rolesArray[i].id;
                    };
                    connection.query("UPDATE employee SET role_id = ? WHERE ID = ?", [roleID, employeeID], (err, answer) => {
                        if (err) throw err;
                        console.log(`${employee}'s role has been updated to ${role}`);
                        console.log("\n");
                        init();
                    });
                });
            });
        });
    });
};

updateEmployeeManager = () => {
    employees = [];
    roles = [];
    connection.query("SELECT * FROM employee", (err, result) => {
        let employeesArray = result;
        if (err) throw err;
        for (let i = 0; i < result.length; i++)
            employees.push(result[i].first_name + " " + result[i].last_name);
        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee's manager would you like to update?",
                choices: employees
            }
        ]).then((answer) => {
            let employeeID;
            employees = employees.filter((employee) => {
                return answer.employee !== employee
            });
            for (let i = 0; i < employeesArray.length; i++) {
                if (answer.employee === employeesArray[i].first_name + " " + employeesArray[i].last_name)
                    employeeID = employeesArray[i].id;
            }
            inquirer.prompt([
                {
                    type: "list",
                    name: "newManager",
                    message: `Who would you like to be ${answer.employee}'s new manager to be?`,
                    choices: employees
                }
            ]).then((response) => {
                let newManagerID;
                let newManager = response.newManager;
                for (let i = 0; i < employeesArray.length; i++) {
                    if (response.newManager === employeesArray[i].first_name + " " + employeesArray[i].last_name)
                        newManagerID = employeesArray[i].id;
                };
                connection.query("UPDATE employee SET manager_id = ? WHERE ID = ?", [newManagerID, employeeID], (err, answer) => {
                    if (err) throw err;
                    console.log(`${employee}'s manager has been updated to ${newManager}`);
                    console.log("\n");
                    init();
                });
            });
        });
    });
};