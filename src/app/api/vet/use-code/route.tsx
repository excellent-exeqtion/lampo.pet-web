// src/app/api/vet/use-code/route.ts
import { NextResponse } from "next/server";
import { PetCodeRepository, VeterinaryAccessRepository, OwnerRepository, PetRepository } from "@/repos/index";
import ComvezcolRepository from "@/repos/comvezcol.repository";
import { sendEmail } from "@/services/emailService";

export async function POST(req: Request) {
  try {
    const {
      code,
      firstName,
      firstLastName,
      secondLastName,
      identification,
      registration,
      clinicName,
      city,
    } = await req.json();

    const data = await PetCodeRepository.find(code);
    if (!data) {
      return NextResponse.json({ error: "Código inválido" }, { status: 404 });
    }
    const now = new Date().toISOString();
    if (data.used) {
      return NextResponse.json({ error: "Código ya utilizado" }, { status: 410 });
    }
    if (data.expires_at < now) {
      return NextResponse.json({ error: "Código expirado" }, { status: 410 });
    }

    const { data: validationData } = await ComvezcolRepository.validate(registration, firstLastName.trim(), secondLastName.trim());
    const isValidated = validationData?.estado === 'Habilitado';

    await PetCodeRepository.markUsed(code);

    const vetAccess = await VeterinaryAccessRepository.create({
      pet_id: data.pet_id,
      pet_code_id: data.id,
      vet_first_name: firstName,
      vet_first_last_name: firstLastName,
      vet_second_last_name: secondLastName,
      identification: identification,
      professional_registration: registration,
      clinic_name: clinicName,
      city,
      is_validated: isValidated,
      validated_first_name: validationData?.nombres,
      validated_last_name: validationData?.apellidos,
    });

    const pet = await PetRepository.findById(data.pet_id, {});
    const owner = await OwnerRepository.findByPetId(data.pet_id, {});

    const emailContext = {
      vetFirstName: firstName,
      vetLastName: firstLastName,
      clinicName: clinicName,
      registration: registration,
      isValidated: isValidated,
      petName: pet.name,
    };

    // Notificación al admin
    await sendEmail({
      subject: `Acceso de Veterinario a Mascota: ${pet.name}`,
      template: 'vetAccessNotification',
      context: {
        ...emailContext,
        recipientName: 'Administrador',
        message: `Un veterinario ha accedido al historial de la mascota ${pet.name}.`,
        isOwnerNotification: false,
      }
    });

    // Notificación al dueño
    if (owner?.email) {
      await sendEmail({
        //TODO: habilitar el mailtrap para enviar correos
        //to: owner.email,
        subject: `Un veterinario ha accedido al historial de ${pet.name}`,
        template: 'vetAccessNotification',
        context: {
          ...emailContext,
          recipientName: owner.name,
          message: `Te informamos que un veterinario ha utilizado un código para acceder al historial clínico de tu mascota.`,
          isOwnerNotification: true,
        }
      });
    }

    const response = NextResponse.json({ success: true, pet_id: data.pet_id, pet_code: data.id, vet_access: vetAccess.id });

    response.cookies.set('lampo-vet-access', JSON.stringify({ petId: data.pet_id }), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600,
    });
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error interno" },
      { status: 500 }
    );
  }
}