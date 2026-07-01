import request from "supertest";
import { describe, expect, jest, test, beforeEach } from "@jest/globals";
import { buildTestApp } from "./utils/buildMedicosApp.js";
import { Medico } from "../../domain/medico.js";
import { Usuario } from "../../domain/usuario.js";

describe("Medico API - Integración", () => {
    let app;
    let medicoRepositoryMock;

    beforeEach(() => {
        medicoRepositoryMock = {
            findById: jest.fn(),
            findAll: jest.fn(),
            findByIdUsuario: jest.fn(),
            save: jest.fn(),
        };
        app = buildTestApp(medicoRepositoryMock);
    }
    );

    describe("GET /medicos", () => {
        test("Debería retornar una lista de médicos", async () => {
            const medico1 = new Medico({
                nombre: "Dr. Juan Pérez",
                matricula: "12345",
                usuario: new Usuario({ nombreUsuario: "juanperez", password: "password" }),
                honorario: 5000,
            });
            medico1.id = "1";
            medico1.usuario.id = "6a07ded13b0b9c47c60dde801";

            const medico2 = new Medico({
                nombre: "Dra. María Gómez",
                matricula: "67890",
                usuario: new Usuario({ nombreUsuario: "mariagomez", password: "password" }),
                honorario: 6000,
            });
            medico2.id = "2";
            medico2.usuario.id = "6a07ded13b0b9c47c60dde80";

            const medicos = [medico1, medico2];
            medicoRepositoryMock.findAll.mockResolvedValue(medicos);

            const response = await request(app).get("/medicos");

            console.log("Response body:", response.body); // Agregado para depuración

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                {
                    id: "1",
                    nombre: "Dr. Juan Pérez",
                    matricula: "12345",
                    usuario: {
                        id: "6a07ded13b0b9c47c60dde801",
                        nombreUsuario: "juanperez",
                    },
                    especialidades: [],
                    practicas: [],
                    sedes: [],
                    disponibilidades: [],
                    honorario: 5000
                },
                {
                    id: "2",
                    nombre: "Dra. María Gómez",
                    matricula: "67890",
                    usuario: {
                        id: "6a07ded13b0b9c47c60dde80",
                        nombreUsuario: "mariagomez",
                    },
                    especialidades: [],
                    practicas: [],
                    sedes: [],
                    disponibilidades: [],
                    honorario: 6000
                }
            ]);

        });
    });
});