import { Component,OnInit,Input } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { GoogleAuthService,GoogleLoadAPIService } from './google.service';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: "ng-social-google",
	templateUrl: "app/google/google.component.html",
	inputs: ['clientID'],
	providers: [
			GoogleAuthService,
			GoogleLoadAPIService,
			HTTP_PROVIDERS
		]
})

export class GoogleSocialComponent implements OnInit{
	@Input()
	clientID
	
	constructor(
		private googleAuthService : GoogleAuthService,
		private googleLoadAPIService : GoogleLoadAPIService
	){}
	
	ngOnInit(){
		this.googleLoadAPIService.loadAPI().then(()=>{this._onAPILoaded()});
	}
	
	private _onAPILoaded(){
		gapi.load('auth2',()=>{
			var auth2 = gapi.auth2.init({
				client_id: this.clientID,
				scope: 'profile'
			});
		});
	}
}
