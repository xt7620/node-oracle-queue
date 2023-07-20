'use strict';

const fs = require('fs');
const express = require('express')
const oracledb = require('oracledb');
const dbConfig = require('./config/dbconfig.js');
const app = express();
const port = 3000;

let clientOpts = {};
if (process.platform === 'win32') {                                   // Windows
    clientOpts = { libDir: 'C:\\Users\\jmorenle\\instantclientx64_19_19' };
} else if (process.platform === 'darwin') { // macOS Intel
    clientOpts = { libDir: '/usr/lib/oracle/19.3/client64/' };
} // else on other platforms the system library search path
  // must always be set before Node.js is started.
  console.log('clientOpts: ', clientOpts);
// enable Thick mode which is needed for SODA
oracledb.initOracleClient(clientOpts);

async function selectAllEmployees(req, res) {
  
  let connection;
  let objRes = [];
  try {
    connection = await oracledb.getConnection(dbConfig);

    console.log('connected to database');
    // run query to get all employees
    const result = await connection.execute(`SELECT * FROM employees`,
      [], // no bind variables
      {
        resultSet: true,             // return a ResultSet (default is false)
        // fetchArraySize: 100       // internal buffer allocation size for tuning
      }
    );
    
    const rs = result.resultSet;
    let row;
    let i = 1;
    console.log('result', rs);
    while ((row = await rs.getRow())) {
      console.log("getRow(): row " + i++);
      console.log(row);
      objRes.push(row);
    }
    await rs.close();
    //const rs = result.resultSet;
  } catch (err) {
    //send error message
    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        // Always close connections
        await connection.close();
        console.log('close connection success');
      } catch (err) {
        console.error(err.message);
      }
    }
    console.log('objRes: ', objRes);
    if (objRes.length == 0) {
      //query return zero employees
      return res.send('query send no rows');
    } else {
      //send all employees
      return res.send(objRes);
    }
  }
}

//get /employess
app.get('/employees', function (req, res) {
  selectAllEmployees(req, res);
})

async function selectQueue(req, res) {
  const queueName = "MQTT_BRIDGE_QUEUE";

  let connection;
  let objRes = [];
  try {
    connection = await oracledb.getConnection(dbConfig);
    const queue = await connection.getQueue(queueName);
    queue.deqOptions.visibility = oracledb.AQ_VISIBILITY_IMMEDIATE;

    console.log('Dequeuing messages');

    const messages = await queue.deqMany(10);  // wait for a message
    console.log('Dequeued ' + messages.length + ' messages');
    
    for (const msg of messages) {
      const objetoNuevo = msg.payload.toString();

      objRes.push(JSON.parse(objetoNuevo));
      console.log(objetoNuevo);
    }

  } catch (err) {
    console.error(err);
    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        return console.error(err);
      }
    }
    console.log('resultado: ', objRes);
    if (objRes.length == 0) {
      //query return zero employees
      return res.send('query send no rows');
    } else {
      //send all employees
      return res.send(objRes);
    }
  }
}

//get /employee?id=<id employee>
app.get('/queues', function (req, res) {
  selectQueue(req, res);
})

app.listen(port, () => console.log("nodeOracleRestApi app listening on port %s!", port))