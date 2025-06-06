// src/repository/comvezcol.repository.ts

import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import type { RepositoryResponse } from '@/types/lib'; // Asumo que tienes un tipo como este
import type { ProfessionalData } from '@/types/index'; // Asumo que moverías la interfaz a un archivo central de tipos

// Mueve la interfaz a tu archivo de tipos (ej: src/types/index.ts)
// export interface ProfessionalData { ... }

const dataMapping: Record<string, keyof Omit<ProfessionalData, 'foto' | 'estado' | 'matriculaBuscada'>> = {
    'Nombre': 'nombres',
    'Apellidos': 'apellidos',
    'Titulo Obtenido': 'tituloObtenido',
    'Universidad': 'universidad',
    'Matricula No.': 'numeroMatricula',
    'Acta de grado No.': 'actaGrado',
};

class ComvezcolRepository {
    private static BASE_URL = 'https://administrador.consejoapp.com.co';

    public static async validate(matricula: string): Promise<RepositoryResponse<ProfessionalData>> {
        const SEARCH_ACTION_URL = `${this.BASE_URL}/index.php/consultas/profesionalesS`;

        try {
            const searchResponse: AxiosResponse<string> = await axios.post(SEARCH_ACTION_URL, { matricula }, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            const $resultsPage: CheerioAPI = cheerio.load(searchResponse.data);
            const detailLink = $resultsPage('table.table a.btn-success').attr('href');

            if (!detailLink) {
                return { data: null, error: { message: `No se encontró profesional con matrícula ${matricula}.`, status: 404 } };
            }

            const detailResponse = await axios.get(detailLink);
            const $detailPage = cheerio.load(detailResponse.data);

            const professionalData: Partial<ProfessionalData> = {};
            const fotoSrc = $detailPage('.col-sm-12.col-lg-4 img').attr('src');
            if (fotoSrc) {
                professionalData.foto = fotoSrc.startsWith('http') ? fotoSrc : `${this.BASE_URL}${fotoSrc}`;
            }

            $detailPage('.table-bordered tbody tr').each((_, element) => {
                const th = $detailPage(element).find('th').text().trim();
                const td = $detailPage(element).find('td').text().trim();
                const key = dataMapping[th];
                if (key) professionalData[key] = td;
            });

            professionalData.estado = Object.keys(professionalData).length > 2 ? 'Habilitado' : 'Desconocido';
            professionalData.matriculaBuscada = matricula;

            return { data: professionalData as ProfessionalData, error: null };

        } catch (error) {
            console.error(`Error en el scraping para la matrícula ${matricula}:`, error);
            const message = error instanceof Error ? error.message : 'Error interno del servidor';
            return { data: null, error: { message, status: 500 } };
        }
    }
}

export default ComvezcolRepository;