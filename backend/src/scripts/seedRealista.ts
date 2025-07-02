/**
 * Script de seed realista para poblar la base de datos ATS con candidatos dummy.
 * Este script crea candidatos con datos variados y realistas, incluyendo CVs de ejemplo.
 * Útil para desarrollo, pruebas y para que cualquier persona que clone el proyecto tenga datos disponibles.
 *
 * Uso:
 *   npx ts-node --transpile-only src/scripts/seedRealista.ts
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import logger from '../config/logger';

const prisma = new PrismaClient();

// Ruta al CV de ejemplo (puedes agregar más archivos en la carpeta prisma/)
const sampleCVPath = path.join(__dirname, '../../prisma/sample_cv.pdf');
let sampleCVBuffer: Buffer | undefined = undefined;
try {
  sampleCVBuffer = fs.readFileSync(sampleCVPath);
} catch (e) {
  logger.warn('No se pudo leer sample_cv.pdf, los candidatos tendrán CV vacío.');
}

// Array de candidatos dummy realistas
const candidatosDummy = [
  {
    documento: "12345678A",
    nombre: "María",
    apellido: "González",
    email: "maria.gonzalez@gmail.com",
    telefono: "+34 612 345 678",
    direccion: "Calle Mayor 123, Madrid, España",
    educacion: "Ingeniería Informática - Universidad Politécnica de Madrid (2018)",
    experiencia: "Desarrolladora Full Stack en TechCorp (2019-2023), Especializada en React y Node.js",
    cv: sampleCVBuffer,
    cvNombre: sampleCVBuffer ? 'cv_maria.pdf' : undefined
  },
  {
    documento: "X1234567",
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@gmail.com",
    telefono: "+34 622 111 222",
    direccion: "Avenida Diagonal 456, Barcelona, España",
    educacion: "Ingeniería Industrial - UPC (2017)",
    experiencia: "Ingeniero de procesos en Seat (2018-2023)",
    cv: sampleCVBuffer,
    cvNombre: sampleCVBuffer ? 'cv_juan.pdf' : undefined
  },
  {
    documento: "98765432Z",
    nombre: "Lucía",
    apellido: "Martínez",
    email: "lucia.martinez@gmail.com",
    telefono: "+34 633 222 333",
    direccion: "Gran Vía 789, Valencia, España",
    educacion: "Psicología - Universidad de Valencia (2019)",
    experiencia: "Psicóloga clínica en Hospital La Fe (2020-2023)",
    cv: undefined,
    cvNombre: undefined
  },
  {
    documento: "Y7654321",
    nombre: "Carlos",
    apellido: "Sánchez",
    email: "carlos.sanchez@gmail.com",
    telefono: "+34 644 333 444",
    direccion: "Calle Real 101, Sevilla, España",
    educacion: "Derecho - Universidad de Sevilla (2016)",
    experiencia: "Abogado en despacho propio (2017-2023)",
    cv: undefined,
    cvNombre: undefined
  },
  {
    documento: "M1234567",
    nombre: "Ana",
    apellido: "López",
    email: "ana.lopez@gmail.com",
    telefono: "+34 655 444 555",
    direccion: "Paseo de la Castellana 202, Madrid, España",
    educacion: "ADE - Universidad Autónoma de Madrid (2015)",
    experiencia: "Consultora en Deloitte (2016-2023)",
    cv: sampleCVBuffer,
    cvNombre: sampleCVBuffer ? 'cv_ana.pdf' : undefined
  },
  // Puedes agregar más candidatos con datos variados aquí
];

async function seed() {
  try {
    logger.info('Iniciando proceso de seed realista de la base de datos...');

    // Eliminar todos los candidatos existentes para evitar duplicados
    await prisma.candidato.deleteMany({});
    logger.info('Datos existentes eliminados');

    // Insertar candidatos dummy
    for (const candidato of candidatosDummy) {
      // Si el email ya existe, omitir para evitar errores únicos
      const exists = await prisma.candidato.findUnique({ where: { email: candidato.email } });
      if (!exists) {
        await prisma.candidato.create({ data: candidato });
        logger.info(`Candidato creado: ${candidato.nombre} ${candidato.apellido}`);
      } else {
        logger.warn(`Candidato con email ${candidato.email} ya existe, omitido.`);
      }
    }

    logger.info('Seed realista completado exitosamente.');
  } catch (error) {
    logger.error('Error durante el proceso de seed realista:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si el script se llama directamente
if (require.main === module) {
  seed();
} 