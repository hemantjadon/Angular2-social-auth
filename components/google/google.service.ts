import { Injectable } from '@angular/core';
import { Http,URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GoogleService {

	constructor( private http : Http ) 
	{ }

	public login_request( params : URLSearchParams ){
		let url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
		window.addEventListener('load', function (event) {
			var code = event.timeStamp;
			console.log(code);
		});
		window.open(url,"target");
	}
}