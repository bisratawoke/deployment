const frontendRouter = require('express').Router();
const {tokenChecker,upload,build,deploy} = require('../controllers/frontendController');

//upload url
frontendRouter.post('/upload',tokenChecker,upload,build,deploy,(req,res) => {

	return res.status(200).json({
	
		message:'successfully uploaded'
	})
})

module.exports = frontendRouter;
