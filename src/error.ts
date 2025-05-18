export class RegistryError {
  public code: string;
  public error: string;

  constructor(error: string, code: string) {
    this.error = error;
    this.code = code;
  }
}
