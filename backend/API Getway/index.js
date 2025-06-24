const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require("dotenv").config();
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/', require("./routes"));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
