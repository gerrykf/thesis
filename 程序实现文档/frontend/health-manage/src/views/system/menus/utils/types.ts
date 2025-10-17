// 菜单类型 0:菜单 1:iframe 2:外链 3:按钮
export type MenuType = 0 | 1 | 2 | 3;

// 菜单接口 - 完整版25个字段
export interface Menu {
  id?: number;
  parent_id: number;
  menu_type: MenuType;
  title: string;
  name?: string;
  path?: string;
  component?: string;
  rank: number;
  redirect?: string;
  icon?: string;
  extra_icon?: string;
  enter_transition?: string;
  leave_transition?: string;
  active_path?: string;
  auths?: string;
  frame_src?: string;
  frame_loading?: 0 | 1;
  keep_alive?: 0 | 1;
  hidden_tag?: 0 | 1;
  fixed_tag?: 0 | 1;
  show_link?: 0 | 1;
  show_parent?: 0 | 1;
  status: 0 | 1;
  created_at?: string;
  updated_at?: string;
  children?: Menu[];
}

// 菜单表单数据 - 完整版25个字段
export interface MenuFormData {
  id?: number;
  parent_id: number;
  menu_type: MenuType;
  title: string;
  name?: string;
  path?: string;
  component?: string;
  rank: number;
  redirect?: string;
  icon?: string;
  extra_icon?: string;
  enter_transition?: string;
  leave_transition?: string;
  active_path?: string;
  auths?: string;
  frame_src?: string;
  frame_loading?: 0 | 1;
  keep_alive?: 0 | 1;
  hidden_tag?: 0 | 1;
  fixed_tag?: 0 | 1;
  show_link?: 0 | 1;
  show_parent?: 0 | 1;
  status: 0 | 1;
}

// 菜单对话框状态
export interface MenuDialogState {
  visible: boolean;
  isEdit: boolean;
  loading: boolean;
  form: MenuFormData;
}

// 菜单树选项
export interface MenuTreeOption {
  value: number;
  label: string;
  children?: MenuTreeOption[];
}

// vue-pure-admin表单项属性 - 使用驼峰命名和boolean类型
export interface FormItemProps {
  /** 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）*/
  menuType: number;
  higherMenuOptions: Record<string, unknown>[];
  parentId: number;
  title: string;
  name: string;
  path: string;
  component: string;
  rank: number;
  redirect: string;
  icon: string;
  extraIcon: string;
  enterTransition: string;
  leaveTransition: string;
  activePath: string;
  auths: string;
  frameSrc: string;
  frameLoading: boolean;
  keepAlive: boolean;
  hiddenTag: boolean;
  fixedTag: boolean;
  showLink: boolean;
  showParent: boolean;
}

// vue-pure-admin表单Props
export interface FormProps {
  formInline: FormItemProps;
}
