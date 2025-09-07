export type TMenuItem = {
  activePath?: string;
  title: string;
  url: string;
  path?: string;
  icon?: string;
  iconColor?: string;
  children?: TMenuItem[];
  align?: 'top' | 'bottom';
  isDevelopment?: boolean;
  default?: boolean;
  group?: string;
  id?: string | number;
  open?: boolean;
  separator?: boolean;

  roles?: string[];
  permissions?: string[];
};

export type TGroupMenuItem = {
  pathMatch?: string | RegExp;
  group?: string;
  label?: string;
  items: TMenuItem[];
  permissions?: string[];
  roles?: string[];
};
