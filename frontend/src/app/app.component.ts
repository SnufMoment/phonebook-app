import { Component } from '@angular/core';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContactListComponent],
  template: '<main class="PHONEBOOK_UI"><app-contact-list></app-contact-list></main>'
})
export class AppComponent {}
