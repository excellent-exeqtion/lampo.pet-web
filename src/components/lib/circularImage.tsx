// src/components/lib/circularImage.tsx
import React, { useState } from 'react';
import Image from 'next/image';

// Componente reutilizable para avatar circular
interface CircularImageProps {
    src: string;
    width: number;
    borderSize?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRootProps?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getInputProps?: any;
    onClick?: () => void;
    overlayText?: string;
    hoverEnabled?: boolean;
}

export default function CircularImageComponent({ src, width, borderSize = '5px', getRootProps, getInputProps, onClick, overlayText, hoverEnabled = false }: CircularImageProps) {
    const [hover, setHover] = useState(false);
    if (!hoverEnabled) {
        return (
            <div style={{
                position: 'relative',
                width: width,
                height: width,
                borderRadius: '50%',
                overflow: 'hidden',
                border: `${borderSize} solid var(--pico-primary)`,
                cursor: 'pointer'
            }}
            >
                <Image
                    loading={"lazy"}
                    src={src}
                    alt="Foto de la mascota" fill
                    style={{ objectFit: 'cover' }} />
            </div>
        );
    }
    return (
        <div
            {...getRootProps()}
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                position: 'relative',
                width: width,
                height: width,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '5px solid var(--pico-primary)',
                cursor: 'pointer'
            }}
        >
            <input {...getInputProps()} />
            <Image
                loading={"lazy"}
                src={src}
                alt="Foto de la mascota" fill
                style={{ objectFit: 'cover' }} />
            {hover && overlayText && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'var(--primary--graytransparent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%'
                    }}
                >
                    <span style={{ fontWeight: 'bold', color: 'var(--primary-darkgray)', textAlign: 'center' }}>
                        {overlayText}
                    </span>
                </div>
            )}
        </div>
    );
}