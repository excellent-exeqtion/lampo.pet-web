// src/components/lib/addItem.tsx

import { tooltipStyles } from "@/styles/tooltip";
import { FaInfoCircle } from "react-icons/fa";
interface AddItemProps {
    entityName: string;
    loadLoading: boolean;
    handleAdd: () => void;
    count: number;
}

export default function AddItemComponent({ entityName, loadLoading, handleAdd, count }: AddItemProps) {
    return (
        <>
            <style jsx global>{`
        ${tooltipStyles}

        /* Override específico para tooltip de advertencia */
        .tooltip-container.tooltip-warning .tooltip-text {
          background-color: var(--primary-lightyellow) !important;  /* amarillo pálido */
          color: var(--primary-yellow) !important;            /* texto oscuro */
          border-color: var(--primary-yellow) !important;      /* borde amarillo */

          /* Posicionar a la derecha del icono */
          top: 50%;
          left: 120%;
          right: auto;
          bottom: auto;
          transform: translateY(-50%);   
          
        }
        .tooltip-container>svg {    
            font-size: 33px;
            color: var(--primary-yellow);
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