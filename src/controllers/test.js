require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const {genericInsert,genericSelect} = require('../database/main');

//create transactions and return the id

const createTransaction = (auth) => {

	return new Promise(async(resolve,reject) => {
		
		try{
			
			let query = 'select version,status from dataplaneapi where status=$1';
			
			let value = ['idle'];
			
			const selectResponse = await genericSelect(query,value);
			
			let version = selectResponse.version;
			
			console.log(selectResponse);
			
			const insertResponse = await genericInsert('insert into dataplaneapi(status) values($1)',['in_progress']);
			
			let opt = {
			
				headers:{
				
					'Content-Type':'application/json',
					
					'Authorization':`Basic ${auth}`
				},
				
				method:'POST'
			}
			
			let response = await fetch(`${process.env.DATA_PLANE_API}/v2/services/haproxy/transactions?version=${version}`,opt)
			
			console.log(response.status);
			
			if(response.status === 201) {
			
				const result = await response.json();
				
				resolve({id:result.id,version});
			}
			else {
			
				const result = await response.json();
				
				throw {
				  	
				  	code: process.env.OFF_ERR,
				  	
					message: result
				}
			}
		
		}
		catch(err) {
			
			if(err.code && err.code == process.env.USER_ERR){
				console.log('in here')
				setTimeout(async() => {
				
					let response = await createTransaction(auth);
				
					resolve(response);
				},1000);
			
			}
			
			else reject(err.message);
		}
	
	})
}

//create backend

const createBackend = (id,domain_name,auth) => {
	
	return new Promise(async(resolve,reject) => {
	
		try{
			
			const opt = {
			
				headers:{
				
					'Content-Type':'application/json',
					
					'Authorization':`Basic ${auth}`
				},
				
				method:'POST',
				
				body:JSON.stringify({
					
					name:`${domain_name}`,
						
					mode:'http',	
				
				})
			}
			
			const response = await fetch(`${process.env.DATA_PLANE_API}/v2/services/haproxy/configuration/backends?transaction_id=${id}`,opt); 
			console.log(response.status)
			
			const result = await response.json()
			
			console.log(result)
			if(response.status === 202) {
			 	
			 	resolve(domain_name);
			
			
			}
			else {
				const result = await response.json();
				
				throw {
					message:result
				}
				
			}
		
		
		}catch(err) {
		
			reject(err.message);
		}
	
	
	
	})

}

//create server

const createServer = (id,domain_name,auth) => {

	return new Promise(async(resolve,reject) => {
	
	
		try{
		
			const opt = {
			
				headers:{
					
					'Content-Type':'application/json',
						
					'Authorization':`Basic ${auth}`
			
				},
					
				method:'POST',
							
				body:JSON.stringify({
							
					name:'server1',
								
					address:`${domain_name}`,
								
					port:80	
						
						
				})
			
			}
			
			const response = await fetch(`${process.env.DATA_PLANE_API}/v2/services/haproxy/configuration/servers?backend=${domain_name}&transaction_id=${id}`,opt);
			
			console.log(response.status);
			
			if(response.status === 202) {
			
				console.log('hererr')
				resolve(domain_name);
			}
			else {
			
				const result = await response.json();
				
				throw {
				
					message:result
				}
				
			}
		}catch(err) {
			
			reject(err.message)
		
		}
		
	
	
	})


}

//commit transaction

const commit = (id,auth,version) => {
	return new Promise(async(resolve,reject) => {
		console.log('in here')
		try{
		
			let opt = {
						
				headers:{
				
		 			'Content-Type':'application/json',
					
					'Authorization':`Basic ${auth}`
				},
				
							
				method:'PUT',
							
			}
			
			const response = await fetch(`${process.env.DATA_PLANE_API}/v2/services/haproxy/transactions/${id}`,opt);
			
			const insertResponse = await genericInsert('insert into dataplaneapi(version,status) values($1,$2)',[version,'idle']);
			
			console.log(`in commit ${response.status}`);
			
			resolve(true)
		
		}catch(err) {
		
			reject(err.message)
		}
	
	
	
	})


}
//deploy test aka main func

const deployTest = (domain_name) => {

	return new Promise(async(resolve,reject) => {
		
		try{
		
			console.log(process.env.DATA_PLANE_API);
			
			const auth = Buffer.from(process.env.DATA_PLANE_API_CRED).toString('base64');
			
			
			const {id,version} = await createTransaction(auth);
			
			const createBackendResponse = await createBackend(id,domain_name,auth);
			
			const createServerResponse = await createServer(id,domain_name,auth);
						
			const commitTransactionResponse = await commit(id,auth,version);
			
			resolve(true);
					
	
						
			
		}catch(err) {
			
			console.log(err);
			
			reject(err.message);
		
		}

	
	})


};

module.exports = deployTest;
