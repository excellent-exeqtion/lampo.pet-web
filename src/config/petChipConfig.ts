// src/config/petChipConfig.ts

/**
 * Lista de prefijos de fabricantes de microchips de mascotas.
 * El prefijo '999' se excluye ya que es para pruebas.
 * Fuente: https://www.avma.org/resources-tools/pet-owners/petcare/microchipping-your-pet-faq
 */
export const chipPrefixes: string[] = [
    '927', // BUDDY ID (Microchip ID Systems)
    '932', // Flucky (Humanada, México)
    '933', // LAMBERT VET SUPPLY / Alliance ID
    '939', // MICROCHIP 4 SOLUTIONS
    '941', // PETKEY
    '944', // Micro-ID (UK)
    '952', // MICROCHIP 4 SOLUTIONS
    '956', // AKC Reunite
    '965', // BUDDY ID (otra serie)
    '967', // IDENTRAC
    '968', // SAINT (Pet Parent)
    '977', // AVID
    '981', // PETLINK (Datamars, ex-Bayer ResQ) - Incluye 98102, 98103
    '982', // 24PETWATCH
    '985', // HOME AGAIN (Destron/Digital Angel)
    '987', // SMART TAG (ID Tag)
    '990', // NANOCHIPID.com o ViaGuard
    '991', // SAVE THIS LIFE / 911PETCHIP / Free Pet Chip Registry
    '992', // PETKEY, ACA-MARRS, SMART TRAC, INTERNATIONAL PET REGISTRY, PETMAXX
];