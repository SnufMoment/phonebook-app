import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../contact';
import { ContactService } from '../contact.service';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ContactDetailsComponent],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.contactService.getContacts().then((contacts: Contact[]) => {
      this.contacts = contacts.map((contact) => {
        if (!contact.phone) {
          contact.phone = { mobile: '', work: '' };
        }
        return contact;
      });
    });
  }

  selectContact(contact: Contact | null) {
    this.selectedContact = contact;
  }

  createNewContact() {
    const contact: Contact = {
      username: '',
      email: '',
      phone: { work: '', mobile: '' }
    };
    this.selectContact(contact);
  }

  addContact = (contact: Contact) => {
    this.contacts.push(contact);
    this.selectContact(contact);
  }

  updateContact = (contact: Contact) => {
    const idx = this.contacts.findIndex(c => c._id === contact._id);
    if (idx !== -1) {
      this.contacts[idx] = contact;
      this.selectContact(contact);
    }
  }

  deleteContact = (contactId: string) => {
    const idx = this.contacts.findIndex(c => c._id === contactId);
    if (idx !== -1) {
      this.contacts.splice(idx, 1);
      this.selectContact(null);
    }
  }
}
