
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cronJobs = require('./utils/cron_Jobs');

const app = express();

const port = process.env.PORT || 3000;

const config=require('./config/config.json');

const middleware=require('./middleware/middleware')
app.use(middleware);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port, () => {
    console.log(`url-shortener listening on port ${config.app.port}!`);
});