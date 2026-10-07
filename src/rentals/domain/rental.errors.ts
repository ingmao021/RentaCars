import { DomainError } from '../../shared/domain/domain-error.js';

export class RentalNotFoundError extends DomainError {
  readonly type = 'NOT_FOUND';
  constructor(id: number) {
    super(`La renta con id ${id} no existe`);
  }
}

export class CarNotFoundError extends DomainError {
  readonly type = 'NOT_FOUND';
  constructor(id: number) {
    super(`El carro con id ${id} no existe`);
  }
}

export class CustomerNotFoundError extends DomainError {
  readonly type = 'NOT_FOUND';
  constructor(id: number) {
    super(`El cliente con id ${id} no existe`);
  }
}

export class InvalidRentalDatesError extends DomainError {
  readonly type = 'VALIDATION';
  constructor() {
    super('La fecha de fin debe ser posterior a la fecha de inicio');
  }
}

export class LicenseExpiredError extends DomainError {
  readonly type = 'VALIDATION';
  constructor() {
    super('La licencia del cliente vence antes de terminar la renta');
  }
}

export class CarNotAvailableError extends DomainError {
  readonly type = 'CONFLICT';
  constructor(reason: string) {
    super(`El carro no está disponible: ${reason}`);
  }
}

export class InvalidRentalStatusError extends DomainError {
  readonly type = 'CONFLICT';
  constructor(action: string, status: string) {
    super(`No se puede ${action} una renta en estado ${status}`);
  }
}
