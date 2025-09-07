import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { TippyDirective } from '@ngneat/helipopper';

@Component({
  selector: 'app-cultures-select',
  standalone: true,
  imports: [TippyDirective],
  templateUrl: './cultures-select.component.html',
  styleUrl: './cultures-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CulturesSelectComponent {
  public translate = inject(TranslocoService);
  public cultures = [
    {
      id: 'vi',
      displayName: 'Tiếng Việt',
      icon: 'flag-icon-vn',
    },
    {
      id: 'en',
      displayName: 'English',
      icon: 'flag-icon-us',
    },
  ];

  public selectedCultureId = signal<string | undefined>(undefined);
  public selectedCulture = computed(() => {
    return this.cultures.find(
      (culture) => culture.id === this.selectedCultureId(),
    );
  });

  ngOnInit() {
    this.selectedCultureId.set(this.translate.getActiveLang());
  }

  public onLangChanges(culture: string) {
    this.translate.setActiveLang(culture);
    this.selectedCultureId.set(culture);
  }
}
