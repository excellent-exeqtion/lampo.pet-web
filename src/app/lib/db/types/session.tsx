import { Session } from "@supabase/supabase-js";

export interface AppSession {
    db: Session;
}