export const mainlabel = {
  _type: "Loại",
  _design: "Số liệu thiết kế",
  _engine: "Động cơ điện",
  _calcEnginePostStats: "Số liệu động học và động lực học trên các trục",
  _mechDrive: "Xích",
  _gearSet: "Bộ truyền",
  _shaft: "Trục",
  _rollerBearing: "Ổ lăn",
};

export const inputLabel = {
  F: "Lực vòng F (N)",
  v: "Vận tốc V (m/s)",
  T1: "Momen xoắn T1 (N.m)",
  t1: "Thời gian tải t1 (giờ)",
  T2: "Momen xoắn T2 (N.m)",
  t2: "Thời gian tải t2 (giờ)",
  L: "Thời gian làm việc L (năm)",
  output: "Đối tượng đầu ra",
};

export const outputInDesignLabel = {
  D: "Đường kính tang D (mm)",
};

export const engineLabel = {
  name: "Tên",
  power: "Công suất (kW)",
  n_t: "Tốc độ vòng quay (rpm)",
  Efficiency: "Hệ số công suất (%)",
  H: "Hiệu suất động cơ",
  T_max_T_dn: "Hệ số momen tối đa / Momen danh nghĩa",
  T_k_T_dn: "Hệ số momen khởi động / Momen danh nghĩa",
};

export const chainLabel = {
  z1: "Số bánh răng dẫn",
  z2: "Số bánh răng bị dẫn",
  p: "Bước xích (mm)",
  B: "Chiều dài ống lót (mm)",
  d_c: "Đường kính chốt (mm)",
  x: "Số mắt xích",
  a: "Khoảng cách trục (mm)",
  d1: "Đường kính vòng chia đĩa xích dẫn (mm)",
  d2: "Đường kính vòng chia đĩa bị dẫn (mm)",
  F_rx: "Lực tác dụng lên đĩa xích (N)",
};

export const gearSetLabel = {
  a_w: "Khoảng cách trục (mm)",
  m: "Modul pháp (mm)",
  b_w: "Chiều rộng vành răng (mm)",
  u_m: "Tỉ số truyền thực (mm)",
  Beta_angle: "Góc β (°)",
  z1: "Số răng bánh nhỏ (mm)",
  z2: "Số răng bánh lớn (mm)",
  d1: "Đường kính vòng chia đĩa bánh nhỏ (mm)",
  d2: "Đường kính vòng chia đĩa bánh lớn (mm)",
  da1: "Đường kính đỉnh bánh nhỏ (mm)",
  da2: "Đường kính đỉnh bánh lớn (mm)",
  df1: "Đường kính chân răng bánh nhỏ (mm)",
  df2: "Đường kính chân răng bánh lớn (mm)",
  dw1: "Đường kính lăn bánh nhỏ (mm)",
  dw2: "Đường kính lăn bánh lớn (mm)",
};

export const shaftLabel = {
  _d: "Đường kính trục (mm)",
};

export const keyLabel = {
  _d: "d (mm)",
  _lt: "Chiều dài then (mm)",
  _b: "b (mm)",
  _h: "h (mm)",
  _t1: "Chiều sâu rãnh then trên trục (mm)",
  _sigma_d: "Ứng suất dập cho phép (N/mm2)",
  _tau_c: "Ứng suất cắt cho phép (N/mm2)",
};

export const fatigueDuraLabel = {
  point: "Vị trí",
  W_j: "Momen W_j (N.mm)",
  W_oj: "Momen W_oj (N.mm)",
  epsi_sigma: "Hệ số εσ",
  epsi_tau: "Hệ số ε𝜏",
  sigma_aj: "σ_aj",
  tau_aj: "𝜏_aj = 𝜏_mj",
  s_sigma: "Sσ",
  s_tau: "S𝜏",
  s: "Hệ số an toàn",
};

export const staticDuraLabel = {
  d_max: "Đường kính lớn nhất (mm)",
  M_max: "Momen tối đa (N.mm)",
  T_max: "Momen khởi động tối đa (N.mm)",
  sigma: "Ứng suất dập cho phép",
  tau: "Ứng suất cắt cho phép",
  sigma_td: "Ứng suất dập cho phép quá tải",
};

export const selectRollerBearingSizeLabel = {
  ELM: "Cỡ siêu nhẹ, vừa", // Extra light, medium
  ESLN: "Cỡ đặc biệt nhẹ, hẹp", // Extra light, narrow
  ESLM: "Cỡ đặc biệt nhẹ, vừa", // Extra light, medium
  EL: "Cỡ siêu nhẹ", // Extra light
  L: "Cỡ nhẹ", // Light
  M: "Cỡ vừa", // Medium
  H: "Cỡ nặng", // Heavy
};

export const rollerBearingTypeLabel = {
  single_row_ball: "Ổ bi đỡ một dãy",
  thrust: "Ổ đỡ - chặn",
  tapered: "Ổ đũa côn",
};

export const rollerBearingLabel = {
  type: "Loại ổ",
  symbol: "Ký hiệu",
  d: "d (mm)",
  D: "D (mm)",
  r: "r (mm)",
  C: "C (kN)",
  C_O: "C_O (kN)",
  description: "Kiểu",
};

export const labelTable = {
  _designInputStats: "inputLabel",
  _engine: "engineLabel",
  _mechDrive: "chainLabel",
  _gearSet: "gearSetLabel",
  _shaft: "shaftLabel",
  _rollerBearing: "rollerBearingLabel",
};

const Label = {
  mainlabel,
  inputLabel,
  outputInDesignLabel,
  engineLabel,
  chainLabel,
  gearSetLabel,
  shaftLabel,
  selectRollerBearingSizeLabel,
  rollerBearingTypeLabel,
  labelTable,
  keyLabel,
};

export default Label;
