import Constants from "expo-constants";
import { createClient, User } from "@supabase/supabase-js";
import { GearBox } from "@models/GearBox";

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

  static async updateUserHistory(design: GearBox, time: string, isFinish: boolean) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      console.error("Không lấy được user:", userError);
    } else {
      const currentHistory = userData.user.user_metadata.history || [];

      const updatedHistory = [...currentHistory, { id: currentHistory.length, design, time, isFinish }];

      const { data, error } = await supabase.auth.updateUser({
        data: {
          history: updatedHistory,
        },
      });

      if (error) {
        console.error("Lỗi khi cập nhật:", error);
      } else {
        // console.log("Cập nhật thành công:", data);
      }
    }
  }

  static async removeHistory(designId: any) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      console.error("Không lấy được user:", userError);
    } else {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          history: userData.user.user_metadata.history.filter((item: any) => item.id !== designId),
        },
      });
      if (error) {
        console.error("Lỗi khi cập nhật:", error);
      } else {
        return data;
      }
    }
  }

  static async removeAllHistory() {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        history: [],
      },
    });
    if (error) {
      console.error("Lỗi khi cập nhật:", error);
    } else {
      return data;
    }
  }

  static async getUserHistoryStats() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      console.error("Không lấy được user:", error);
    } else {
      const recentHistory =
        data.user.user_metadata.history[data.user.user_metadata.history.length - 1] || null;
      const recentUnfinishHistory =
        data.user.user_metadata.history.findLast((item: any) => !item.isFinish) || null;
      const designedNum = data.user.user_metadata.history.filter((item: any) => item.isFinish).length;
      const printedNum = data.user.user_metadata.history.reduce(
        (prev: any, curr: any) => (prev + curr.printed ? curr.printed : 0),
        0
      );
      return {
        recentHistory,
        recentUnfinishHistory,
        designedNum,
        printedNum,
      };
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
    const tables = ["Engine", "chain", "key_flat", "roller_bearing", "lubricantAt50C"];

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

  static async getKey(d: number): Promise<any> {
    const { data, error } = await supabase
      .from("key_flat")
      .select("*")
      .lte("d_min", d)
      .gt("d_max", d)
      .limit(1);
    if (error) console.error("Lỗi khi lấy dữ liệu ", error);
    return data ?? [];
  }

  static async getSelectableRollerBearingList(type: string, d: number): Promise<any[]> {
    // console.log("type", type);
    // console.log("d", d);
    const { data, error } = await supabase.from("roller_bearing").select("*").eq("rb_type", type).eq("d", d);

    if (error) console.error("Lỗi khi lấy dữ liệu ", error);
    return data ?? [];
  }

  static async getLubricant() {
    const { data, error } = await supabase
      .from("lubricantAt50C")
      .select("*")
      .order("centistoc_min", { ascending: false });

    if (error) console.error("Lỗi khi lấy dữ liệu ", error);
    return data ?? [];
  }
}
