import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://odrfusjgbctkybkavelg.supabase.co";
const supabaseKey = Constants.expoConfig?.extra?.supabaseAnonKey;
const supabase = createClient(supabaseUrl, supabaseKey);

export default class DatabaseService {
  static async getEngine(reqPower: number, reqRpm: number): Promise<any[]> {
    return [
      {
        name: "DK.62-4",
        power: 10,
        n_t: 1460,
        H: 0.88,
        GD_2: 0.6,
        T_max_T_dn: 2.3,
        T_k_T_dn: 1.3,
        weight: 170,
      },
      {
        name: "K160S4",
        power: 7.5,
        n_t: 1450,
        H: 0.86,
        GD_2: null,
        T_max_T_dn: null,
        T_k_T_dn: 2.2,
        weight: 94,
      },
    ];
  }

  static async signUp(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // Lưu name vào user metadata
      },
    });
    if (error) console.error("Signup error:", error.message);
    return { data, error };
  }

  static async logIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  static async logOut() {
    await supabase.auth.signOut();
  }

  // Code database here
}
