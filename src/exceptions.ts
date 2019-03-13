export class Exception {
  error: boolean = true;
  message: string = "UNKNOWN_ERROR";
  toString() {
    return JSON.stringify(this);
  }
}

export class AuthException extends Exception {
  message: string = "AUTH_EXCEPTION";
}

export class CardIdNotSuppliedException extends Exception {
  message: string = "CARD_ID_NOT_SUPPLIED";
}

export class CardIdNotFoundException extends Exception {
  message: string = "CARD_ID_NOT_FOUND";
}

export class ClientIdNotFoundException extends Exception {
  message: string = "CLIENT_ID_NOT_FOUND";
}