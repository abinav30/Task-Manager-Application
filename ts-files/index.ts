import express from 'express'
import {router1}  from "./routers/user"
import{taskRouter} from "./routers/task";

import bodyParser from 'body-parser'

let useBodyParser:NextHandleFunction=bodyParser.json();
const app :express.Application=express();
import './db/mongodb'


import { NextHandleFunction } from 'connect';

const port = process.env.PORT || 3000;

app.use(useBodyParser);

app.use(router1);
app.use(taskRouter);



app.listen(port, ()=>{
    console.log('server running on'+ port)
});


