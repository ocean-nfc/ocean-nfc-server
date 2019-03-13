export class Exception {
  message: string = "UNKNOWN_ERROR";
  code: number = HTTP_CODE.UNKNOWN;
  toString() {
    return JSON.stringify({
      message: this.message
    });
  }
}

export class AuthException extends Exception {
  message: string = "AUTH_EXCEPTION";
  code: number = HTTP_CODE.AUTHENTICATION;
}

export class NotAllParamsSuppliedException extends Exception {
  message: string = "PARAMS_NOT_SUPPLIED";
  code: number = HTTP_CODE.BAD_REQUEST;
}

export class ClientIdNotFoundException extends Exception {
  message: string = "CLIENT_ID_NOT_FOUND";
  code: number = HTTP_CODE.NOT_FOUND;
}

export enum HTTP_CODE {
  AUTHENTICATION = 401,
  NOT_FOUND = 404,
  UNKNOWN = 500,
  BAD_REQUEST = 400
};