import { Router } from "express";
import { PacienteController } from "../controllers/PacienteController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Paciente:
 *       type: object
 *       properties:
 *         _id: { $ref: '#/components/schemas/ObjectId' }
 *         idUsuario: { $ref: '#/components/schemas/ObjectId' }
 *         dni: { type: integer, minimum: 1000000 }
 *         nombre: { type: string, minLength: 3 }
 *         obraSocial: { $ref: '#/components/schemas/ObjectId' }
 *         plan: { type: string, nullable: true }
 *       required: [idUsuario, dni, nombre]
 */

/**
 *
 * @swagger
 *  tags:
 *      name: Pacientes
 *      description: Gestión de pacientes
 */
export function pacienteRoutes(getController) {
  const router = new Router();
  /**@type {InstanceType<typeof PacienteController>} */
  const pacienteController = getController(PacienteController);

  router
    .route("/")
    // GET /pacientes
    /**
     * @swagger
     * /pacientes:
     *   get:
     *     summary: Listar todos los pacientes
     *     tags: [Pacientes]
     *     responses:
     *       200:
     *         description: Lista de pacientes
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Paciente'
     *       500:
     *         $ref: '#/components/responses/E500'
     */
    .get((req, res, next) => pacienteController.buscarTodos(req, res, next))
    // POST /pacientes
    /**
     * @swagger
     * /pacientes:
     *   post:
     *     summary: Crear un nuevo paciente
     *     tags: [Pacientes]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CrearPacienteBody'
     *     responses:
     *       201:
     *         description: Paciente creado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Paciente'
     *       400:
     *         $ref: '#/components/responses/E400'
     *       500:
     *         $ref: '#/components/responses/E500'
     */
    .post((req, res, next) => pacienteController.crear(req, res, next));

  /**
   * @swagger
   * /pacientes/me:
   *   get:
   *     summary: Obtener el perfil del paciente logueado
   *     description: >
   *       Protegido por JWT (cookie HttpOnly). El ID del usuario se extrae del
   *       token — nunca viaja en la URL. Devuelve el paciente correspondiente
   *       al usuario autenticado, incluyendo su obra social y plan.
   *     tags: [Pacientes]
   *     responses:
   *       200:
   *         description: Perfil del paciente logueado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status: { type: string, example: "success" }
   *                 data:
   *                   $ref: '#/components/schemas/Paciente'
   *       401:
   *         $ref: '#/components/responses/E401'
   *       404:
   *         $ref: '#/components/responses/E404'
   *       500:
   *         $ref: '#/components/responses/E500'
   */
  // IMPORTANTE: /me debe ir ANTES de /:id, de lo contrario Express
  // intentaría parsear "me" como un ObjectId y fallaría la validación Zod.
  router.get("/me", authMiddleware, (req, res, next) =>
    pacienteController.buscarMiPerfil(req, res, next),
  );

  // GET /pacientes/me/turnos
  router.get(
    "/me/turnos",
    authMiddleware,
    requireRole(["PACIENTE"]),
    (req, res, next) => pacienteController.buscarMisTurnos(req, res, next),
  );

  router
    .route("/:id")
    // GET /pacientes/:id
    /**
     * @swagger
     * /pacientes/{id}:
     *   get:
     *     summary: Obtener paciente por ID
     *     tags: [Pacientes]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     responses:
     *       200:
     *         description: Paciente encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Paciente'
     *       400:
     *         $ref: '#/components/responses/E400'
     *       404:
     *         $ref: '#/components/responses/E404'
     *       500:
     *         $ref: '#/components/responses/E500'
     */
    .get((req, res, next) => pacienteController.buscarPorId(req, res, next))
    // PUT /pacientes/:id
    /**
     * @swagger
     * /pacientes/{id}:
     *   put:
     *     summary: Actualizar paciente
     *     tags: [Pacientes]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ActualizarPacienteBody'
     *     responses:
     *       200:
     *         description: Paciente actualizado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Paciente'
     *       400:
     *         $ref: '#/components/responses/E400'
     *       404:
     *         $ref: '#/components/responses/E404'
     *       500:
     *         $ref: '#/components/responses/E500'
     */
    .put((req, res, next) => pacienteController.modificar(req, res, next))
    // DELETE /pacientes/:id
    /**
     * @swagger
     * /pacientes/{id}:
     *   delete:
     *     summary: Eliminar paciente
     *     tags: [Pacientes]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     responses:
     *       200:
     *         description: Paciente eliminado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Paciente'
     *       404:
     *         $ref: '#/components/responses/E404'
     *       500:
     *         $ref: '#/components/responses/E500'
     */
    .delete((req, res, next) => pacienteController.eliminar(req, res, next));

  return router;
}