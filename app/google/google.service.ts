import { Injectable } from '@angular/core';
import { Http,Response,Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GoogleLoadAPIService{
	private _scriptLoadingPromise: Promise<void>;
	
	loadAPI(): Promise<void>  {
		if (this._scriptLoadingPromise) {
			return this._scriptLoadingPromise;
		}

		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.async = true;
		script.defer = true;
		const callbackName: string = "";
		script.src = "https://apis.google.com/js/platform.js?onload="+callbackName;

		this._scriptLoadingPromise = new Promise<void>((resolve: Function, reject: Function) => {
			(<Window>window)[callbackName] = () => { resolve(); };
			script.onerror = (error: Event) => { reject(error); };
		});

		document.body.appendChild(script);
		return this._scriptLoadingPromise;
	}
}

@Injectable()
export class GoogleAuthService{

	constructor(
		private http : Http
	){}

	getAuthInstance(){
		return gapi.auth2.getAuthInstance();
	}
}
