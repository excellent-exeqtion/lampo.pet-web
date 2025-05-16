export function formatDate(date: Date | undefined): string {
    if(date == undefined){
        return '';
    }
    return date.toISOString().split('T')[0];
}