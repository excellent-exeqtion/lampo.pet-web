// src/components/forms/CountryCitySelector.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Country, City } from 'country-state-city';
import type { ICountry, ICity } from 'country-state-city';

interface CountryCitySelectorProps {
    onCountryChange: (country: ICountry | undefined) => void;
    onCityChange: (city: ICity | undefined) => void;
    initialCountryCode?: string;
    initialCityName?: string;
}

export default function CountryCitySelector({
    onCountryChange,
    onCityChange,
    initialCountryCode = 'CO', // Default a Colombia
    initialCityName = ''
}: CountryCitySelectorProps) {

    const [countries, setCountries] = useState<ICountry[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>();
    const [cityInput, setCityInput] = useState(initialCityName);
    const [citySuggestions, setCitySuggestions] = useState<ICity[]>([]);

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        const country = Country.getCountryByCode(initialCountryCode);
        setSelectedCountry(country);
        onCountryChange(country);
        setCityInput(initialCityName);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialCountryCode, initialCityName]);


    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const countryCode = e.target.value;
        const country = Country.getCountryByCode(countryCode);
        setSelectedCountry(country);
        onCountryChange(country);
        setCityInput(''); // Resetear ciudad al cambiar de país
        onCityChange(undefined);
        setCitySuggestions([]);
    };

    const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setCityInput(input);
        if (input.length > 1 && selectedCountry) {
            const suggestions = City.getCitiesOfCountry(selectedCountry.isoCode)?.filter(c =>
                c.name.toLowerCase().startsWith(input.toLowerCase())
            );
            setCitySuggestions(suggestions || []);
        } else {
            setCitySuggestions([]);
        }
    };

    const handleCitySuggestionClick = (city: ICity) => {
        setCityInput(city.name);
        onCityChange(city);
        setCitySuggestions([]);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
                <label htmlFor="country">País</label>
                <select id="country" value={selectedCountry?.isoCode || ''} onChange={handleCountryChange}>
                    <option value="" disabled>Selecciona un país</option>
                    {countries.map(country => (
                        <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ position: 'relative' }}>
                <label htmlFor="city">Ciudad</label>
                <input
                    id="city"
                    type="text"
                    value={cityInput}
                    onChange={handleCityInputChange}
                    placeholder={selectedCountry ? "Escribe para buscar..." : "Selecciona un país primero"}
                    disabled={!selectedCountry}
                    autoComplete="off"
                />
                {citySuggestions.length > 0 && (
                    <ul style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'var(--primary-inverse)',
                        border: '1px solid var(--primary-lightgray)',
                        borderRadius: '0.5rem',
                        maxHeight: '150px',
                        overflowY: 'auto',
                        zIndex: 100,
                        padding: 0,
                        listStyle: 'none'
                    }}>
                        {citySuggestions.slice(0, 10).map(city => (
                            <li
                                key={city.name}
                                onClick={() => handleCitySuggestionClick(city)}
                                className="city-suggestion-item"
                                style={{ padding: '0.5rem', cursor: 'pointer' }}
                            >
                                {city.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}