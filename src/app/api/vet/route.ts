// src/app/api/veterinarians/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withValidationAndErrorHandling } from '@/services/apiService';
import { RepositoryError } from '@/types/lib';
import type { VeterinarianType } from '@/types/index';
import { VeterinarianTypeSchema } from '@/schemas/validationSchemas';
import VeterinarianRepository from '@/repos/veterinarian.repository';
import ComvezcolRepository from '@/repos/comvezcol.repository';
import { sendEmail } from '@/services/emailService';

export async function POST(req: NextRequest) {
    const options = {
        cookies: undefined
    }

    return withValidationAndErrorHandling(
        'POST',
        req,
        VeterinarianTypeSchema,
        async (vetData: VeterinarianType) => {
            try {
                const { data: validationData, error: validationError } = await ComvezcolRepository.validate(vetData.registration, vetData.first_last_name.trim(), vetData.second_last_name.trim());

                if (validationData) {
                    vetData.is_validated = validationData.estado === 'Habilitado';
                    vetData.validated_first_name = validationData.nombres;
                    vetData.validated_last_name = validationData.apellidos;
                } else {
                    vetData.is_validated = false;
                }

                const { data, error } = await VeterinarianRepository.create(vetData, options);
                if (error) {
                    console.log('error', error)
                    throw new RepositoryError(`Error creating veterinarian: ${JSON.stringify(vetData)}`);
                }

                await sendEmail({
                    subject: `Nuevo Registro de Veterinario: ${vetData.email}`,
                    template: 'vetRegistrationAdminNotification',
                    context: {
                        email: vetData.email,
                        registration: vetData.registration,
                        isValidated: vetData.is_validated,
                        validatedFirstName: vetData.validated_first_name || 'N/A',
                        validatedLastName: vetData.validated_last_name || 'N/A',
                        validationError: validationError?.message || null,
                    }
                });

                return NextResponse.json(data, { status: 201 });
            } catch (err) {
                console.log(err);
                throw new RepositoryError('Error creating veterinarian');
            }
        }
    );
}