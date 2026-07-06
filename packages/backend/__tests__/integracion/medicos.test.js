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
            const medicos = [
                new Medico({
                    nombre: "Dr. Juan Pérez",
                    matricula: "12345",
                    usuario: new Usuario({nombreUsuario: "juanperez", password: "password" }),
                    honorario: 5000,
                }),
                new Medico({
                    nombre: "Dra. María Gómez",
                    matricula: "67890",
                    usuario: new Usuario({ nombreUsuario: "mariagomez", password: "password" }),
                    honorario: 6000,
                })
            ];

            medicoRepositoryMock.findAll.mockResolvedValue(medicos);

            const response = await request(app).get("/medicos");

            expect(response.status).toBe(200);

            expect(medicoRepositoryMock.findAll)
                .toHaveBeenCalledTimes(1);

            expect(response.body).toHaveLength(2);

            expect(response.body[0].nombre).toBe("Dr. Juan Pérez");
            expect(response.body[0].matricula).toBe("12345");
            expect(response.body[0].usuario.nombreUsuario).toBe("juanperez");
            expect(response.body[0].honorario).toBe(5000);

            expect(response.body[1].nombre).toBe("Dra. María Gómez");
            expect(response.body[1].matricula).toBe("67890");
            expect(response.body[1].usuario.nombreUsuario).toBe("mariagomez");
            expect(response.body[1].honorario).toBe(6000);

        });
    });
});
