const mysql = require("mysql");
const inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Qotkddn0925!",
    database: "company"
  });

  connection.connect(function(err) {
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
            message: "What Would you like to do ?",
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
    connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;
      console.table(res);
      connection.end();
    });
  }
  function viewRoles() {
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      console.table(res);
      connection.end();
    });
  }
  function viewEmployee() {
    connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;
      console.table(res);
      connection.end();
    });
  }

async function init() {
    try {
        const menu = await mainmenu();
        switch(menu.main){
            case "View All Department":
                viewDepartment();
        }
    }
    catch (err) {
        console.error(err);
    }
}
