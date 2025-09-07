import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  TrackByFunction,
} from '@angular/core';

import { MixIconComponent } from '@mixcore/ui/icons';
import { TippyDirective } from '@ngneat/helipopper';
import { ThemeStore } from './theme.store';

interface Theme {
  value: string;
  name: string;
}

@Component({
  selector: 'theme-select',
  standalone: true,
  imports: [MixIconComponent, TippyDirective],
  templateUrl: './theme-select.component.html',
  styleUrl: './theme-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSelectComponent {
  public readonly themeStore = inject(ThemeStore);

  public readonly themes = computed(() => this.themeStore.themes());

  public readonly trackByTheme: TrackByFunction<Theme> = (
    index: number,
    theme: Theme,
  ) => theme.value;

  public readonly onThemeSelect = (theme: Theme, hideCallback: () => void) => {
    hideCallback();
    this.themeStore.chooseTheme(theme.value);
  };
}
