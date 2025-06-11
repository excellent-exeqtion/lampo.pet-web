// src/components/forms/CountryCodeInput.tsx
"use client";
import 'react-phone-number-input/style.css';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import { useState } from 'react';

interface CountryCodeInputProps {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    defaultCountry?: "CO"; // Usamos CO como default
}

export default function CountryCodeInput({ value, onChange, defaultCountry = "CO" }: CountryCodeInputProps) {
    const [error, setError] = useState('');

    const handleChange = (newValue: string | undefined) => {
        if (newValue && !isPossiblePhoneNumber(newValue)) {
            setError('Número de teléfono no válido.');
        } else {
            setError('');
        }
        onChange(newValue);
    }

    return (
        <div>
            <PhoneInput
                international
                defaultCountry={defaultCountry}
                value={value}
                onChange={handleChange}
                style={{
                    '--PhoneInput-color': 'var(--pico-form-element-color)',
                    '--PhoneInput-backgroundColor': 'var(--pico-form-element-background-color)',
                    '--PhoneInput-borderColor': 'var(--pico-form-element-border-color)',
                    '--PhoneInput-borderWidth': '1px',
                    '--PhoneInput-borderRadius': 'var(--pico-border-radius)',
                    '--PhoneInputCountrySelect-borderColor': 'var(--pico-form-element-border-color)',
                }}
                className="pico-input" // Usa una clase que no exista para que no herede estilos conflictivos
            />
            {error && <small style={{ color: 'var(--pico-form-element-invalid-active-border-color)' }}>{error}</small>}
        </div>
    );
}