import express from "express";
import routes from './routes.js';
import errorHandler from './_middleware/error-handler.js';

import './config/database.js';

const app = express();

app.use(express.json());
app.use(routes); 


app.use(errorHandler);

app.listen(3333, () => console.log("Server is running on PORT 3333")); 