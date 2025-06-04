import React from "react";
import { useRouter } from "next/navigation";
import ModalComponent from "@/components/lib/modal";
import { useUI } from "@/context/UIProvider";

export default function PlanSelectModal() {
    const router = useRouter();
    const {setShowPlanModal} = useUI();

    function handleGoToRegister() {
        setShowPlanModal(false); // Opcional: cierra el modal antes de redirigir
        router.push("/pages/owner/register");
    }

    return (
        <ModalComponent
            title="Selecciona tu plan"
            description="Selecciona tu plan antes de continuar."
            setShowModal={setShowPlanModal}
            hideClose={true}
        >
            <button
                className="contrast"
                onClick={handleGoToRegister}
                style={{ width: "100%", marginTop: "1rem" }}
            >
                Elegir plan
            </button>
        </ModalComponent>
    );
}