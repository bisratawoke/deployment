const express = require('express');
const app = express();
const cors = require('cors');
const fileupload = require('express-fileupload');
require('dotenv').config();

//express middlewares
app.use(express.json());

app.use(fileupload({
	
    useTempFiles:true,

    tempFileDir:'/tmp/',

    createParentPath:true

}));

//health check url
app.use('/api/deploy/test',(req,res) => {

	return res.status(200).json({
	
		message:'hello world'
	})
})
//adding frontend router
const frontendRouter = require('./src/routers/frontendRouter');

app.use('/api/deploy',frontendRouter);
//starting server

app.listen(process.env.PORT,() => console.log(`Server started on port ${process.env.PORT}`));


