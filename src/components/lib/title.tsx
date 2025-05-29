// src/components/lib/title.tsx
interface TitleProps {
    icon: React.JSX.Element;
    title: string;
}

export default function TitleComponent(props: TitleProps) {
    return (
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {props.icon} {props.title}
        </h3>
    );
}