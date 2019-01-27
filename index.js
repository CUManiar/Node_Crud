// Prerequisites:
// 1. Install express.json, body-parser, mysql libraries
// 2. For runtime update install nodemon library

//Initialize mysql connection
const mysql = require('mysql');

//Initialize express server
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

//Configure express server
app.use(bodyparser.json());

//Establish connection to mysql 
/* NOTE:
If any Authentication related error comes then run following commands to your mysql
1. ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '<password>';
2. FLUSH PRIVILEGES
*/
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'EmployeeDB',
    multipleStatements: true  //To allow multiple statement
});


mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

//Start the express server
app.listen(3000, () => console.log('Express server is running at port no. : 3000'));

//GET operation
app.get('/employees', (req, res) => {
    mysqlConnection.query('select * from employee', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            res.send(err);
    })
});


//GET perticular data operation
app.get('/employees/:id', (req, res) => {
    mysqlConnection.query('select * from employee where empId = ?',[req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            res.send(err);
    })
});

//DELETE perticular data operation
app.delete('/employees/:id', (req, res) => {
    mysqlConnection.query('delete from employee where empId = ?',[req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Employee deleted successfully.');
        else
            res.send(err);
    })
});

//Insert an employee operation
app.post('/employees', (req, res) => {
    let emp = req.body;
    var sql = "insert into employee(empId,name,empCode,salary) values (?,?,?,?)";
    mysqlConnection.query(sql, [emp.empId, emp.name, emp.empCode, emp.salary], (err, result) => {
        if (!err)
           res.send('Employee inserted successfully : '+ result);
        else
            res.send(err);
    })
});

//Update an employee data operation
app.put('/employees', (req, res) => {
    let emp = req.body;
    var sql = "update employee set name=?,empCode=?,salary=? where empId = ?";
    mysqlConnection.query(sql, [emp.name, emp.empCode, emp.salary, emp.empId], (err) => {
        if (!err)
           res.send("Employee updated successfully.");
        else
            res.send(err);
    })
});