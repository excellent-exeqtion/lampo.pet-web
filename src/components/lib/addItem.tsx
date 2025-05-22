import { tooltipStyles } from "@/styles/tooltip";
import { FaInfoCircle } from "react-icons/fa";

// src/components/lib/addItem.tsx
interface AddItemProps {
    entityName: string;
    loadLoading: boolean;
    handleAdd: () => void;
    count: number;
}

export default function AddItem({ entityName, loadLoading, handleAdd, count }: AddItemProps) {
    return (
        <>
            <style jsx global>{`
        ${tooltipStyles}

        /* Override específico para tooltip de advertencia */
        .tooltip-container.tooltip-warning .tooltip-text {
          background-color: #fff3cd !important;  /* amarillo pálido */
          color: #856404 !important;            /* texto oscuro */
          border-color: #ffeeba !important;      /* borde amarillo */

          /* Posicionar a la derecha del icono */
          top: 50%;
          left: 120%;
          right: auto;
          bottom: auto;
          transform: translateY(-50%);   
          
        }
        .tooltip-container>svg {    
            font-size: 33px;
            color: #856404;
            margin-left: 10px;
        }
      `}</style>
            <div className="flex items-center flex-wrap gap-2">
                <button
                    type="button"
                    onClick={handleAdd}
                    className="contrast"
                    disabled={loadLoading}
                >
                    Agregar {count == 0 ? '' : 'otra '} {entityName}
                </button>

                {count === 0 && (
                    <span className="tooltip-container tooltip-warning">
                        <FaInfoCircle className="ml-1 text-yellow-600" />
                        <span className="tooltip-text">
                            Puedes añadir estos datos más tarde
                        </span>
                    </span>
                )}
            </div>
        </>
    );
}