/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectionToken } from '@angular/core';

export type ErrorMap = Record<string, (value: any) => string>;

export const ERROR_MAP = new InjectionToken<ErrorMap[]>('error map', {
  factory: () => [],
});

export const DEFAULT_ERROR_MAP: ErrorMap = {
  required: () => 'This field is required',
  minlength: ({ requiredLength, actualLength }) =>
    `Minimum length is ${requiredLength} characters, but got ${actualLength}.`,
  maxlength: ({ requiredLength, actualLength }) =>
    `Maximum length is ${requiredLength} characters, but got ${actualLength}.`,
  email: () => 'Please enter a valid email address.',
  pattern: ({ requiredPattern }) =>
    `The value does not match the required pattern: ${requiredPattern}`,
  min: ({ min, actual }) =>
    `The value should be greater than or equal to ${min}, but got ${actual}.`,
  max: ({ max, actual }) =>
    `The value should be less than or equal to ${max}, but got ${actual}.`,
  requiredTrue: () => 'This field must be checked.',

  // ---- Common Custom Validators ----
  passwordMismatch: () => 'Passwords do not match.',
  usernameTaken: () => 'This username is already taken.',
  invalidDate: () => 'Please enter a valid date.',
  futureDate: () => 'Date cannot be in the future.',
  pastDate: () => 'Date cannot be in the past.',
  invalidPhone: () => 'Please enter a valid phone number.',
  invalidUrl: () => 'Please enter a valid URL.',

  // ---- Async or custom server errors ----
  serverError: ({ message }) => message || 'An unknown server error occurred.',
};

export const provideFormError = (errorMap: ErrorMap) => {
  return [{ provide: ERROR_MAP, useValue: errorMap, multi: true }];
};
