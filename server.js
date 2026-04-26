require('dotenv').config();
const express = require('express');
const path    = require('path');
const app     = express();

app.use(express.static(__dirname));
app.use('/api/kural',     require('./api/kural'));
app.use('/api/adhikaram', require('./api/adhikaram'));

app.listen(3002, () => console.log('திருக்குறள் கேள் → http://localhost:3002'));
