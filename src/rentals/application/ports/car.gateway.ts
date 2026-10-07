/** Lo único que rentals necesita saber de un carro. */
export interface CarSnapshot {
  id: number;
  pricePerDay: number;
  isActive: boolean;
  inMaintenance: boolean;
}

/**
 * Puerto hacia el módulo de carros (lo construye otro compañero).
 * Mientras tanto se usa InMemoryCarGateway; cuando cars esté listo,
 * se crea un adaptador que use su servicio y se cambia en rentals.module.ts.
 */
export abstract class CarGateway {
  abstract findById(id: number): Promise<CarSnapshot | null>;
  abstract markAsRented(id: number): Promise<void>;
  abstract markAsAvailable(id: number): Promise<void>;
}
