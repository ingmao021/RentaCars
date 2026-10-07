/** Convierte un Date a 'YYYY-MM-DD' (formato de las columnas date de PostgreSQL). */
export const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10);
