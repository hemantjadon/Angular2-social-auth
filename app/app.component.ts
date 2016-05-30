import { Component } from '@angular/core';
import { GoogleSocialComponent } from './google/google.component';

@Component({
	selector: "ng-social",
	template: `<h1>My Angular App</h1>
		<ng-social-google></ng-social-google>
	`,
	directives: [GoogleSocialComponent]
	
})

export class AppComponent{
	
}