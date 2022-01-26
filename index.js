//use express
const express = require('express');
const app = express();
const port = 5002;

//it will convert response to json
app.use(express.json());

//used while we PUT or POST
app.use(
    express.urlencoded({
        extended: false,
    })
)

//use cors to communicate between front-end and back-end
const cors = require('cors');
app.use(cors());

//set EJS as templating engine
app.set('view engine', 'ejs');


const countryRouter = require('./routes/countryRouter');
app.use('/api/countries', countryRouter);

//listening to port
app.listen(port, console.log(`Server is listening to port: ${port}`));