const express = require('express');


const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Add a route to handle users request not supported by the app, this route will overwrite all other orutes make usre it is the last one
app.use((req, res) => {
    res.status(404).end();
});



// add function to start the express.js server on port 3001
app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});