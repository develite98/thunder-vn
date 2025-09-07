import clone from 'lodash/clone';

export class ObjectUtils {
  static clone<T>(data: T | null | undefined): T {
    if (!data) {
      return {} as T;
    }

    if (typeof structuredClone === 'function') {
      return structuredClone(data);
    } else {
      return clone(data);
    }
  }
}
