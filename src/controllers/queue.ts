import { Request, Response } from "express";
import { configDB } from "../config/dbconfig";
import { getConnection, AQ_VISIBILITY_IMMEDIATE, AQ_DEQ_NO_WAIT } from 'oracledb';
import { handleHttp } from "../utils/error.handle";

interface MyObj {
    name: string;
    id: number;
    msj: string
}

const getQueues = async (req: Request, res: Response) => {

    const queueName = "MQTT_BRIDGE_QUEUE";
    console.log('read::getQueues:', queueName);
    let connection;
    let objRes: Array<MyObj> = [];
    try {

        console.log('getQueues::configDB:', configDB);
        connection = await getConnection(configDB);
        const queue = await connection.getQueue(queueName);
        queue.deqOptions.visibility = AQ_VISIBILITY_IMMEDIATE;
        queue.deqOptions.wait = AQ_DEQ_NO_WAIT;//No espere si no hay ningún mensaje disponible.
        //queue.deqOptions.wait = AQ_DEQ_WAIT_FOREVER;//Espere eternamente si no hay ningún mensaje disponible.
        console.log('Dequeuing messages');

        const messages = await queue.deqMany(10);  // wait for a message
        console.log('Dequeued ' + messages.length + ' messages');

        for (const msg of messages) {
            const objetoNuevo: string = msg.payload.toString();

            objRes.push(JSON.parse(objetoNuevo));
            console.log(objetoNuevo);
        }

    } catch (err: any) {
        console.error('err generico: ',err);
        //return res.send(err.message);
        handleHttp(res, err.message);
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
            handleHttp(res, 'query send no row');
        } else {
            //send all employees
            res.send(objRes);
        }
    }
}

export { getQueues };