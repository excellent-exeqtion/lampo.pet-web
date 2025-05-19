// components/modals/AddPetModal.tsx
"use client";
import React, { useState, FormEvent, Dispatch, SetStateAction } from "react";
import { FaTimes } from "react-icons/fa";
import { useAppContext } from "@/app/layout";
import { PetRepository } from "@/repos/pet.repository";
import { BasicDataRepository } from "@/repos/basicData.repository";
import { VaccineRepository } from "@/repos/vaccine.repository";
import { MedicineRepository } from "@/repos/medicine.repository";
import { LabTestRepository } from "@/repos/labTest.repository";
import { ConditionRepository } from "@/repos/condition.repository";
import { SurgeryRepository } from "@/repos/surgery.repository";
import type {
    BasicDataType,
    VaccineDataType,
    MedicineDataType,
    LabTestDataType,
    ConditionDataType,
    SurgeryDataType,
    PetType,
} from "@/types/index";
import { generateUniquePetId } from "@/utils/random";

interface AddPetModalProps {
    setShowAddPetModal: Dispatch<SetStateAction<boolean>>;
}

export default function AddPetModal({ setShowAddPetModal }: AddPetModalProps) {
    const { session, storedOwnerPets, setStoredOwnerPets, setStoredPet } = useAppContext();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Estado para cada paso
    const [petName, setPetName] = useState("");
    const [petImage, setPetImage] = useState("");
    const [basicData, setBasicData] = useState<Partial<BasicDataType>>({
        pet_id: "",
        pet_type: "",
        gender: "",
        weight: "",
        race: "",
        has_allergies: false,
        weight_condition: "",
        size: "",
        lives_with_others: false,
        main_food: "",
        has_vaccine: false,
        is_castrated: false,
        has_anti_flea: false,
        uses_medicine: false,
        special_condition: false,
    });
    const [vaccines, setVaccines] = useState<VaccineDataType[]>([]);
    const [medicines, setMedicines] = useState<MedicineDataType[]>([]);
    const [labTests, setLabTests] = useState<LabTestDataType[]>([]);
    const [conditions, setConditions] = useState<ConditionDataType[]>([]);
    const [surgeries, setSurgeries] = useState<SurgeryDataType[]>([]);
    // 1) Asegurarnos de que session y su user.id existen
    if (!session?.db?.user?.id) {
        console.error("No hay sesión activa o falta el user.id");
        return null;
    }

    // 2) Ahora que sabemos que no es undefined, TS infiere correctamente que es string
    const ownerId: string = session.db.user.id;

    const next = () => setStep((s) => s + 1);
    const back = () => setStep((s) => s - 1);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            // 1) Crear pet
            const { data: petData, error: petErr } = await PetRepository.create({
                id: await generateUniquePetId(),
                name: petName,
                image: petImage,
                owner_id: ownerId,
            });
            if (petErr || !petData) throw new Error(petErr?.message || "Error creando mascota");
            const newPet: PetType = petData[0];

            // 2) Datos básicos (requerido)
            await BasicDataRepository.create({
                ...(basicData as BasicDataType),
                pet_id: newPet.id,
            });

            // 3) Pasos opcionales
            await Promise.all(vaccines.map(v => VaccineRepository.create({ ...v, pet_id: newPet.id })));
            await Promise.all(medicines.map(m => MedicineRepository.create({ ...m, pet_id: newPet.id })));
            await Promise.all(labTests.map(l => LabTestRepository.create({ ...l, pet_id: newPet.id })));
            await Promise.all(conditions.map(c => ConditionRepository.create({ ...c, pet_id: newPet.id })));
            await Promise.all(surgeries.map(s => SurgeryRepository.create({ ...s, pet_id: newPet.id })));

            // 4) Actualizar contexto y cerrar
            setStoredOwnerPets([...(storedOwnerPets ?? []), newPet]);
            setStoredPet(newPet);
            setShowAddPetModal(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Renderizado por pasos
    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="grid grid-cols-1 gap-4">
                        <label>
                            Nombre
                            <input value={petName} onChange={e => setPetName(e.target.value)} required />
                        </label>
                        <label>
                            URL de imagen
                            <input value={petImage} onChange={e => setPetImage(e.target.value)} />
                        </label>
                    </div>
                );
            case 1:
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {/* Aquí todos los campos de basicData */}
                        <label>
                            Tipo
                            <input value={basicData.pet_type} onChange={e => setBasicData({ ...basicData, pet_type: e.target.value })} required />
                        </label>
                        {/* … resto de inputs */}
                    </div>
                );
            // cases 2–6: formularios para vacunas, medicinas, exámenes…
            default:
                return <p>Revisar y crear mascota</p>;
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "1rem",
                    padding: "2rem",
                    width: "90%",
                    maxWidth: "400px",
                    position: "relative",
                }}
            >
                {/* Close button */}
                <button
                    onClick={() => setShowAddPetModal(false)}
                    style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        background: "none",
                        border: "none",
                        fontSize: "1rem",
                        cursor: "pointer",
                        color: '#000'
                    }}
                    aria-label="Cerrar modal"
                >
                    <FaTimes />
                </button>
                <h2>Paso {step + 1} de 7</h2>
                <form onSubmit={handleSubmit}>
                    {renderStep()}
                    {error && <p className="text-error">{error}</p>}
                    <div className="actions">
                        {step > 0 && <button type="button" onClick={back}>Atrás</button>}
                        {step < 6
                            ? <button type="button" onClick={next}>Siguiente</button>
                            : <button type="submit" disabled={loading}>{loading ? "Guardando…" : "Finalizar"}</button>}
                    </div>
                </form>
            </div>
        </div>
    );
}
