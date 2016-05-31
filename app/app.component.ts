import { Component } from '@angular/core';
import { GoogleSocialComponent } from './google/google.component';

@Component({
	selector: "ng-social",
	template: `<h1>My Angular App</h1>
		<ng-social-google clientID="342237072984-f0fgeim126t606190jj4cd3c7lcc62se.apps.googleusercontent.com">
			Sign in with Google .. 
		</ng-social-google>
	`,
	directives: [GoogleSocialComponent]
	
})

export class AppComponent{
	
}