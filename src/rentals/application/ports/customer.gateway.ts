/** Lo único que rentals necesita saber de un cliente. */
export interface CustomerSnapshot {
  id: number;
  isActive: boolean;
  licenseExpiration: Date;
}

/** Puerto hacia el módulo de clientes (lo construye otro compañero). */
export abstract class CustomerGateway {
  abstract findById(id: number): Promise<CustomerSnapshot | null>;
}
