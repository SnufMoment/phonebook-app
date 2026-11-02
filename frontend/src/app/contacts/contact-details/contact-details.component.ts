import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../contact';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent {
  @Input() contact: Contact | null = null;
  @Input() createHandler!: Function;
  @Input() updateHandler!: Function;
  @Input() deleteHandler!: Function;

  constructor(private contactService: ContactService) { }

  createContact(contact: Contact) {
    this.contactService.createContact(contact).then((newContact: Contact) => {
      this.createHandler(newContact);
    });
  }

  updateContact(contact: Contact) {
    this.contactService.updateContact(contact).then((updatedContact: Contact) => {
      this.updateHandler(updatedContact);
    });
  }

  deleteContact(contactId: string) {
    this.contactService.deleteContact(contactId).then(() => {
      this.deleteHandler(contactId);
    });
  }
}
