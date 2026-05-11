/**
 * Command object for user sign-up operations in the domain layer of the IAM bounded context.
 * Contains the email address, password, and roles for registration.
 */
export class SignUpCommand {
  private _emailAddress: string;
  private _password: string;
  private _roles: string[];

  /**
   * Creates a new SignUpCommand instance.
   * @param resource An object containing emailAddress, password, and roles.
   */
  constructor(resource: {emailAddress: string, password: string, roles?: string[]}) {
    this._emailAddress = resource.emailAddress;
    this._password = resource.password;
    this._roles = resource.roles || ['ROLE_USER'];
  }

  /**
   * Gets the email address for sign-up.
   * @returns The email address.
   */
  get emailAddress(): string {
    return this._emailAddress;
  }

  /**
   * Sets the email address for sign-up.
   * @param value The email address.
   */
  set emailAddress(value: string) {
    this._emailAddress = value;
  }

  /**
   * Gets the password for sign-up.
   * @returns The password.
   */
  get password(): string {
    return this._password;
  }

  /**
   * Sets the password for sign-up.
   * @param value The password.
   */
  set password(value: string) {
    this._password = value;
  }

  /**
   * Gets the roles for sign-up.
   * @returns The roles array.
   */
  get roles(): string[] {
    return this._roles;
  }

  /**
   * Sets the roles for sign-up.
   * @param value The roles array.
   */
  set roles(value: string[]) {
    this._roles = value;
  }
}