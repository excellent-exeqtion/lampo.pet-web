"use client";
import React from "react";
import { FaUser } from "react-icons/fa";

export interface BasicData {
  petType: string;
  gender: string;
  weight: string;
  breed: string;
  allergies: string;
  weightCondition: string;
  size: string;
  livesWithOthers: string;
  mainFood: string;
}

export interface ContactData {
  contactName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  email: string;
  lastVaccine: string;
  lastVaccineDate: string;
  castrated: string;
  castrationDate: string;
  antiFleas: string;
  antiFleasDate: string;
  usesMedicine: string;
  specialCondition: string;
}

export default function BasicDataModule({ data, contact }: { data: BasicData; contact: ContactData }) {
  return (
    <div style={{ width: "100%" }}>
      {/* Módulo 1: Datos básicos */}
      <section
        className="datos-basicos-module"
        style={{
          backgroundColor: "#d0d8e8",
          borderRadius: "1rem",
          padding: "1rem",
          fontSize: "0.9rem",
          marginBottom: "2rem",
        }}
      >
        <header style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
          <FaUser size={18} style={{ marginRight: "0.5rem" }} />
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Datos básicos</h2>
        </header>

        <div
          className="grid-datos"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            rowGap: "0.75rem",
            columnGap: "1.5rem",
          }}
        >
          <div><strong>Tipo de mascota:</strong><br />{data.petType}</div>
          <div><strong>Sexo:</strong><br />{data.gender}</div>
          <div><strong>Peso:</strong><br />{data.weight}</div>
          <div><strong>Raza:</strong><br />{data.breed}</div>
          <div><strong>Alergias:</strong><br />{data.allergies}</div>
          <div><strong>Condición de peso:</strong><br />{data.weightCondition}</div>
          <div><strong>Tamaño:</strong><br />{data.size}</div>
          <div><strong>Convive con otras mascotas:</strong><br />{data.livesWithOthers}</div>
          <div><strong>Alimento principal:</strong><br />{data.mainFood}</div>
        </div>
      </section>

      {/* Módulo 2: Datos de contacto y aspectos importantes */}
      <section
        className="contacto-mascota-module"
        style={{
          backgroundColor: "#d0d8e8",
          borderRadius: "1rem",
          padding: "1rem",
          fontSize: "0.9rem",
          marginBottom: "2rem",
        }}
      >
        <header style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
          <FaUser size={18} style={{ marginRight: "0.5rem" }} />
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Datos de contacto y aspectos importantes de la mascota</h2>
        </header>

        <div
          className="grid-contacto"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            rowGap: "0.75rem",
            columnGap: "1.5rem",
          }}
        >
          <div><strong>Nombre del contacto:</strong><br />{contact.contactName}</div>
          <div><strong>Teléfono:</strong><br />{contact.phone}</div>
          <div><strong>Dirección:</strong><br />{contact.address}</div>
          <div><strong>Ciudad:</strong><br />{contact.city}</div>
          <div><strong>País:</strong><br />{contact.country}</div>
          <div><strong>Correo:</strong><br />{contact.email}</div>
          <div><strong>Última vacuna:</strong><br />{contact.lastVaccine}</div>
          <div><strong>Fecha última vacuna:</strong><br />{contact.lastVaccineDate}</div>
          <div><strong>Castrado:</strong><br />{contact.castrated}</div>
          <div><strong>Fecha de castración:</strong><br />{contact.castrationDate}</div>
          <div><strong>Anti pulgas:</strong><br />{contact.antiFleas}</div>
          <div><strong>Fecha de aplicación:</strong><br />{contact.antiFleasDate}</div>
          <div><strong>Utiliza medicina:</strong><br />{contact.usesMedicine}</div>
          <div><strong>Condición médica especial:</strong><br />{contact.specialCondition}</div>
        </div>
      </section>

    </div>
  );
}
