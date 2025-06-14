// src/app/pages/home/page.tsx
"use client";
import React from "react";
import {
  FaCalendar, FaUser, FaSyringe, FaCut, FaPills, FaCloudSun,
  FaFlask, FaCog, FaPlusCircle, FaPaw,
} from "react-icons/fa";
import {
  FaUserDoctor, FaPencil,
} from "react-icons/fa6";
import { FeatureLink, Loading } from "@/components/index";
import { useRoleContext } from "@/context/RoleProvider";
import { useUI } from "@/context/UIProvider";
import { useStorageContext } from "@/context/StorageProvider";
import { useSessionContext } from "@/context/SessionProvider";
import { usePetProfileProgress } from '@/hooks/usePetProfileProgress'; // IMPORTADO

export default function HomePage() {
  const { isOwner, isVet, isVetWithSession } = useRoleContext();
  const { setShowVetPetCodeModal, setShowAddPetModal, setShowEditPetModal } = useUI();
  const { storedPet } = useStorageContext();
  const { isLoading: isLoadingSession } = useSessionContext();
  const progress = usePetProfileProgress(); // USADO

  if (isLoadingSession) {
    return <Loading />;
  }

  return (
    <main className="container" style={{ maxWidth: 700, margin: "3rem auto" }}>
      <section style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1 style={{ color: 'var(--pico-primary)' }}>Lampo: Gestión clínica de mascotas</h1>
        <p>
          Lampo es la plataforma digital que centraliza el historial médico, agenda y gestión de mascotas, permitiendo a dueños y veterinarios acceder y actualizar información de forma sencilla, segura y colaborativa.
        </p>
      </section>

      <section>
        <h2 style={{ marginBottom: "1.2rem", color: 'var(--pico-primary)' }}>¿Qué puedes hacer en Lampo?</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {isOwner &&
            <FeatureLink
              icon={<FaPaw />}
              click={() => setShowAddPetModal(true)}
              href=""
              title="Agregar Mascota"
              desc="Registra una nueva mascota en tu perfil y comienza a gestionar su información clínica desde un solo lugar."
            />
          }
          {isOwner &&
            <FeatureLink
              icon={<FaPencil />}
              click={storedPet.id ? () => setShowEditPetModal(true) : undefined}
              href=""
              title="Editar Mascota"
              desc="Actualiza la información de tus mascotas de manera fácil y segura."
            />
          }
          {isOwner &&
            <FeatureLink
              icon={<FaCalendar />}
              href="/pages/owner/calendar"
              title="Calendario"
              desc="Visualiza y gestiona eventos, actividades y recordatorios de salud importantes de tus mascotas."
            />
          }
          {isOwner &&
            <FeatureLink
              icon={<FaUser />}
              href="/pages/pet/basic-data"
              title="Datos básicos"
              desc="Consulta y edita los datos principales de cada mascota: nombre, raza, edad, propietario y más."
              isComplete={progress.basicData}
            />
          }
          {isOwner &&
            <FeatureLink
              icon={<FaUserDoctor />}
              href={storedPet.id ? `/pages/pet/consultations/${storedPet.id}` : ''}
              title="Consultas veterinarias"
              desc="Visualiza las visitas médicas, diagnósticos y recomendaciones veterinarias."
            />
          }
          {isOwner &&
            <FeatureLink
              icon={<FaSyringe />}
              href="/pages/pet/vaccines"
              title="Vacunas"
              desc="Lleva el control de las vacunas aplicadas, pendientes y genera recordatorios personalizados."
              isComplete={progress.vaccines}
            />
          }
          {isOwner &&
            <FeatureLink
              icon={<FaCut />}
              href="/pages/pet/surgeries"
              title="Cirugías"
              desc="Registra intervenciones quirúrgicas, fechas, veterinario responsable y notas relevantes."
              isComplete={progress.surgeries}
            />
          }
          {isOwner &&
            <FeatureLink
              icon={<FaPills />}
              href="/pages/pet/medicines"
              title="Medicinas"
              desc="Gestiona tratamientos, dosis, fechas y alertas de administración de medicamentos."
              isComplete={progress.medicines}
            />
          }
          {isOwner &&
            <FeatureLink
              icon={<FaCloudSun />}
              href="/pages/pet/conditions"
              title="Condiciones especiales"
              desc="Anota alergias, condiciones crónicas u otros factores a tener en cuenta en el cuidado diario."
              isComplete={progress.conditions}
            />
          }
          {isOwner &&
            <FeatureLink
              icon={<FaFlask />}
              href="/pages/pet/lab-tests"
              title="Exámenes de laboratorio"
              desc="Carga y consulta resultados de exámenes de laboratorio para mantener el historial clínico completo."
              isComplete={progress.labTests}
            />
          }
          {isVet &&
            <FeatureLink
              icon={<FaUserDoctor />}
              click={storedPet.id ? undefined : () => setShowVetPetCodeModal(true)}
              href={storedPet.id ? `/pages/pet/consultations/${storedPet.id}` : ''}
              title="Consultas veterinarias"
              desc="Visualiza y carga documentos de visitas médicas, diagnósticos y recomendaciones de tus pacientes."
            />
          }
          {isOwner &&
            <FeatureLink
              icon={<FaCog />}
              href="/pages/owner/settings"
              title="Configuraciones"
              desc="Personaliza tu perfil, gestiona usuarios y controla la privacidad y notificaciones (solo propietarios)."
            />
          }
          {isVet &&
            <FeatureLink
              icon={<FaPlusCircle />}
              click={storedPet.id ? undefined : () => setShowVetPetCodeModal(true)}
              href={storedPet.id ? `/pages/vet/consultation/${storedPet.id}` : ''}
              title="Agregar Consulta"
              desc="Puedes registrar nuevas consultas médicas para tus pacientes directamente desde aquí."
            />
          }
          {isVetWithSession &&
            <FeatureLink
              icon={<FaCog />}
              href="/pages/vet/settings"
              title="Configuración de Veterinario"
              desc="Actualiza tus datos de perfil profesional que se usan en las historias clínicas."
            />
          }
        </ul>
      </section>

      <section style={{ marginTop: "3rem", textAlign: "center" }}>
        <p>
          <strong style={{ color: 'var(--pico-primary)' }}>¿Listo para comenzar?</strong> Selecciona una sección en el menú o desde aquí para explorar todas las funciones de Lampo.
        </p>
      </section>
    </main>
  );
}