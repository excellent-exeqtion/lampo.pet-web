
export function format(cents: number) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(cents / 100);
}