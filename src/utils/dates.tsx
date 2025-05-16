export function format(date: string | Date | undefined | null): string {
    if (date == undefined || date == null) {
        return '';
    }
    if(typeof(date) == typeof("")){
        return (date as string).split('T')[0];
    }
    return (date as Date).toISOString().split('T')[0];
}