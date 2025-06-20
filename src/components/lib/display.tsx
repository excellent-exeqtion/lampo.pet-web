// src/components/lib/display.tsx
import { FieldType, FormType as DisplayType } from "@/types/lib";
import { Field } from "@/components/index";
import { v4 } from "uuid";

interface DisplayProps {
    formItems: DisplayType[];
    isMobile: boolean;
}

export default function DisplayComponent(props: DisplayProps) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: props.isMobile ? "1fr" : "repeat(2, 1fr)", gap: "1rem" }}>
            {props.formItems.map((item) => (
                <div key={item.id} style={{ backgroundColor: "transparent", padding: "0.1rem", borderRadius: "0.5rem", borderColor: 'var(--pico-contrast)', borderWidth: '1px', border: 'groove', boxShadow: "0 2px 8px var(--primary-lighttransparent)" }}>
                    {item.fields.map((field: FieldType) =>
                        <Field key={v4()} field={field} />
                    )}
                </div>
            ))}
        </div>
    );
}