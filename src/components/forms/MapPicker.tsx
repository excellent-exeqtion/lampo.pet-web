// src/components/forms/MapPicker.tsx
"use client";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon.png";
import { useEffect, useMemo, useRef } from 'react';

// Arreglo para el ícono por defecto de Leaflet que se rompe con Webpack
const DefaultIcon = L.icon({
    iconUrl: '/images/marker-icon.png',
    iconRetinaUrl: '/images/marker-icon-2x.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapPickerProps {
    coords: { lat: number; lng: number };
    onCoordsChange: (coords: { lat: number; lng: number }) => void;
}

// Componente interno para actualizar la vista del mapa cuando las coordenadas cambian
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
}

// Componente interno para manejar los eventos del mapa
function MapEvents({ onCoordsChange }: { onCoordsChange: (coords: { lat: number, lng: number }) => void }) {
    useMapEvents({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        click(e: any) {
            onCoordsChange(e.latlng);
        },
    });
    return null;
}

export default function MapPicker({ coords, onCoordsChange }: MapPickerProps) {
    const markerRef = useRef<L.Marker>(null);

    const eventHandlers = useMemo(() => ({
        dragend() {
            const marker = markerRef.current;
            if (marker != null) {
                onCoordsChange(marker.getLatLng());
            }
        },
    }), [onCoordsChange]);

    // Asegúrate de que las imágenes de los marcadores estén en la carpeta /public/images/
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: '/images/marker-icon-2x.png',
            iconUrl: '/images/marker-icon.png',
            shadowUrl: '/images/marker-shadow.png',
        });
    }, []);


    return (
        <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '300px', width: '100%', borderRadius: '8px' }}>
            <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
                position={[coords.lat, coords.lng]}
                draggable={true}
                eventHandlers={eventHandlers}
                ref={markerRef}
                icon={DefaultIcon}
            />
            <ChangeView center={[coords.lat, coords.lng]} />
            <MapEvents onCoordsChange={onCoordsChange} />
        </MapContainer>
    );
}