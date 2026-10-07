import { Injectable } from '@nestjs/common';
import { CustomerGateway, CustomerSnapshot } from '../../application/ports/customer.gateway.js';

/**
 * Adaptador TEMPORAL con clientes de prueba, para trabajar sin esperar
 * al módulo de customers. Reemplazarlo cuando customers esté listo.
 */
@Injectable()
export class InMemoryCustomerGateway extends CustomerGateway {
  private readonly customers = new Map<number, CustomerSnapshot>([
    [1, { id: 1, isActive: true, licenseExpiration: new Date('2029-12-31') }],
    [2, { id: 2, isActive: true, licenseExpiration: new Date('2024-01-01') }], // licencia vencida
  ]);

  async findById(id: number): Promise<CustomerSnapshot | null> {
    return this.customers.get(id) ?? null;
  }
}
