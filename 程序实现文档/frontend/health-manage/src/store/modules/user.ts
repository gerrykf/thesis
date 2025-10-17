import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import { postAuthLogin as getLogin } from "@/api/auth";
import { getAdminMenus } from "@/api/admin";
// 使用 API 命名空间中的类型
type User = API.User;

type UserResult = {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
};

type RefreshTokenResult = {
  success: boolean;
  data: {
    token: string;
  };
};
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";

export const useUserStore = defineStore("pure-user", {
  state: (): userType => ({
    // 用户ID
    userId: storageLocal().getItem<DataInfo<number>>(userKey)?.userId ?? 0,
    // 头像
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // 昵称
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
    // 页面级别权限（角色）
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 按钮级别权限（权限标识列表）
    permissions:
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    // 用户菜单权限（从后端获取的菜单树）
    userMenus: [],
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7,
    // 登录页面当前页 0: 账号登录 1: 手机登录 2: 二维码登录 3: 注册 4: 忘记密码
    currentPage: 0,
    // 验证码
    verifyCode: ""
  }),
  actions: {
    /** 存储用户ID */
    SET_USERID(userId: number) {
      this.userId = userId;
    },
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储用户菜单 */
    SET_USER_MENUS(menus: any[]) {
      this.userMenus = menus;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 设置登录页面当前页 */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** 设置验证码 */
    SET_VERIFYCODE(value: string) {
      this.verifyCode = value;
    },
    /** 登入 */
    async loginByUsername(data: API.LoginRequest) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(apiResponse => {
            // 由于响应拦截器的处理，apiResponse 实际是服务器返回的 data 部分
            // 需要按照实际的数据结构来处理
            const response = apiResponse as API.LoginResponse;
            if (response?.success && response.data) {
              // 适配 setToken 需要的数据格式
              const tokenData = {
                accessToken: response.data.token || "",
                refreshToken: response.data.token || "", // 暂时使用同一个token
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后过期
                userId: response.data.user?.id || 0,
                avatar: response.data.user?.avatar || "",
                username: response.data.user?.username || "",
                nickname: response.data.user?.nickname || "",
                roles: [response.data.user?.role || "admin"], // 临时设为admin测试菜单
                permissions: []
              };
              setToken(tokenData);

              // 构造返回数据格式
              const userResult: UserResult = {
                success: true,
                data: {
                  user: response.data.user || ({} as User),
                  token: response.data.token || ""
                }
              };
              resolve(userResult);
            } else {
              reject(new Error("登录失败"));
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 获取用户权限菜单 */
    async getUserPermissions() {
      return new Promise<any>((resolve, reject) => {
        getAdminMenus()
          .then(response => {
            if (response && response.data) {
              const menus = response.data;

              // 提取所有权限标识
              const permissions: string[] = [];
              const extractPermissions = (menuList: any[]) => {
                menuList.forEach(menu => {
                  if (menu.permission) {
                    permissions.push(menu.permission);
                  }
                  if (menu.children && menu.children.length > 0) {
                    extractPermissions(menu.children);
                  }
                });
              };
              extractPermissions(menus);

              // 存储到 store 和 localStorage
              this.SET_USER_MENUS(menus);
              this.SET_PERMS(permissions);

              // 更新 localStorage 中的权限信息
              const userInfo =
                storageLocal().getItem<DataInfo<number>>(userKey);
              if (userInfo) {
                userInfo.permissions = permissions;
                storageLocal().setItem(userKey, userInfo);
              }

              resolve({ menus, permissions });
            } else {
              reject(new Error("获取用户权限失败"));
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 刷新`token` */
    async handRefreshToken(data: any) {
      console.log("触发刷新token", data);
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        // TODO: 实现刷新token API
        // refreshTokenApi(data)
        //   .then(data => {
        //     if (data) {
        //       setToken(data.data);
        //       resolve(data);
        //     }
        //   })
        //   .catch(error => {
        //     reject(error);
        //   });

        // 临时实现：直接reject
        reject(new Error("刷新token功能未实现"));
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
