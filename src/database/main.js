const Pool = require('pg').Pool;

const opt = {

	host:process.env.PHOST,
	user:process.env.PUSER,
	password:process.env.PPASSWORD,
	port:process.env.PPORT,
	database:process.env.PDATABASE
	
}
const pool = new Pool(opt);


const genericInsert = (query,value) => {

	return new Promise(async(resolve,reject) => {
	
		try{
		
			const response = await pool.query(query,value);
			
			resolve(0);
		
		}catch(err) {
		
			reject({
			
				message:err.message,
				
				code:process.env.OFF_ERR
				
			})
		}
	
	})


}

//

const genericSelect = (query,value) => {


	return new Promise(async(resolve,reject) => {
	
	
		try{
			
			const response = await pool.query(query,value);
			
			if(response.rows.length < 1) reject({
				message:'transaction in progress',
				code:process.env.USER_ERR
			})
			
			else {
			
				resolve(response.rows[0]);
			}
		
		}catch(err) {
		
			reject({
			
				message:err.message,
				
				code:process.env.OFF_ERR
				
			})
		}
		
		
		
		
	
	})



}

//
module.exports = {	
	
	genericSelect,
	
	genericInsert
	
}
