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
                "Quite"
            ]
        }
    ]);
}

function viewDepartment() {
    let allDeparments = [];
    connection.query("SELECT * FROM department ORDER BY id", function (err, res) {
        if (err) throw err;
        console.table(res);
        for (let i = 0; i < res.length; i++) {
            allDeparments.push(res[i].name);
        }
        return allDeparments;
        // console.log(allDeparments);
    });
    connection.end();
}
function viewRoles() {
    connection.query("SELECT * FROM role ORDER BY id", function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
}
function viewEmployee() {
    connection.query("SELECT * FROM employee ORDER BY id", function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
}


function addDepartmentMenu() {
    return inquirer.prompt([{
        type: "input",
        message: "What Department do you want to Add ?",
        name: "departmentAdd"
    }]);
}
function addDepartment() {
    addDepartmentMenu().then(function (data) {
        connection.query(`INSERT INTO department (name) VALUES ("${data.departmentAdd}")`, function (err, res) {
            console.table(res);
            viewDepartment();
        });
    });
}

function addRoleMenu() {
        return inquirer.prompt([{
            type: "input",
            message: "What Role do you want to Add ?",
            name: "title"
        },
        {
            type: "input",
            message: "Input Salary : ",
            name: "salary"
        },
        {
            type: "input",
            message: "Select Department : ",
            name: "role_department",
            // choices: ["1","2"]
        }
        ]);
}
function addRole() {
    addRoleMenu().then(function(data){
        connection.query(`INSERT INTO role (title) (salary) (department_id ) VALUES ("${data.title}") ("${data.salary}") ("${data.role_department}")`,function(err,res){
            console.table(res);
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
            case "Delete Department":
                return deleteDepartment();
        }
    }
    catch (err) {
        console.error(err);
    }
}
