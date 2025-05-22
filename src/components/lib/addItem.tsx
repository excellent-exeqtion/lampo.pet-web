// src/components/lib/addItem.tsx
interface AddItemProps {
    entityName: string;
    loadLoading: boolean;
    handleAdd: () => void;
    count: number;
}

export default function AddItem({ entityName, loadLoading, handleAdd, count }: AddItemProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={handleAdd}
                className="contrast"
                disabled={loadLoading}
            >
                Agregar {count == 0 ? '' : 'otra '} {entityName}
            </button>
        </div>
    );
}