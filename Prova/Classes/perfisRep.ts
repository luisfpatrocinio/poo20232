import { Perfil } from "./perfil";

export class RepositorioDePerfis {
    private _perfis: Array<Perfil> = new Array<Perfil>;
    
    incluir(perfil: Perfil): void {
        this._perfis.push(perfil);
    }

    consultar(id?: number, nome?: string, email?: string): Perfil | null {
        // Encerrar caso não hajam argumentos
        if (arguments.length == 0) return null;

        if (id !== undefined) {
            const perfilPorId = this._perfis.find((p) => p.id === id);
            if (perfilPorId) return perfilPorId;
        }

        if (nome != undefined) {
            const perfilPorNome = this._perfis.find((p) => p.nome === nome);
            if (perfilPorNome) return perfilPorNome;
        }

        if (email != undefined) {
            const perfilPorEmail = this._perfis.find((p) => p.email === email);
            if (perfilPorEmail) return perfilPorEmail;
        }

        return null;
    }  

    get perfis(): Array<Perfil> {
        return this._perfis;
    }

    set perfis(novosPerfis: Array<Perfil>) {
        this._perfis = novosPerfis;
    }
}