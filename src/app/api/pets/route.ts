// app/api/pets/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getRequiredQueryParam, withValidationAndErrorHandling, getWithErrorHandling } from '@/services/apiService'
import PetRepository from '@/repos/pet.repository'
import { z } from 'zod'
import { PetType } from '@/types/index'
import { cookies } from "next/headers";

const petSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    image: z.string().optional(),
    owner_id: z.string(),
})

export async function GET(req: NextRequest) {
    const options = {
        cookies: await cookies()
    }

    return getWithErrorHandling(
        req,
        async () => {
            // ahora delegamos la validación del ownerId
            const ownerId = getRequiredQueryParam(req, 'ownerId')
            const pets = await PetRepository.findByOwnerId(ownerId, options)
            return NextResponse.json(pets, { status: 200 })
        });
}

export async function POST(req: NextRequest) {
    const options = {
        cookies: await cookies()
    }

    return withValidationAndErrorHandling(
        'POST',
        req,
        petSchema,
        async (pet) => {
            const { data, error } = await PetRepository.upsert(pet as PetType, options)
            if (error) {
                return NextResponse.json(
                    { success: false, message: error.message },
                    { status: 500 }
                )
            }
            return NextResponse.json(data, { status: 201 })
        }
    )
}
