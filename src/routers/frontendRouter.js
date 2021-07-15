const frontendRouter = require('express').Router();
const {tokenChecker,upload,deploy} = require('../controllers/frontendController');

//upload url
frontendRouter.post('/upload',tokenChecker,upload,deploy,(req,res) => {

	return res.status(200).json({
	
		message:'successfully uploaded'
	})
})

module.exports = frontendRouter;
