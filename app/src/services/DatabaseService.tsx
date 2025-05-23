import supabase from "./config";
import { GearBox } from "@models/GearBox";

export default class DatabaseService {
  static async signUp(username: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        }, // Lưu username vào user metadata
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

  static async updateUserHistory(design: GearBox, isFinish: boolean) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      console.error("Không lấy được user:", userError);
    } else {
      // const currentHistory = userData.user.user_metadata.history || [];

      const { data, error } = await supabase
        .from("history")
        .insert([
          {
            user_id: userData.user.id,
            type: design.type,
            design: design,
            time: new Date().toISOString(),
            isFinish: isFinish,
            printed: 0,
          },
        ])
        .select();

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
      const { data, error } = await supabase
        .from("history")
        .delete()
        .eq("user_id", userData.user.id)
        .eq("id", designId)
        .select("id, type, time, isFinish");

      if (error) {
        console.error("Lỗi khi cập nhật:", error);
      } else {
        return data;
      }
    }
  }

  static async removeAllHistory() {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      console.error("Không lấy được user:", userError);
    } else {
      const { data, error } = await supabase
        .from("history")
        .delete()
        .eq("user_id", userData.user.id)
        .select("id, type, time, isFinish");

      if (error) {
        console.error("Lỗi khi cập nhật:", error);
      } else {
        return data;
      }
    }
  }

  static async getUserHistoryStats() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      console.error("Không lấy được user:", error);
    } else {
      const { data: historyData, error: historyError } = await supabase
        .from("history")
        .select("id,type,time,isFinish,printed")
        .eq("user_id", data.user.id)
        .order("time", { ascending: false });

      if (historyError) {
        console.error("Lỗi khi lấy dữ liệu history:", historyError);
      } else {
        return {
          recentHistory: historyData[0] || null,
          recentUnfinishHistory: historyData.findLast((item: any) => !item.isFinish) || null,
          designedNum: historyData.filter((item: any) => item.isFinish).length,
          printedNum: historyData.reduce(
            (prev: number, curr: any) => prev + (curr.printed ? curr.printed : 0),
            0
          ),
        };
      }
    }
  }
  static async getUserAllHistory() {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      console.error("Không lấy được user:", userError);
    } else {
      const { data: historyData, error: historyError } = await supabase
        .from("history")
        .select("id,type,time,isFinish")
        .eq("user_id", userData.user.id)
        .order("time", { ascending: false });

      if (historyError) {
        console.error("Lỗi khi lấy dữ liệu history:", historyError);
      } else {
        return historyData;
      }
    }
  }

  static async getUserHistory(historyId: any) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      console.error("Không lấy được user:", userError);
    } else {
      const { data: historyData, error: historyError } = await supabase
        .from("history")
        .select("design")
        .eq("id", historyId);

      if (historyError) {
        console.error("Lỗi khi lấy dữ liệu history:", historyError);
      } else {
        return historyData[0].design;
      }
    }
  }

  static async updatePrinted(historyId: any) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      console.error("Không lấy được user:", userError);
    } else {
      const { data, error } = await supabase
        .from("history")
        .select("id, printed")
        .eq("id", historyId)
        .single();
      if (error) {
        console.error("Lỗi khi lấy dữ liệu history:", error);
      } else {
        const { data: updated, error: updateError } = await supabase
          .from("history")
          .update({ printed: data.printed + 1 })
          .eq("id", historyId)
          .select()
          .single();
        if (updateError) {
          console.error("Lỗi khi cập nhật:", updateError);
        } else {
          return updated;
        }
      }
      if (error) {
        console.error("Lỗi khi cập nhật:", error);
      } else {
        return data;
      }
    }
  }

  static async getSelectableEngine(reqPower: number, reqRpm: number): Promise<any[]> {
    let { data, error } = await supabase
      .from("Engine")
      .select("*")
      .gt("Power", reqPower)
      .lt("Speed", Math.floor(reqRpm) + 50) // Xấp xỉ thì cho phép sai số trên dưới 50 so với yêu cầu
      .gt("Speed", Math.floor(reqRpm) - 50)
      .order("Motor_Type", { ascending: false });
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
      .limit(10);

    if (error) console.error("Lỗi khi lấy dữ liệu ", error);
    return data ?? [];
  }

  static async getCatalogAll(): Promise<any[]> {
    const res = [];
    const tables = ["Engine", "chain", "key_flat", "roller_bearing", "lubricantAt50C"];

    for (const tableName of tables) {
      const { data, error } = await supabase.from(tableName).select("*").limit(10); // Tránh lãng phí data
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
    const { data, error } = await supabase
      .from("roller_bearing")
      .select("*")
      .eq("rb_type", type)
      .eq("d", d)
      .order("C", { ascending: false })
      .limit(2);

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
