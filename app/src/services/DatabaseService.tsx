import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
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

  static async signUp(username: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // Lưu username vào user metadata
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

  // static async saveAccessToken(access_token: string) {
  //   await SecureStore.setItemAsync("access_token", access_token);
  // }
  // static async getToken() {
  //   const access_token = await SecureStore.getItemAsync("access_token");
  //   return access_token;
  // }

  static async setSession(access_token: string, refresh_token: string) {
    await supabase.auth.setSession({ access_token, refresh_token });
  }

  static async refreshToken() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "TOKEN_REFRESHED" && session) {
        await SecureStore.setItemAsync("access_token", session.access_token);
        await SecureStore.setItemAsync("refresh_token", session.refresh_token);
      }
    });
  }

  static async checkAuth() {
    const { data, error } = await supabase.auth.getSession();
    if (data?.session) {
      console.log("Đã đăng nhập");
      return data.session;
    } else {
      console.log("Session không hợp lệ, user cần đăng nhập lại.", error);
      return null;
    }
  }
  // Code database here
}
