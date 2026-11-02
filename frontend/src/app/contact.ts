export class Contact {
  _id?: string;
  username: string = '';
  email: string = '';
  phone: {
    mobile: string;
    work: string;
  } = { mobile: '', work: '' };
}
