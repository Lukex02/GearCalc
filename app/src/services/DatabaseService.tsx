import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://odrfusjgbctkybkavelg.supabase.co";
const supabaseKey = Constants.expoConfig?.extra?.supabaseAnonKey;
const supabase = createClient(supabaseUrl, supabaseKey);

export default class DatabaseService {
  // private static _authSession: any;
  static async signUp(username: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // Lưu username vào user metadata
      },
    });
    if (error) console.error("Signup error:", error.message);
    // this._authSession = data.session;
    return { data, error };
  }

  static async logIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    // this._authSession = data.session;
    return { data, error };
  }

  static async logOut() {
    await supabase.auth.signOut();
  }

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
      // console.log(data.session);
      // this._authSession = data.session;
      return data.session;
    } else {
      console.log("Session không hợp lệ, user cần đăng nhập lại.", error);
      return null;
    }
  }
  // Code database here
  static async getSelectableEngine(reqPower: number, reqRpm: number): Promise<any[]> {
    let { data, error } = await supabase
      .from("Engine")
      .select("*")
      .gt("Power", reqPower)
      .lt("Speed", Math.floor(reqRpm) + 50) // Xấp xỉ thì cho phép sai số trên dưới 50 so với yêu cầu
      .gt("Speed", Math.floor(reqRpm) - 50)
      .limit(1);
    if (error) console.error("Lỗi khi lấy dữ liệu ", error);
    return data ?? [];
  }

  static async getCatalogAll(): Promise<any[]> {
    const res = [];
    const tables = ["Engine", "chain"];

    for (const tableName of tables) {
      const { data, error } = await supabase.from(tableName).select("*").limit(1); // Tránh lãng phí data
      if (error) {
        console.error(`Lỗi khi lấy dữ liệu từ ${tableName}:`, error);
      } else {
        const updatedData = data.map((item) => ({
          type: tableName,
          ...item, // Giữ nguyên dữ liệu cũ
        }));
        res.push(...updatedData);
      }
    }
    return res;
  }
}
