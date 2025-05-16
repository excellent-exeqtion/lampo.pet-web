import { Utils } from ".";

export function renderForm(formItems: Utils.Form[], isMobile: boolean): React.JSX.Element {
    return (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "1rem" }}>
            {formItems.map((item) => (
                <div key={item.id} style={{ backgroundColor: "rgb(1, 114, 173)", padding: "0.1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    {item.fields.map((field: Utils.Field) => Utils.renderField(field))}
                </div>
            ))}
        </div>
    );
}