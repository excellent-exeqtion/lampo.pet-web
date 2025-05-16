export function renderTitle(icon: React.JSX.Element, title: string): React.JSX.Element {
    return (
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {icon} {title}
        </h3>
    );
}