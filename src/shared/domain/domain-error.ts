export type DomainErrorType = 'NOT_FOUND' | 'VALIDATION' | 'CONFLICT';

/**
 * Error base del dominio. No conoce HTTP: solo dice qué tipo de problema es.
 * El filtro de infraestructura lo traduce al código HTTP correspondiente.
 */
export abstract class DomainError extends Error {
  abstract readonly type: DomainErrorType;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
