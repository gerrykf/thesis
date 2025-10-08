import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import {
  postAuthLogin as getLogin,
  getAuthProfile,
  putAuthProfile
} from "@/api/auth";
// 使用 API 命名空间中的类型
type LoginResponse = API.LoginResponse;
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
    // 头像
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // 昵称
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 按钮级别权限
    permissions:
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
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
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
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
    /** 刷新`token` */
    async handRefreshToken(data: any) {
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
