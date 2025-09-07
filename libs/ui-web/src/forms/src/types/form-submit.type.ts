export interface IFormControlSubmit {
  field: string;
  newValue: string | Date | boolean | number | null;
  resetControl?: () => void;
}

export interface IFormSubmit<T> {
  field: string;
  newValue: string | Date | boolean | number | null;
  value: T;
  resetControl?: () => void;
}
