import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/routes';
import authetication from './middleware/authetication';

require("dotenv").config({ path: './config/homolog.env' });

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', authetication, routes);


app.listen(port, (err) => {
    if(err){
        throw new Error("Error to create server ", err);
    }else{
        console.warn("Server is running on port ", port);
    }
})