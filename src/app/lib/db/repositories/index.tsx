export interface Pet {
    pet_id: string;
    name: string;
    image?: string | null;
    owner_id: string;
};

export interface PetCode {
    pet_id: string;
    code: string;
    used: boolean;
    expires_at: string;
}
