import { Router } from 'express';
import { CandidatoController } from '../controllers/candidatoController';
import multer from 'multer';

/**
 * Router para endpoints de candidatos
 * Implementa rutas RESTful siguiendo las mejores prácticas
 */
const router = Router();
const candidatoController = new CandidatoController();
const upload = multer();

/**
 * @swagger
 * /candidatos:
 *   get:
 *     summary: Obtiene todos los candidatos
 *     tags: [Candidatos]
 *     responses:
 *       200:
 *         description: Lista de candidatos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Candidato'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   success: true
 *                   data:
 *                     - documento: "12345678A"
 *                       nombre: "María"
 *                       apellido: "González"
 *                       email: "maria.gonzalez@gmail.com"
 *                       telefono: "+34 612 345 678"
 *                       direccion: "Calle Mayor 123, Madrid, España"
 *                       educacion: "Ingeniería Informática - Universidad Politécnica de Madrid (2018)"
 *                       experiencia: "Desarrolladora Full Stack en TechCorp (2019-2023)"
 *                       cvNombre: "cv_maria.pdf"
 *                       creadoEn: "2024-06-27T10:00:00.000Z"
 *                       ultimaModificacion: "2024-06-27T10:00:00.000Z"
 *   post:
 *     summary: Crea un nuevo candidato
 *     tags: [Candidatos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *                 example: "12345678A"
 *               nombre:
 *                 type: string
 *                 example: "María"
 *               apellido:
 *                 type: string
 *                 example: "González"
 *               email:
 *                 type: string
 *                 example: "maria.gonzalez@gmail.com"
 *               telefono:
 *                 type: string
 *                 example: "+34 612 345 678"
 *               direccion:
 *                 type: string
 *                 example: "Calle Mayor 123, Madrid, España"
 *               educacion:
 *                 type: string
 *                 example: "Ingeniería Informática - Universidad Politécnica de Madrid (2018)"
 *               experiencia:
 *                 type: string
 *                 example: "Desarrolladora Full Stack en TechCorp (2019-2023)"
 *               cv:
 *                 type: string
 *                 format: binary
 *               cvNombre:
 *                 type: string
 *                 example: "cv_maria.pdf"
 *     responses:
 *       201:
 *         description: Candidato creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Candidato'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   success: true
 *                   data:
 *                     documento: "12345678A"
 *                     nombre: "María"
 *                     apellido: "González"
 *                     email: "maria.gonzalez@gmail.com"
 *                     telefono: "+34 612 345 678"
 *                     direccion: "Calle Mayor 123, Madrid, España"
 *                     educacion: "Ingeniería Informática - Universidad Politécnica de Madrid (2018)"
 *                     experiencia: "Desarrolladora Full Stack en TechCorp (2019-2023)"
 *                     cvNombre: "cv_maria.pdf"
 *                     creadoEn: "2024-06-27T10:00:00.000Z"
 *                     ultimaModificacion: "2024-06-27T10:00:00.000Z"
 */
// POST /candidatos - Crear nuevo candidato
router.post('/', upload.single('cv'), candidatoController.createCandidato.bind(candidatoController));

// GET /candidatos - Obtener todos los candidatos (con filtros opcionales)
router.get('/', candidatoController.getCandidatos.bind(candidatoController));

// GET /candidatos/:documento - Obtener candidato por documento
router.get('/:documento', candidatoController.getCandidatoByDocumento.bind(candidatoController));

// GET /candidatos/:documento/cv - Descargar el CV del candidato
router.get('/:documento/cv', candidatoController.downloadCV.bind(candidatoController));

// PUT /candidatos/:documento - Actualizar candidato existente
router.put('/:documento', upload.single('cv'), candidatoController.updateCandidato.bind(candidatoController));

// DELETE /candidatos/:documento - Eliminar candidato
router.delete('/:documento', candidatoController.deleteCandidato.bind(candidatoController));

/**
 * @swagger
 * /candidatos/detalle:
 *   post:
 *     summary: Obtiene el detalle de un candidato por documento
 *     tags: [Candidatos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *                 example: "12345678A"
 *     responses:
 *       200:
 *         description: Detalle del candidato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Candidato'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   success: true
 *                   data:
 *                     documento: "12345678A"
 *                     nombre: "María"
 *                     apellido: "González"
 *                     email: "maria.gonzalez@gmail.com"
 *                     telefono: "+34 612 345 678"
 *                     direccion: "Calle Mayor 123, Madrid, España"
 *                     educacion: "Ingeniería Informática - Universidad Politécnica de Madrid (2018)"
 *                     experiencia: "Desarrolladora Full Stack en TechCorp (2019-2023)"
 *                     cvNombre: "cv_maria.pdf"
 *                     creadoEn: "2024-06-27T10:00:00.000Z"
 *                     ultimaModificacion: "2024-06-27T10:00:00.000Z"
 */
// POST /detalle - Obtener detalle de candidato por documento (sin exponer en URL)
router.post('/detalle', async (req, res) => {
  const { documento } = req.body;
  if (!documento) {
    return res.status(400).json({ success: false, message: 'Documento requerido' });
  }
  // Usar el controlador existente para obtener el candidato
  const controller = new CandidatoController();
  // Simular req.params para compatibilidad
  req.params = { documento };
  return controller.getCandidatoByDocumento(req, res);
});

/**
 * @swagger
 * /candidatos/descargar-cv:
 *   post:
 *     summary: Descarga el CV de un candidato por documento
 *     tags: [Candidatos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *                 example: "12345678A"
 *     responses:
 *       200:
 *         description: CV descargado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *             examples:
 *               ejemplo:
 *                 summary: PDF de ejemplo
 *                 value: "(binario)"
 */
// POST /descargar-cv - Descargar el CV de un candidato por documento (sin exponer en URL)
router.post('/descargar-cv', async (req, res) => {
  const { documento } = req.body;
  if (!documento) {
    return res.status(400).json({ success: false, message: 'Documento requerido' });
  }
  // Usar el controlador existente para descargar el CV
  const controller = new CandidatoController();
  // Simular req.params para compatibilidad
  req.params = { documento };
  return controller.downloadCV(req, res);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Candidato:
 *       type: object
 *       properties:
 *         documento:
 *           type: string
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         email:
 *           type: string
 *         telefono:
 *           type: string
 *         direccion:
 *           type: string
 *         educacion:
 *           type: string
 *         experiencia:
 *           type: string
 *         cvNombre:
 *           type: string
 *         creadoEn:
 *           type: string
 *           format: date-time
 *         ultimaModificacion:
 *           type: string
 *           format: date-time
 */

export default router; 