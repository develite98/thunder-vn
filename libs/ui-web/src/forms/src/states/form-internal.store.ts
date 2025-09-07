import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IFormControlSubmit } from '../types';

@Injectable()
export class FormInternalEvent {
  public formControlSubmitListener$ = new BehaviorSubject<
    IFormControlSubmit | undefined
  >(undefined);
}
