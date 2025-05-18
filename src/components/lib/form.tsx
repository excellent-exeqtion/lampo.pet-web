import { FieldType, FormType } from "@/types/lib";
import { Field } from "@/components/index";
import { v4 } from "uuid";

interface FormsProps {
    formItems: FormType[];
    isMobile: boolean;
}

export default function Form(props: FormsProps) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: props.isMobile ? "1fr" : "repeat(2, 1fr)", gap: "1rem" }}>
            {props.formItems.map((item) => (
                <div key={item.id} style={{ backgroundColor: "rgb(1, 114, 173)", padding: "0.1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    {item.fields.map((field: FieldType) =>
                        <Field key={v4()} field={field} />
                    )}
                </div>
            ))}
        </div>
    );
}