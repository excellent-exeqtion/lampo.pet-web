import {
    FaHome,
    FaUser,
    FaSyringe,
    FaCut,
    FaPills,
    FaCloudSun,
    FaFlask,
    FaRocket,
    FaCog
  } from "react-icons/fa";

// Datos básicos y de contacto
export const basicDataMock = [
    { label: "Tipo de mascota", value: "Gato" },
    { label: "Género", value: "Macho" },
    { label: "Peso", value: "5.5 KG" },
    { label: "Raza", value: "Mestizo" },
    { label: "Alergias", value: "No" },
    { label: "Condición de peso", value: "Normal" },
    { label: "Tamaño", value: "Mediano" },
    { label: "Vive con otros", value: "No" },
    { label: "Comida principal", value: "Taste the Wild" },
  ];
  
  export const contactMock = [
    { label: "Nombre del contacto", value: "Andrés Aulestia" },
    { label: "Teléfono", value: "+57 3146061490" },
    { label: "Dirección", value: "Cra. 74 #152b-70 Torre 3 Apto. 1704" },
    { label: "Ciudad", value: "Bogotá" },
    { label: "País", value: "Colombia" },
    { label: "Email", value: "a.aulestia@exe.com.co" },
    { label: "Última vacuna", value: "Parvigen (2024-07-25)" },
    { label: "Castrado", value: "Sí (2023-12-02)" },
    { label: "Antipulgas", value: "Sí (2023-12-15)" },
    { label: "¿Usa medicina?", value: "No" },
    { label: "Condición especial", value: "No" },
  ];

  export const menuData = [
      { label: "Inicio", icon: <FaHome /> },
      { label: "Datos básicos", icon: <FaUser /> },
      { label: "Vacunas", icon: <FaSyringe /> },
      { label: "Cirugías", icon: <FaCut /> },
      { label: "Medicinas", icon: <FaPills /> },
      { label: "Condiciones atm.", icon: <FaCloudSun /> },
      { label: "Lab. de exámenes", icon: <FaFlask /> },
      { label: "Mejora tu plan", icon: <FaRocket /> },
      { label: "Configuraciones", icon: <FaCog /> },
    ];