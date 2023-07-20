import "dotenv/config";
import { Router } from "express";
import { getQueues } from "../controllers/queue";
import { initOracleClient } from 'oracledb';

const router = Router();

if (process.env.NODE_ORACLEDB_DRIVER_MODE === 'thick') {
  let clientOpts = {};
  if (process.platform === 'win32') {                                   // Windows
    clientOpts = { libDir: 'C:\\Users\\jmorenle\\instantclientx64_19_19' };
  } else if (process.platform === 'darwin') { // macOS Intel
    clientOpts = { libDir: '/usr/lib/oracle/19.3/client64/' };
  } // else on other platforms the system library search path
  // must always be set before Node.js is started.
  console.log('clientOpts: ', clientOpts);
  // enable Thick mode which is needed for SODA
  initOracleClient(clientOpts);
}

// http://localhost:3000/items [GET|POST|DELETE|PUT]
router.get('/queues', getQueues);

export { router };
