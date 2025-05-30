// src/components/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { Loading, DataNotFound, Display, Title } from "@/components/index";
import { ApiError, FormType } from "@/types/lib";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { useSession } from "@/hooks/useSession";
import { getFetch } from "@/app/api";

export interface PageProps<T> {
    parentId: string,
    title: string;
    icon: React.JSX.Element;
    apiUrl: string;
    storedList: T[];
    setStoredList: (value: T[]) => void;
    /** Mapea cada ítem a un array de campos para Display */
    mapItemToFields: (item: T) => { label: string; show: boolean; value: string }[];
    emptyMessage: string;
}

const PageComponent = <T,>({
    parentId,
    title,
    icon,
    apiUrl,
    storedList,
    setStoredList,
    mapItemToFields,
    emptyMessage,
}: PageProps<T>) => {
    useSession();
    const { isMobile } = useDeviceDetect();
    const [items, setItems] = useState<T[] | null>(null);

    useEffect(() => {
        if (!parentId) return;
        const fetchData = async () => {
            try {
                let data: T[] = [];
                if (storedList == null) {
                    const response = await getFetch(`${apiUrl}${parentId}`);
                    if (!response.ok) throw new ApiError(`Error llamando al api: ${apiUrl}${parentId}`);
                    const data = await response.json();
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
    }, [storedList]);

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

export default PageComponent;
