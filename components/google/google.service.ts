import { Injectable } from '@angular/core';
import { Http,URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GoogleService {

	constructor( private http : Http ) 
	{ }

	public login_request( params : URLSearchParams ) : Promise<Object>{
		let url = `https://accounts.google.com/o/oauth2/v2/auth`
		return new Promise<Object>(( resolve : Function , reject : Function )=>{
			this.http.get(url,{ search : params })
					 .toPromise()
					 .then((response) => {
						 console.log(response);
					 });
		});
	}
}