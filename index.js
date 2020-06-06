require('dotenv').config();
const mysql = require("mysql");
const inquirer = require("inquirer");
var allDeparments = [];
var allRoles =[];
var allEmployee = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.password,
    database: "company"
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("connected as id " + connection.threadId);
    init();
});

function mainmenu() {
    return inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do ?",
            name: "main",
            choices: [
                "View All Department",
                "View All Roles",
                "View All Employee",
                "Add Department",
                "Add Roles",
                "Add Employee",
                "Delete Department",
                "Delete Roles",
                "Delete Employee",
                "Update Roles",
                "Update Employee",
                "Quite"
            ]
        }
    ]);
}

function departmentList() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT name FROM department ORDER BY id`, function (err, res) {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
};
function roleList(){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT title FROM role ORDER BY id`, function (err, res) {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
};
function employeeList(){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT first_name,last_name FROM employee ORDER BY id`, function (err, res) {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
};

function viewDepartment() {
    connection.query("SELECT name FROM department ORDER BY id", function (err, res) {
        if (err) throw err;
        console.table(res);
    });
    connection.end();
}
function viewRoles() {
    connection.query("SELECT title,salary,name AS department FROM role LEFT JOIN department ON role.department_id = department.id", function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
}

function viewEmployee() {
    connection.query("SELECT first_name,last_name,title,salary,department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
};


function addDepartmentMenu() {
    return inquirer.prompt([{
        type: "input",
        message: "What Department do you want to Add ?",
        name: "department"
    }]);
}
function addDepartment() {
    addDepartmentMenu().then(function (data) {
        connection.query(`INSERT INTO department (name) VALUES ("${data.department}")`, function (err, res) {
            viewDepartment();
        });
    });
}

// function addRoleMenu() {
//     let allDeparments = [];
//     connection.query(`SELECT name FROM department ORDER BY id`, function (err, res) {
//         for (let i = 0; i < res.length; i++) {
//             allDeparments.push(res[i].name);
//         };
//         return inquirer.prompt([{
//             type: "list",
//             message: "Select Department : ",
//             name: "department",
//             choices: allDeparments
//         },
//         {
//             type: "input",
//             message: "What Role do you want to Add ?",
//             name: "title"
//         },
//         {
//             type: "input",
//             message: "Input Salary : ",
//             name: "salary"
//         }
//         ]);
//     });
// }

async function addRoleMenu() {
    let res = await departmentList();
    for (let i = 0; i < res.length; i++) {
        allDeparments.push(res[i].name);
    };
    return inquirer.prompt([{
        type: "list",
        message: "Select Department : ",
        name: "department",
        choices: allDeparments
    },
    {
        type: "input",
        message: "What Role do you want to Add ?",
        name: "title"
    },
    {
        type: "input",
        message: "Input Salary : ",
        name: "salary"
    }
    ]);
}

function addRole() {
    addRoleMenu().then(function (data) {
        connection.query(`INSERT INTO role (title,salary,department_id) VALUES ("${data.title}","${data.salary}","${data.department}")`, function (err, res) {
            // console.table(res);
            viewRoles();
        });
    });
}

async function addEmployeeMenu() {
    let res = await roleList();
    for (let i = 0; i < res.length; i++) {
        allRoles.push(res[i].title);
    };
    res = await employeeList();
    for (let i = 0; i < res.length; i++) {
        allEmployee.push(res[i].first_name +" "+res[i].last_name);
    };
    return inquirer.prompt([{
        type: "input",
        message: "What is Employee's Fist Name ?",
        name: "firstName"
    },
    {
        type: "input",
        message: "What is Employee's Last Name ?",
        name: "lastName"
    },
    {
        type: "list",
        message: "Select Employee's Role ?",
        name: "role",
        choices: allRoles
    },
    {
        type: "list",
        message: "Select Employee's Manager ?",
        name: "manager",
        choices:allEmployee
    }]);
}
function addEmployee() {
    addEmployeeMenu().then(function (data) {
        connection.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ("${data.firstName}","${data.lastName}","${data.role}","${data.manager}")`, function (err, res) {
            // console.table(res);
            viewEmployee();
        });
    });
}
async function deleteDepartmentMenu() {
    let res = await departmentList();
    for (let i = 0; i < res.length; i++) {
        allDeparments.push(res[i].name);
    };
    return inquirer.prompt([{
        type: "list",
        message: "What Department do you want to Delete ?",
        name: "department",
        choices:allDeparments
    }]);
};
function deleteDepartment() {
    deleteDepartmentMenu().then(function (data) {
        connection.query(`DELETE FROM department WHERE name="${data.department}"`, function (err, res) {
            // console.table(res);
            viewDepartment();
        });
    });
};
async function deleteRoleMenu() {
    let res = await roleList();
    for (let i = 0; i < res.length; i++) {
        allRoles.push(res[i].title);
    };
    return inquirer.prompt([{
        type: "list",
        message: "What Role do you want to Delete ?",
        name: "role",
        choices:allRoles
    }]);
};
function deleteRole() {
    deleteRoleMenu().then(function (data) {
        connection.query(`DELETE FROM role WHERE title = "${data.role}"`, function (err, res) {
            viewRoles();
        });
    });
};

async function deleteEmployeeMenu() {
    let res = await employeeList();
    for (let i = 0; i < res.length; i++) {
        allEmployee.push(res[i].first_name +" "+res[i].last_name);
    };
    return inquirer.prompt([{
        type: "list",
        message: "Which Employee do you want to Delete ?",
        name: "employee",
        choices: allEmployee
    }]);
};
function deleteEmployee() {
    deleteEmployeeMenu().then(function (data) {
        let fullName = data.employee.split(" ");
        let firstName = fullName[0];
        let lastName = fullName[1];
        connection.query(`DELETE FROM employee WHERE first_name ="${firstName}" AND last_name = "${lastName}"`, function (err, res) {
            viewEmployee();
        });
    });
}

async function updateRoleMenu() {
    let res = await roleList();
    for (let i = 0; i < res.length; i++) {
        allRoles.push(res[i].title);
    };
    return inquirer.prompt([{
        type: "list",
        message: "Which Role do you want to Update ?",
        name: "role",
        choices: allRoles
    },
    {
        type: "input",
        message: "Input the updated Salary :",
        name: "salary"
    }]);
}
function updateRole() {
    updateRoleMenu().then(function (data) {
        connection.query(`UPDATE role SET salary = "${data.salary}" WHERE title = "${data.role}"`, function (err, res) {
            viewRoles();
        });
    });
}

function quite() {
    console.clear();
    console.log("Good Bye");
    connection.end();

};

async function init() {
    try {
        const menu = await mainmenu();
        switch (menu.main) {
            case "View All Department":
                return viewDepartment();
            case "View All Roles":
                return viewRoles();
            case "View All Employee":
                return viewEmployee();
            case "Add Department":
                return addDepartment();
            case "Add Roles":
                return addRole();
            case "Add Employee":
                return addEmployee();
            case "Delete Department":
                return deleteDepartment();
            case "Delete Roles":
                return deleteRole();
            case "Delete Employee":
                return deleteEmployee();
            case "Update Roles":
                return updateRole();
            case "Update Employee":
                return updateEmployee();
            default:
                return quite();
        }
    }
    catch (err) {
        console.error(err);
    }
}
