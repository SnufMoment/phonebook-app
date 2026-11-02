import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Contact } from '../contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private APIUrl = '/api/contacts';

  constructor(private http: HttpClient) { }

  getContacts(): Promise<Contact[]> {
    return firstValueFrom(this.http.get<Contact[]>(this.APIUrl));
  }

  createContact(newContact: Contact): Promise<Contact> {
    return firstValueFrom(this.http.post<Contact>(this.APIUrl, newContact));
  }

  updateContact(putContact: Contact): Promise<Contact> {
    const putUrl = `${this.APIUrl}/${putContact._id}`;
    return firstValueFrom(this.http.put<Contact>(putUrl, putContact));
  }

  deleteContact(delContactId: string): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.APIUrl}/${delContactId}`));
  }
}
