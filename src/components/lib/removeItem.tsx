// app/components/lib/removeItem.tsx
import { FaTrash } from "react-icons/fa";

interface RemoveItemProps {
    id: string | undefined;
    loadLoading: boolean;
    handleRemove: (id: string | undefined) => void;
}

export default function RemoveItemComponent({ id, loadLoading, handleRemove }: RemoveItemProps) {
    return (
        <div className="flex flex-wrap gap-2" style={{ marginTop: '26px', alignContent: 'center' }}>
            <button
                type="button"
                onClick={() => handleRemove(id)}
                className="contrast"
                disabled={loadLoading}
            >
                <FaTrash />
            </button>
        </div>
    );
}