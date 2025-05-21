// src/components/lib/addItem.tsx
interface AddItemProps {
    entityName: string;
    loading: boolean;
    handleAdd: () => void;
}

export default function AddItem({ entityName, loading, handleAdd }: AddItemProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={handleAdd}
                className="contrast"
                disabled={loading}
            >
                Agregar otra {entityName}
            </button>
        </div>
    );
}