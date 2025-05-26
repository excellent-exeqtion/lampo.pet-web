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
    page: number;
    title: string;
    icon: React.JSX.Element;
    repository: FormRepository<T>;
    /** Mapea cada ítem a un array de campos para Display */
    mapItemToFields: (item: T) => { label: string; show: boolean; value: string }[];
    emptyMessage: string;
}

const Page = <T,>({
    page,
    title,
    icon,
    repository,
    mapItemToFields,
    emptyMessage,
}: PageProps<T>) => {
    useRequireAuth();
    const { isMobile } = useDeviceDetect();
    const { storedPet, showEditPetModal, didMountRef } = useAppContext();
    const [items, setItems] = useState<T[] | null>(null);

    useEffect(() => {
        if (!didMountRef[page].ref.current) {
            didMountRef[page].ref.current = true;
            if (!storedPet.id) return;
            const fetchData = async () => {
                try {
                    const data = await repository.findByParentId(storedPet.id);
                    setItems(data);
                } catch (err) {
                    console.error(`Error cargando ${title.toLowerCase()}:`, err);
                }
            };
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storedPet.id, showEditPetModal]);

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
