export interface IExcelUser {
  username: string;
  displayName?: string;
  password?: string;
  email?: string;
  haveAccount?: boolean;
  haveStoreMember?: boolean;
  isChecking?: boolean;
}
