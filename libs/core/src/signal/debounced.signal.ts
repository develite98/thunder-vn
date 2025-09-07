import { Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

export function debouncedSignal<T>(
  signal: Signal<T>,
  time = 100,
): Signal<T | undefined> {
  const debouncedObservable$ = toObservable(signal).pipe(debounceTime(time));

  return toSignal(debouncedObservable$);
}
