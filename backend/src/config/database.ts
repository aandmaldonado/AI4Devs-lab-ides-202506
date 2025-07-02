import { PrismaClient } from '@prisma/client';

/**
 * Cliente de Prisma para acceso a la base de datos
 * Implementa el patrón Singleton para evitar múltiples conexiones
 */
class Database {
  private static instance: PrismaClient;

  /**
   * Obtiene la instancia única del cliente Prisma
   * @returns Instancia de PrismaClient
   */
  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });
    }
    return Database.instance;
  }

  /**
   * Cierra la conexión a la base de datos
   * Útil para tests y cierre limpio de la aplicación
   */
  public static async disconnect(): Promise<void> {
    if (Database.instance) {
      await Database.instance.$disconnect();
    }
  }
}

export default Database; 