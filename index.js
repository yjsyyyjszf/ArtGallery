const express = require('express');
const clientRouter = require('./server/routes/route');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

const www = process.env.WWW || './';
app.use(express.static(www));

console.log(`serving ${www}`);

app.get('/', (req, res) => {
    
    res.sendFile(path.resolve('./public/pages/index.html'));
});

app.use(/*route*/ '/', /*router*/ clientRouter);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
