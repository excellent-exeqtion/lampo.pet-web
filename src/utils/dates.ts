export function format(date: string | Date | undefined | null): string {
    if (date == undefined || date == null) {
        return '';
    }
    if (typeof (date) == typeof ("")) {
        return (date as string).split('T')[0];
    }
    return (date as Date).toISOString().split('T')[0];
}

export function calculateAge(birthDate: string | Date | undefined | null): string {
    if (!birthDate) {
        return "N/A";
    }

    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    if (age < 0) return "N/A";
    if (age === 0) {
        const months = today.getMonth() - birth.getMonth() + (12 * (today.getFullYear() - birth.getFullYear()));
        return `${months} mes(es)`;
    }

    return `${age} año(s)`;
}