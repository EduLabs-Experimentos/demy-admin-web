import {SignInResource, SignInResponse} from './sign-in-response';
import {SignInRequest} from './sign-in-request';
import {SignInCommand} from '../domain/model/sign-in.command';

export class SignInAssembler {
  toResourceFromResponse(response: SignInResponse): SignInResource {
    return {
      id: response.id,
      emailAddress: response.emailAddress,
      token: response.token,
    } as SignInResource;
  }

  toRequestFromCommand(command: SignInCommand): SignInRequest {
    return {
      emailAddress: command.emailAddress,
      password: command.password,
    } as SignInRequest;
  }
}
