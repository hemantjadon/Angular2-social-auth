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
	
	private auth2 = undefined;
	
	private GoogleAuth = undefined;
	
	private isSignedIn : boolean = false;
	
	private user = undefined;
	
	private _onAPILoaded(){
		gapi.load('auth2',()=>{  //Need To move this to service  ===> Learn to do so
			this.auth2 = gapi.auth2.init({
				client_id: this.clientID,
				scope: 'profile'
			}).then(
					this._onAuth2Init.bind(this), //Binding this so that it can be accessed by function
					function(error : string){ console.log(error); }
				);
		});
	}
	private _onAuth2Init(){
		this.GoogleAuth = this.googleAuthService.getAuthInstance(); //Move To Service
		this.isSignedIn = this.GoogleAuth.isSignedIn.get();	//Move to service
		if (this.isSignedIn) {
			console.log("Already Signed in : Handle SignIn");
		}
	}
	
	private _loginClick($event){
		try {
			gapi
		}
		catch (ReferenceError){
			console.log("gapi not loaded yet");
			return;
		}
		
		if (gapi.auth2 === undefined) {
			console.log("gapi.auth2 not inited yet");
			return;
		}
		
		else {
			if (this.isSignedIn) {
				console.log("Already Signed in : Handle SignIn");
			}
			
			else {
				this.GoogleAuth..then(()=>{
					console.log(this.GoogleAuth.currentUser.get().getId());
				});
			}
		}
	}	
}
