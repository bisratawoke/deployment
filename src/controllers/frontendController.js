const fetch = require('node-fetch');
const path = require('path');
const {spawn} = require('child_process');
const deployTest = require('./test');

//check authenticity of the token
//make api call to account app 
const tokenChecker = async(req,res,next) => {
	
	if(req.headers['authorization']){
		
		try{
		
		
			const token = req.headers['authorization'].split(' ')[1];
				
			console.log(token);
		
			//request options
			const opt = {
			
				headers:{
				
					'authorization':`token ${token}`
					
				},
				
				method:'GET'
				
			}
			
			//making api call
			console.log(`dn ${process.env.AUTH_SERVICE_HOST}`)
			const response = await fetch(`${process.env.AUTH_SERVICE_HOST}/api/account/service/check`,opt)
			
			if(response.status === 200) {
				
				console.log('success')
				
				res.userInfo = await response.json()
				
				console.log(res.userInfo);
				
				return next();
				
			
			}
			
			else if (response.status === 500){
			
				throw {type:process.env.OFF_ERR,message:'server crashed'}
				
			}
			
			else throw {type:process.env.USER_ERR,message:'NOT AUTHENTICATED'}
			
			return next();
		
		}
		catch(err) {
			
			console.log(err);
			if(err.type === process.env.OFF_ERR){
			
				return res.status(500).json({message:err.message})
			
			}
			
			return res.status(401).json({message:err.message})
		
		}
		
	}
		
		
	
	return res.status(400).json({
	
		message:'[BAD REQUEST]'
	})



}

//upload
const upload = (req,res,next) => {

	if(req.query.proj_pub_id && req.query.dn) {
		
		if(req.files){
		
		
			const {proj_pub_id,dn} = req.query;
			
			console.log(req.query);
			
			console.log(req.files);
			
			let uploadPath = null;
			
			
			for(dir in req.files) {
			
				console.log(dir);
				
				let d = dir.split('/')
				
				dr = d.slice(1);
				
				d = dr.join('/');
				
				
				uploadPath = path.join(process.env.BASE_DIR_DOCKER,`/${req.query.dn}/files/${d}`);
				
				let file  = req.files[dir];
				
				file.mv(uploadPath,(err) => {
				
					if(err) {
					
						return res.status(500).json({
						
						
							message:`failed to upload ${err.message}`
						})
					}
				
				})
				
				console.log(uploadPath);
			}
			
			
			
			return next();
			
			
	
		}
		else {
		
			return res.status(400).json({
			
				message: '[BAD REQUEST] missing required files'
			});
		}
		return ;
		
	}else {
	
		return res.status(400).json({
		
		
			message: '[BAD REQUEST] missing required query params'
		})
	}

}

//deploy middle ware

const build = (req,res,next) => {

	if(req.query.proj_pub_id && req.query.dn && req.query.type){
		
		let cmd = null;
		
		if(req.query.type == 'php')  cmd = path.join(__dirname,`/php.sh`);
		
		else if(req.query.type == 'nodejs') cmd = path.join(__dirname,'/node.sh');
		
		else cmd = path.join(__dirname,'/deploy.sh');
		
		const deploy = spawn(cmd,{
		
			cwd:`${process.env.BASE_DIR_DOCKER}/${req.query.dn}`,
		
			env:{
				domain_name: req.query.dn,
				
			}
		});
		
		deploy.on('exit',(code,signal) => {
			
			
		
			if(signal) {
			
				return res.status(500).json({
				
					message:'[SERVER ERROR]failed to deploy'
				});
			}
			else {
			
			
				return next();
			}
		
		});
		
		deploy.stdout.on('data',data => {
		
			console.log(data.toString());
		});
		
		deploy.stderr.on('data', err => {
		
			console.log(err.toString());
		})
	
		return;
	}
	return res.status(400).json({
		
			message: '[BAD REQUEST] missing required query params'
	})


}

//deploy middleware

const deploy = async(req,res,next) => {


	try{
		
		const result = await deployTest(req.query.dn);
		
		console.log(result);
		
		return next();
		
	}catch(err) {
		
		console.log(err);
		
		return res.status(500).json({message:'[SERVER ERROR] Unknown'});
	
	}

	


}
//
module.exports = {

	tokenChecker,
	
	upload,
	
	build,
	
	deploy
}
