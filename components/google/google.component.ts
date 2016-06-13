import { Component,OnInit,Input } from '@angular/core';
import { URLSearchParams,HTTP_PROVIDERS } from '@angular/http';

import { GoogleService } from './google.service';


/**
 * Configration literal used for creating instance of GoogleConfig.
 */
export interface GoogleConfigLiteral {
	/**
	 * JavaScript applications should use token.
	 * This tells the Google Authorization Server to return the access token in the fragment.
	 */
	response_type ?: string;

	/**
	 *  Identifies the client that is making the request.
	 * 	The value passed in this parameter must exactly match the value shown in the Google Developers Console.
	 */
	client_id : string;

	/**
	 * A cryptographically strong random string that you use to prevent intercepted responses from being reused. 
	 * The Google Authorization Server round-trips this parameter.
	 */
	nonce ?: string;

	/**
	 * Determines where the response is sent. 
	 * The value of this parameter must exactly match one of the values listed for this project in the Google Developers Console 
	 * (including the http or https scheme, case, and trailing '/').
	 */
	redirect_uri : string;

	/**
	 * Identifies the Google API access that your application is requesting.
	 * The values passed in this parameter inform the consent screen that is shown to the user.
	 * There is an inverse relationship between the number of permissions requested and the likelihood of obtaining user consent.
	 * Refer for login scopes: https://developers.google.com/+/web/api/rest/oauth#login-scopes.
	 * Also refer Incremental Authorization : https://developers.google.com/identity/protocols/OAuth2WebServer#incrementalAuth.
	 * 
	 * Type : Array of strings.
	 * Default : ["profile","email"].
	 */
	scope ?: string[];

	/**
	 * Provides any state that might be useful to your application upon receipt of the response. 
	 * The Google Authorization Server round-trips this parameter, 
	 * so your application receives the same value it sent. 
	 * Possible uses include redirecting the user to the correct resource in your site, 
	 * and cross-site-request-forgery mitigations.
	 * 
	 * Type : JSON Object.
	 * Default : {}.
	 */
	state ?: Object;

	/**
	 * Space-delimited, case-sensitive list of prompts to present the user. 
	 * If you don't specify this parameter, the user will be prompted only the first time your app requests access.
	 * Possible values : 
	 * 		none : Do not display any authentication or consent screens. Must not be specified with other values.
	 * 		prompt : Prompt the user for consent.
	 * 		select_account : Prompt the user to select an account.
	 * 
	 * Default : ["none"].
	 */
	prompt ?: string[];

	/**
	 * When your application knows which user it is trying to authenticate, 
	 * it can provide this parameter as a hint to the Authentication Server. 
	 * Passing this hint will either pre-fill the email box on the sign-in form or select the proper multi-login session, 
	 * thereby simplifying the login flow.
	 * email address or sub identifier.
	 */
	login_hint ?: string;

	/**
	 * If this is provided with the value true, and the authorization request is granted,
	 * the authorization will include any previous authorizations granted to this user/application combination for other scopes.
	 * See : Incremental Authorization : https://developers.google.com/identity/protocols/OAuth2WebServer#incrementalAuth.
	 * 
	 * Default : false.
	 */
	include_granted_scopes ?: boolean;
}

/**
 * Configration class implementing GoogleConfigLiteral.
 * 
 * "new" this class, update 'client_id' and 'redirect_uri', pass it to the GoogleAuth component.
 */
export class GoogleConfig implements GoogleConfigLiteral{
	response_type = "token"
	client_id = null;
	nonce = null;
	redirect_uri = null;
	scope = ["profile","email"];
	state = {};
	prompt = [];
	login_hint = null;
	include_granted_scopes = false;

	constructor(){
		this.nonce = this.nonce_generator(32);
	}

	/**
	 * Generates 32 character long nonce string.
	 */
	private nonce_generator(length : number) : string {
		let text : string = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for(var i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	/**
	 * Checks validity of configration object,that client_id is not null. Returns 'false' if either is null. 
	 */
	public is_valid = {
		clean_client_id : () : boolean => {
			if ( this.client_id ) {
				return true;
			}
			else {
				console.error("The client_id in configration object cannot be null",{ config : this });
				return false;
			}
		},

		clean_redirect_uri : () : boolean => {
			if ( this.redirect_uri ) {
				return true;
			}
			else {
				console.error("The redirect_uri in configration object cannot be null",{ config : this });
				return false;
			}
		},

		init : () : boolean => {
			let chk_a = this.is_valid.clean_client_id();
			let chk_b = this.is_valid.clean_redirect_uri();

			if (chk_a && chk_b) {
				return true;
			}

			else {
				return false;
			}
		}
	}
	
	/**
	 * Returns URLSearchParams object or null (if invalid config object), containing all the required non null URL configration.
	 */
	public get url_params () : URLSearchParams {
		if ( !this.is_valid.init() ) {
			console.error("Invalid Configration object.",{ config : this });
			return null;
		}

		let params = new URLSearchParams();

		params.set("response_type",this.response_type);
		params.set("client_id",this.client_id);
		// params.set("nonce",this.nonce ? this.nonce : "");
		params.set("redirect_uri",this.redirect_uri);
		params.set("scope",this.scope.join(" "));
		params.set("state",JSON.stringify(this.state));
		params.set("prompt",this.prompt.join(" "));
		params.set("include_granted_scopes",this.include_granted_scopes.toString());
		if ( this.login_hint ) { params.set("login_hint",this.login_hint); };

		return params;
	}
}


/**
 * GoogleAuth component class.
 * 
 * 'import' this class, add to 'directives', and use the component.
 */
@Component({
	selector: 'ng-google-auth',
	template: '<div (click)="login_click()"><ng-content></ng-content></div>',
	providers: [ GoogleService , HTTP_PROVIDERS ]
})
export class GoogleAuth implements OnInit{
	/**
	 * The Config object is taken as input of the component.
	 */
	@Input() config : GoogleConfig = null;

	private is_configration_valid : boolean = false;

	constructor( private googleService : GoogleService ){
		if ( !this.config ) {
			this.config = new GoogleConfig();
		}
	}

	ngOnInit(){
		this.is_configration_valid = this.config.is_valid.init();
	}

	/**
	 * Handles Logging users in after click.
	 */
	private login_click() {
		if ( !this.is_configration_valid ) {
			console.error("Invalid Configration object.",{ config : this.config });
			return;
		}

		else {
			let params = this.config.url_params;
			console.log(params);
			this.googleService.login_request( params );
		}
	}
}