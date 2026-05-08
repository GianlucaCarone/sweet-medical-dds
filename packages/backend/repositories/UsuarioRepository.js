export class UsuarioRepository {
    constructor() {
        this.usuarios = {}
    }

    findById(id) {
        const usuario = this.usuarios[id]

        if (!usuario) {
            throw new NotFoundError(`Usuario con id ${id} no encontrado`)
        }

        return usuario
    }


}