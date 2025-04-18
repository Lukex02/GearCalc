import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://odrfusjgbctkybkavelg.supabase.co";
const supabaseKey = Constants.expoConfig?.extra?.supabaseAnonKey;
const supabase = createClient(supabaseUrl, supabaseKey);

export default class DatabaseService {
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

  static async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) console.error("Lỗi khi lấy dữ liệu user:", error.message);
    return data.user;
  }

  static async checkAuth() {
    const { data, error } = await supabase.auth.getSession();
    if (data?.session) {
      // console.log("Đã đăng nhập");
      // console.log(data.session);
      return data.session;
    } else {
      // console.log("Session không hợp lệ, user cần đăng nhập lại.", error);
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
      .order("Motor_Type", { ascending: false })
      .eq("Motor_Type", "K160S4"); // Lấy tạm thời theo bản thuyết minh để theo dõi tính toán
    if (error) console.error("Lỗi khi lấy dữ liệu ", error);
    return data ?? [];
  }

  static async getSelectableChain(P_ct: number): Promise<any[]> {
    const { data, error } = await supabase
      .from("chain")
      .select("*")
      .gte("P_max", P_ct)
      .eq("chain_type", "1_roller")
      .order("P_max", { ascending: true })
      .order("Step_p", { ascending: true })
      .limit(5);

    if (error) console.error("Lỗi khi lấy dữ liệu ", error);
    return data ?? [];
  }

  static async getCatalogAll(): Promise<any[]> {
    const res = [];
    const tables = ["Engine", "chain"];

    for (const tableName of tables) {
      const { data, error } = await supabase.from(tableName).select("*").limit(2); // Tránh lãng phí data
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
