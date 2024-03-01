const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors')

const db = require('./config/mongoose')
const User = require('./models/user')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/', require('./routes'));

app.get('/api', (req, res) => {
    res.send("Api")
})

app.listen(port, (err) => {
    if (err) {
        console.log("Error to listen the server", err);
    }

    console.log(`Server is running http://localhost:${port}`);

})
