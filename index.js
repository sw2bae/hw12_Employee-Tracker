require('dotenv').config();
const mysql = require("mysql");
const inquirer = require("inquirer");


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

function viewDepartment() {
    connection.query("SELECT * FROM department ORDER BY id", function (err, res) {
        if (err) throw err;
        console.table(res);
    });
    connection.end();
}
function viewRoles() {
    connection.query("SELECT role.id,title,salary,name AS department FROM role LEFT JOIN department ON role.department_id = department.id", function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
}

function viewEmployee() {
    connection.query("SELECT employee.id,first_name,last_name,title,salary,department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", function (err, res) {
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
    const allDeparments = [];
    function queryAsync() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT name FROM department ORDER BY id`, function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });
    };
    const res = await queryAsync();
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

function addEmployeeMenu() {
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
        type: "input",
        message: "What is Employee's Role ?",
        name: "role"
    },
    {
        type: "input",
        message: "Who is Employee's Manager ?",
        name: "manager"
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
function deleteDepartmentMenu() {
    return inquirer.prompt([{
        type: "input",
        message: "What Department do you want to Delete ?",
        name: "department"
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
function deleteRoleMenu() {
    return inquirer.prompt([{
        type: "input",
        message: "What Role do you want to Delete ?",
        name: "role"
    }]);
};
function deleteRole() {
    deleteRoleMenu().then(function (data) {
        connection.query(`DELETE FROM role WHERE title = "${data.role}"`, function (err, res) {
            viewRoles();
        });
    });
};

function deleteEmployeeMenu() {
    return inquirer.prompt([{
        type: "input",
        message: "Which Employee do you want to Delete ?",
        name: "employee"
    }]);
};
function deleteEmployee() {
    deleteEmployeeMenu().then(function (data) {
        connection.query(`DELETE FROM employee WHERE first_name = "${data.employee}"`, function (err, res) {
            viewEmployee();
        });
    });
}

function updateRoleMenu() {
    return inquirer.prompt([{
        type: "input",
        message: "Which Role do you want to Update ?",
        name: "role"
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


// function deleteDepartmentMenu() {
//     let allDeparments = viewDepartment();
//     // make a connection query to return all the departments  and save as a variable then render that vaira in choices

//     return inquirer.prompt([{
//         type: "list",
//         message: "Which Department do you want to Delete ?",
//         name: "departmentDelete",
//         choices: []
//     }
//     ]);
// }
// function deleteDepartment() {
//     deleteDepartmentMenu();
//     connection.query("DELETE FROM department WHERE name = ?",[], function (err, res) {
//         console.log(res.name);
//     });
// }

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
