/**
 * Command object for user sign-in operations in the domain layer of the IAM bounded context.
 * Contains the email address and password for authentication.
 */
export class SignInCommand {
  private _emailAddress: string;
  private _password: string;

  constructor(resource: {emailAddress: string, password: string}) {
    this._emailAddress = resource.emailAddress;
    this._password = resource.password;
  }

  get emailAddress(): string { return this._emailAddress; }
  set emailAddress(value: string) { this._emailAddress = value; }
  get password(): string { return this._password; }
  set password(value: string) { this._password = value; }
}
