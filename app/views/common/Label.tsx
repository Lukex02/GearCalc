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

// Gối trục
export const shaftBearinglabel = {
  C: "C (mm)",
  D: "D (mm)",
  D2: "D2 (mm)",
  D3: "D3 (mm)",
  D4: "D4 (mm)",
  Z: "Số lượng bulông",
  d4: "Đường kính vít",
};

export const transverseLabel = {
  _deltaBody: "Chiều dày thân hộp (mm)",
  _e: "Chiều dày gân tăng cứng (mm)",
  _d2: "Đường kính bulông cạnh ổ (mm)",
  _S3: "Chiều dày số lượng bánh răng dọc (mm)",
  _S4: "Chiều dày số lượng bánh răng ngang (mm)",
  _K1: "Bề rộng mặt đế hộp K1 (mm)",
  _K2: "Bề rộng mặt đế hộp K2 (mm)",
  _K3: "Bề rộng mặt đế hộp K3 (mm)",
  _C1: "Khoảng cách từ tâm bulông đến mép lỗ trục 1 (mm)",
  _C2: "Khoảng cách từ tâm bulông đến mép lỗ trục 2 (mm)",
  _C3: "Khoảng cách từ tâm bulông đến mép lỗ trục 3 (mm)",
};

export const jointLabel = {
  _K3: "Bề rộng mặt đế hộp K3 (mm)",
  _S1: "Chiều dày mặt đế hộp khi không có phần lồi 1 (mm)",
  _S4: "Chiều dày bích nắp hộp (mm)",
};

export const verticalLabel = {
  _K1: "Bề rộng mặt đế hộp K1 (mm)",
  _deltaLid: "Chiều dày nắp hộp (mm)",
  _deltaBody: "Chiều dày thân hộp (mm)",
  _shaftBearing: "Gối trục",
  _h: "Chiều cao gân tăng cứng (mm)",
  _S1: "Chiều dày mặt đế hộp khi không có phần lồi 1 (mm)",
  _d1: "Đường kính bulông nền (mm)",
  _q: "Bề rộng mặt đế hộp q (mm)",
  _R2: "Tâm lỗ bulông cạnh ổ (mm)",
  _K2: "Bề rộng mặt đế hộp K2 (mm)",
  _E2: "Tâm lỗ bulông cạnh ổ (mm)",
};

export const boxLabel = {
  // _deltaBody: "Chiều dày thân hộp",
  // _deltaLid: "Chiều dày nắp hộp",
  // _e: "Gân tăng cứng",
  // _h: "Chiều cao",
  // _slope: "Độ dốc",
  // _d1: "Đường kính bulông nền (mm)",
  // _d2: "Đường kính bulông cạnh (mm)",
  // _d3: "Đường kính bulông ghép bích nắp và thân (mm)",
  // _d4: "Đường kính vít ghép nắp (mm)",
  // _d5: "Đường kính vít ghép thân (mm)",
  // _S3: "Chiều dày số lượng bánh răng dọc (mm)",
  // _S4: "Chiều dày số lượng bánh răng ngang (mm)",
  // _E2: "Tâm lỗ bulông cạnh ổ (mm)",
  // _S1: "Chiều dày mặt đế hộp khi không có phần lồi 1 (mm)",
  // _K1: "Bề rộng mặt đế hộp K1 (mm)",
  // _q: "Bề rộng mặt đế hộp q (mm)",
  // _deltaGapGears: "Khe hỡ giữa các chi tiết bánh răng (mm)",
  // _deltaGapTop: "Khe hỡ giữa đỉnh bánh răng lớn với đáy hộp (mm)",
  // _deltaGapSide: "Khe hỡ giữa mặt bên các bánh răng với nhau (mm)",
  // _L: "Chiều dày hộp (mm)",
  // _B: "Chiều dày rộng (mm)",
  // _Z: "Số lượng bu lông nền (cái)",
  ...shaftBearinglabel,
  ...transverseLabel,
  ...jointLabel,
  ...verticalLabel,
};

export const labelTable = {
  _designInputStats: "inputLabel",
  _engine: "engineLabel",
  _mechDrive: "chainLabel",
  _gearSet: "gearSetLabel",
  _shaft: "shaftLabel",
  _rollerBearing: "rollerBearingLabel",
  _box: "boxLabel",
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
  boxLabel,
};

export default Label;
