// src/components/PetRecordsPage.tsx
"use client";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Loading, DataNotFound, Display, Title } from "@/components/index";
import { FormRepository, FormType } from "@/types/lib";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { useAppContext } from "../layout/ClientAppProvider";

export interface PageProps<T> {
    title: string;
    icon: React.JSX.Element;
    repository: FormRepository<T>;
    storedList: T[];
    setStoredList: (value: T[]) => void;
    /** Mapea cada ítem a un array de campos para Display */
    mapItemToFields: (item: T) => { label: string; show: boolean; value: string }[];
    emptyMessage: string;
}

const Page = <T,>({
    title,
    icon,
    repository,
    storedList,
    setStoredList,
    mapItemToFields,
    emptyMessage,
}: PageProps<T>) => {
    useRequireAuth();
    const { isMobile } = useDeviceDetect();
    const { storageContext, showEditPetModal } = useAppContext();
    const [items, setItems] = useState<T[] | null>(null);

    useEffect(() => {
        if (!storageContext.storedPet.id) return;
        const fetchData = async () => {
            try {
                let data: T[] = [];
                if (storedList.length == 0) {
                    data = await repository.findByParentId(storageContext.storedPet.id) ?? [];
                    setItems(data);
                    setStoredList(data);
                }
                else {
                    data = storedList;
                    setItems(data);
                }
            } catch (err) {
                console.error(`Error cargando ${title.toLowerCase()}:`, err);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageContext.storedPet.id, showEditPetModal]);

    const formItems: FormType[] = (items || []).map((item) => ({
        id: v4(),
        fields: mapItemToFields(item),
    }));

    return (
        <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
            <Title icon={icon} title={title} />
            {items === null ? (
                <Loading />
            ) : items.length === 0 ? (
                <DataNotFound message={emptyMessage} />
            ) : (
                <Display formItems={formItems} isMobile={isMobile} />
            )}
        </main>
    );
};

export default Page;
