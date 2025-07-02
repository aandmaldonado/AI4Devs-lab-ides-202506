import { PrismaClient } from '@prisma/client';
import Database from '../config/database';
import logger from '../config/logger';
import fs from 'fs';
import path from 'path';

/**
 * Script para poblar la base de datos con datos dummy realistas
 * Utiliza datos variados y realistas para testing y desarrollo
 */

const prisma = Database.getInstance();

// Leer el PDF de ejemplo para el primer candidato
const sampleCVPath = path.join(__dirname, '../../prisma/sample_cv.pdf');
let sampleCVBuffer: Buffer | undefined = undefined;
try {
  sampleCVBuffer = fs.readFileSync(sampleCVPath);
} catch (e) {
  console.warn('No se pudo leer sample_cv.pdf, el primer candidato no tendrá CV de ejemplo.');
}

// Datos dummy realistas para candidatos
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
    cvNombre: sampleCVBuffer ? 'sample_cv.pdf' : undefined
  },
  {
    documento: "X1234567",
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@gmail.com",
    telefono: "+34 622 111 222",
    direccion: "Avenida Diagonal 456, Barcelona, España",
    educacion: "Ingeniería Industrial - UPC (2017)",
    experiencia: "Ingeniero de procesos en Seat (2018-2023)"
  },
  {
    documento: "98765432Z",
    nombre: "Lucía",
    apellido: "Martínez",
    email: "lucia.martinez@gmail.com",
    telefono: "+34 633 222 333",
    direccion: "Gran Vía 789, Valencia, España",
    educacion: "Psicología - Universidad de Valencia (2019)",
    experiencia: "Psicóloga clínica en Hospital La Fe (2020-2023)"
  },
  {
    documento: "Y7654321",
    nombre: "Carlos",
    apellido: "Sánchez",
    email: "carlos.sanchez@gmail.com",
    telefono: "+34 644 333 444",
    direccion: "Calle Real 101, Sevilla, España",
    educacion: "Derecho - Universidad de Sevilla (2016)",
    experiencia: "Abogado en despacho propio (2017-2023)"
  },
  {
    documento: "M1234567",
    nombre: "Ana",
    apellido: "López",
    email: "ana.lopez@gmail.com",
    telefono: "+34 655 444 555",
    direccion: "Paseo de la Castellana 202, Madrid, España",
    educacion: "ADE - Universidad Autónoma de Madrid (2015)",
    experiencia: "Consultora en Deloitte (2016-2023)"
  },
  {
    nombre: "Luis",
    apellido: "Fernández",
    email: "luis.fernandez@hotmail.com",
    telefono: "+34 645 678 901",
    direccion: "Calle Gran Vía 89, Sevilla, España",
    educacion: "Medicina - Universidad de Sevilla (2016)",
    experiencia: "Médico Residente en Hospital Virgen del Rocío (2017-2023)"
  },
  {
    nombre: "Isabel",
    apellido: "López",
    email: "isabel.lopez@protonmail.com",
    telefono: "+34 656 789 012",
    direccion: "Paseo de la Castellana 234, Madrid, España",
    educacion: "Marketing Digital - IE Business School (2020)",
    experiencia: "Marketing Manager en Coca-Cola (2021-2023)"
  },
  {
    nombre: "Miguel",
    apellido: "Sánchez",
    email: "miguel.sanchez@icloud.com",
    telefono: "+34 667 890 123",
    direccion: "Carrer de Balmes 156, Barcelona, España",
    educacion: "Arquitectura - Universitat Politècnica de Catalunya (2018)",
    experiencia: "Arquitecto en estudio Foster + Partners (2019-2023)"
  },
  {
    nombre: "Carmen",
    apellido: "Pérez",
    email: "carmen.perez@live.com",
    telefono: "+34 678 901 234",
    direccion: "Calle Sierpes 78, Sevilla, España",
    educacion: "Periodismo - Universidad de Sevilla (2017)",
    experiencia: "Periodista en El País (2018-2023), Especializada en tecnología"
  },
  {
    nombre: "Javier",
    apellido: "García",
    email: "javier.garcia@aol.com",
    telefono: "+34 689 012 345",
    direccion: "Avenida Diagonal 567, Barcelona, España",
    educacion: "Física - Universitat de Barcelona (2019)",
    experiencia: "Investigador en CERN (2020-2023), Especializado en física de partículas"
  },
  {
    nombre: "Elena",
    apellido: "Moreno",
    email: "elena.moreno@yandex.com",
    telefono: "+34 690 123 456",
    direccion: "Calle de Alcalá 890, Madrid, España",
    educacion: "Psicología - Universidad Complutense de Madrid (2018)",
    experiencia: "Psicóloga Clínica en consulta privada (2019-2023)"
  },
  {
    nombre: "David",
    apellido: "Jiménez",
    email: "david.jimenez@mail.com",
    telefono: "+34 601 234 567",
    direccion: "Calle Colón 123, Valencia, España",
    educacion: "Ingeniería Industrial - Universitat Politècnica de València (2017)",
    experiencia: "Project Manager en Siemens (2018-2023)"
  },
  {
    nombre: "Laura",
    apellido: "Ruiz",
    email: "laura.ruiz@fastmail.com",
    telefono: "+34 612 345 678",
    direccion: "Paseo de Gracia 456, Barcelona, España",
    educacion: "Diseño Gráfico - Escola Massana (2019)",
    experiencia: "Diseñadora Senior en Apple (2020-2023)"
  },
  {
    nombre: "Francisco",
    apellido: "Díaz",
    email: "francisco.diaz@tutanota.com",
    telefono: "+34 623 456 789",
    direccion: "Calle de la Princesa 789, Madrid, España",
    educacion: "Economía - Universidad Carlos III (2018)",
    experiencia: "Analista Financiero en Goldman Sachs (2019-2023)"
  },
  {
    nombre: "Sofía",
    apellido: "Hernández",
    email: "sofia.hernandez@zoho.com",
    telefono: "+34 634 567 890",
    direccion: "Calle San Vicente 234, Valencia, España",
    educacion: "Enfermería - Universitat de València (2020)",
    experiencia: "Enfermera en Hospital La Fe (2021-2023)"
  },
  {
    nombre: "Antonio",
    apellido: "Muñoz",
    email: "antonio.munoz@hushmail.com",
    telefono: "+34 645 678 901",
    direccion: "Avenida de la Libertad 567, Málaga, España",
    educacion: "Turismo - Universidad de Málaga (2019)",
    experiencia: "Director de Hotel en Marriott (2020-2023)"
  },
  {
    nombre: "Patricia",
    apellido: "Alonso",
    email: "patricia.alonso@guerrillamail.com",
    telefono: "+34 656 789 012",
    direccion: "Calle Real 890, Granada, España",
    educacion: "Historia del Arte - Universidad de Granada (2018)",
    experiencia: "Conservadora en Museo del Prado (2019-2023)"
  }
].map((c, idx) => ({
  ...c,
  documento: c.documento || `DUMMY${(idx + 1).toString().padStart(3, '0')}`
}));

/**
 * Función principal para ejecutar el seed
 */
async function seed() {
  try {
    logger.info('Iniciando proceso de seed de la base de datos...');

    // Limpiar datos existentes
    await prisma.candidato.deleteMany({});
    logger.info('Datos existentes eliminados');

    // Insertar candidatos dummy
    const candidatosCreados = await prisma.candidato.createMany({
      data: candidatosDummy
    });

    logger.info(`Seed completado exitosamente. ${candidatosCreados.count} candidatos creados.`);

    // Mostrar algunos candidatos creados
    const candidatos = await prisma.candidato.findMany({
      take: 5,
      orderBy: { creadoEn: 'desc' }
    });

    logger.info('Muestra de candidatos creados:', candidatos);

  } catch (error) {
    logger.error('Error durante el proceso de seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar seed si el archivo se ejecuta directamente
if (require.main === module) {
  seed();
}

export default seed; 