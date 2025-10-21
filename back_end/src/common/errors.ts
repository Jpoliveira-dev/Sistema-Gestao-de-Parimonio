export class DomainError extends Error {
  statusCode = 400;
  constructor(message: string, code = 400) {
    super(message);
    this.statusCode = code;
  }
}
export class NotFoundError extends DomainError {
  constructor(msg = 'Não encontrado') { super(msg, 404); }
}
export class ConflictError extends DomainError {
  constructor(msg = 'Conflito') { super(msg, 409); }
}
