import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { MixBackButtonComponent } from '../back-button/back-button.component';

@Component({
  selector: 'app-simple-header-m',
  standalone: true,
  imports: [MixBackButtonComponent],
  templateUrl: './simple-header.component.html',
  styleUrl: './simple-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixSimpleHeaderComponent {
  public pageTitle = input<string>('');
  public pageDescription = input<string>('');

  public router = inject(Router);
  public onBack = input<(() => void) | undefined>(undefined);
}
