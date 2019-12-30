const express = require('express');
const clientRouter = require('./server/routes/route');
const app = express();
var reload = require('reload')

const port = process.env.PORT || 3000;

const www = process.env.WWW || './';
app.use(express.static(www));

console.log(`serving ${www}`);
app.get('/', (req, res) => {
    res.send('App running...');
});

app.use(/*route*/ '/', /*router*/ clientRouter);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
// console.log(quickstart());
