DROP DATABASE IF EXISTS company;
CREATE database company;

USE company;

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT, 
    PRIMARY KEY(id),
);

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT ,
    name VARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY(id)
);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL UNIQUE,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL, 
    PRIMARY KEY(id),
    FOREIGN KEY(department_id) REFERENCES department(id) ON DELETE CASCADE
);

