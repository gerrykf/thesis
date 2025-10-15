declare namespace API {
  type CreateDietRecordRequest = {
    /** 食物ID */
    food_id: number;
    /** 记录日期 */
    record_date: string;
    /** 餐次类型 */
    meal_type: "breakfast" | "lunch" | "dinner" | "snack";
    /** 食用量(g) */
    quantity: number;
    /** 备注 */
    notes?: string;
  };

  type CreateFoodRequest = {
    /** 食物名称 */
    name: string;
    /** 英文名称 */
    name_en?: string;
    /** 食物分类 */
    category: string;
    /** 品牌 */
    brand?: string;
    /** 每100g热量(kcal) */
    calories_per_100g: number;
    /** 每100g蛋白质(g) */
    protein_per_100g?: number;
    /** 每100g脂肪(g) */
    fat_per_100g?: number;
    /** 每100g碳水化合物(g) */
    carbs_per_100g?: number;
    /** 每100g纤维(g) */
    fiber_per_100g?: number;
    /** 每100g钠(mg) */
    sodium_per_100g?: number;
    /** 每100g糖(g) */
    sugar_per_100g?: number;
    /** 食物图片URL */
    image_url?: string;
    /** 条形码 */
    barcode?: string;
    /** 是否启用 */
    is_active?: boolean;
  };

  type CreateHealthRecordRequest = {
    /** 记录日期 */
    record_date: string;
    /** 体重(kg) */
    weight?: number;
    /** 运动时长(分钟) */
    exercise_duration?: number;
    /** 运动类型 */
    exercise_type?: string;
    /** 睡眠时长(小时) */
    sleep_hours?: number;
    /** 睡眠质量 */
    sleep_quality?: "excellent" | "good" | "fair" | "poor";
    /** 心情状态 */
    mood?: "excellent" | "good" | "fair" | "poor";
    /** 备注 */
    notes?: string;
  };

  type deleteAdminFoodsIdParams = {
    id: number;
  };

  type deleteAdminRolesIdParams = {
    /** 角色ID */
    id: number;
  };

  type deleteAdminUsersIdParams = {
    /** 用户ID */
    id: number;
  };

  type deleteDietRecordsIdParams = {
    /** 记录ID */
    id: number;
  };

  type deleteFoodsIdParams = {
    /** 食物ID */
    id: number;
  };

  type deleteGoalsIdParams = {
    /** 目标ID */
    id: number;
  };

  type deleteHealthRecordsIdParams = {
    /** 记录ID */
    id: number;
  };

  type DietRecord = {
    /** 记录ID */
    id?: number;
    /** 用户ID */
    user_id?: number;
    /** 食物ID */
    food_id?: number;
    /** 记录日期 */
    record_date?: string;
    /** 餐次类型 */
    meal_type?: "breakfast" | "lunch" | "dinner" | "snack";
    /** 食用量(g) */
    quantity?: number;
    /** 热量(kcal) */
    calories?: number;
    /** 蛋白质(g) */
    protein?: number;
    /** 脂肪(g) */
    fat?: number;
    /** 碳水化合物(g) */
    carbs?: number;
    /** 备注 */
    notes?: string;
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
  };

  type Food = {
    /** 食物ID */
    id?: number;
    /** 食物名称 */
    name?: string;
    /** 英文名称 */
    name_en?: string;
    /** 食物分类 */
    category?: string;
    /** 品牌 */
    brand?: string;
    /** 每100g热量(kcal) */
    calories_per_100g?: number;
    /** 每100g蛋白质(g) */
    protein_per_100g?: number;
    /** 每100g脂肪(g) */
    fat_per_100g?: number;
    /** 每100g碳水化合物(g) */
    carbs_per_100g?: number;
    /** 每100g纤维(g) */
    fiber_per_100g?: number;
    /** 每100g钠(mg) */
    sodium_per_100g?: number;
    /** 每100g糖(g) */
    sugar_per_100g?: number;
    /** 食物图片URL */
    image_url?: string;
    /** 条形码 */
    barcode?: string;
    /** 是否启用 */
    is_active?: boolean;
    /** 创建者ID */
    created_by?: number;
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
  };

  type getAdminFoodsIdParams = {
    id: number;
  };

  type getAdminFoodsParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    limit?: number;
    /** 搜索关键词 */
    search?: string;
    /** 分类筛选 */
    category?: string;
  };

  type getAdminLogsParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    limit?: number;
    /** 操作类型筛选 */
    action?: string;
    /** 用户ID筛选 */
    user_id?: number;
  };

  type getAdminRolesIdMenusParams = {
    /** 角色ID */
    id: number;
  };

  type getAdminRolesParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    limit?: number;
    /** 角色名称搜索 */
    name?: string;
    /** 角色标识搜索 */
    code?: string;
    /** 状态筛选 1:启用 0:禁用 */
    status?: 0 | 1;
  };

  type getAdminUsersIdHealthRecordsParams = {
    /** 用户ID */
    id: number;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 开始日期(YYYY-MM-DD) */
    startDate?: string;
    /** 结束日期(YYYY-MM-DD) */
    endDate?: string;
  };

  type getAdminUsersIdHealthStatsParams = {
    /** 用户ID */
    id: number;
  };

  type getAdminUsersIdParams = {
    /** 用户ID */
    id: number;
  };

  type getAdminUsersParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    limit?: number;
    /** 搜索关键词(用户名或昵称) */
    search?: string;
    /** 用户角色筛选 */
    role?: "user" | "admin";
    /** 创建时间开始日期(YYYY-MM-DD) */
    createdStartDate?: string;
    /** 创建时间结束日期(YYYY-MM-DD) */
    createdEndDate?: string;
    /** 最后登录开始日期(YYYY-MM-DD) */
    loginStartDate?: string;
    /** 最后登录结束日期(YYYY-MM-DD) */
    loginEndDate?: string;
  };

  type getDietRecordsParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    limit?: number;
    /** 指定日期 */
    date?: string;
    /** 开始日期 */
    start_date?: string;
    /** 结束日期 */
    end_date?: string;
    /** 餐次类型 */
    meal_type?: "breakfast" | "lunch" | "dinner" | "snack";
  };

  type getDietSummaryParams = {
    /** 指定日期 */
    date?: string;
    /** 开始日期 */
    start_date?: string;
    /** 结束日期 */
    end_date?: string;
  };

  type getFoodsIdParams = {
    /** 食物ID */
    id: number;
  };

  type getFoodsParams = {
    /** 页码（从1开始） */
    page?: number;
    /** 每页显示数量 */
    limit?: number;
    /** 搜索关键词（用于匹配食物名称） */
    search?: string;
    /** 食物类别筛选 */
    category?: string;
    /** 根据条形码筛选 */
    barcode?: string;
  };

  type getHealthRecordsIdParams = {
    /** 记录ID */
    id: number;
  };

  type getHealthRecordsParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    limit?: number;
    /** 开始日期 */
    start_date?: string;
    /** 结束日期 */
    end_date?: string;
  };

  type getStatsCaloriesTrendParams = {
    /** 统计天数 */
    days?: number;
  };

  type getStatsExerciseTrendParams = {
    /** 统计天数 */
    days?: number;
  };

  type getStatsNutritionAnalysisParams = {
    /** 统计天数 */
    days?: number;
  };

  type getStatsOverviewParams = {
    /** 统计天数 */
    days?: number;
  };

  type getStatsSleepQualityParams = {
    /** 统计天数 */
    days?: number;
  };

  type getStatsWeightTrendParams = {
    /** 统计天数 */
    days?: number;
  };

  type HealthRecord = {
    /** 记录ID */
    id?: number;
    /** 用户ID */
    user_id?: number;
    /** 记录日期 */
    record_date?: string;
    /** 体重(kg) */
    weight?: number;
    /** 运动时长(分钟) */
    exercise_duration?: number;
    /** 运动类型 */
    exercise_type?: string;
    /** 睡眠时长(小时) */
    sleep_hours?: number;
    /** 睡眠质量 */
    sleep_quality?: "excellent" | "good" | "fair" | "poor";
    /** 心情状态 */
    mood?: "excellent" | "good" | "fair" | "poor";
    /** 备注 */
    notes?: string;
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
  };

  type LoginRequest = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
  };

  type LoginResponse = {
    success?: boolean;
    message?: string;
    data?: { token?: string; user?: User };
  };

  type patchAdminRolesIdStatusParams = {
    /** 角色ID */
    id: number;
  };

  type patchAdminUsersIdToggleStatusParams = {
    /** 用户ID */
    id: number;
  };

  type putAdminFoodsIdParams = {
    id: number;
  };

  type putAdminRolesIdMenusParams = {
    /** 角色ID */
    id: number;
  };

  type putAdminRolesIdParams = {
    /** 角色ID */
    id: number;
  };

  type putAdminUsersIdParams = {
    /** 用户ID */
    id: number;
  };

  type putAdminUsersIdRoleParams = {
    /** 用户ID */
    id: number;
  };

  type putFoodsIdParams = {
    /** 食物ID */
    id: number;
  };

  type putGoalsIdParams = {
    /** 目标ID */
    id: number;
  };

  type RegisterRequest = {
    /** 用户名(3-50字符,只能包含字母、数字和下划线) */
    username: string;
    /** 密码(6-50字符) */
    password: string;
    /** 昵称(1-50字符) */
    nickname: string;
    /** 邮箱 */
    email?: string;
  };

  type UpdateProfileRequest = {
    /** 昵称 */
    nickname?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号 */
    phone?: string;
    /** 性别 */
    gender?: "male" | "female";
    /** 出生日期 */
    birth_date?: string;
    /** 身高(cm) */
    height?: number;
    /** 目标体重(kg) */
    target_weight?: number;
  };

  type User = {
    /** 用户ID */
    id?: number;
    /** 用户名 */
    username?: string;
    /** 昵称 */
    nickname?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号 */
    phone?: string;
    /** 性别 */
    gender?: "male" | "female";
    /** 出生日期 */
    birth_date?: string;
    /** 身高(cm) */
    height?: number;
    /** 目标体重(kg) */
    target_weight?: number;
    /** 头像URL */
    avatar?: string;
    /** 用户角色 */
    role?: "user" | "admin";
    /** 账号状态 */
    is_active?: boolean;
    /** 创建时间 */
    created_at?: string;
    /** 最后登录时间 */
    last_login_at?: string;
  };

  type UserGoal = {
    /** 目标ID */
    id?: number;
    /** 用户ID */
    user_id?: number;
    /** 目标类型 */
    goal_type?: "weight" | "exercise" | "calories" | "custom";
    /** 目标名称 */
    goal_name?: string;
    /** 目标值 */
    target_value?: number;
    /** 当前值 */
    current_value?: number;
    /** 单位 */
    unit?: string;
    /** 开始日期 */
    start_date?: string;
    /** 目标日期 */
    target_date?: string;
    /** 状态 */
    status?: "active" | "completed" | "paused" | "cancelled";
    /** 目标描述 */
    description?: string;
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
  };
}
