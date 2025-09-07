import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { MixIconComponent } from '@mixcore/ui/icons';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-landing-page',
  imports: [NavBarComponent, MixIconComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements AfterViewInit {
  [x: string]: any;

  public box1 = viewChild<ElementRef<HTMLElement>>('box1');
  public runner1 = viewChild<ElementRef<HTMLElement>>('runner1');

  public box2 = viewChild<ElementRef<HTMLElement>>('box2');
  public runner2 = viewChild<ElementRef<HTMLElement>>('runner2');

  public box3 = viewChild<ElementRef<HTMLElement>>('box3');
  public runner3 = viewChild<ElementRef<HTMLElement>>('runner3');

  public box4 = viewChild<ElementRef<HTMLElement>>('box4');
  public runner4 = viewChild<ElementRef<HTMLElement>>('runner4');

  public runner1Path = signal('');

  public data = [
    {
      displayName: 'Page',
      tools: [
        {
          displayName: 'Create new page',
          icon: 'plus',
          isNew: true,
        },
        {
          displayName: 'Update a page',
          icon: 'plus',
          isNew: true,
        },
        {
          displayName: `Sumary page`,
          icon: 'chart-no-axes-combined',
        },
      ],
    },
    {
      displayName: 'Workplace',
      description: 'Create a blog post about a topic',
      tools: [
        {
          displayName: 'Create new task',
          icon: 'plus',
        },
        {
          displayName: 'Find my task',
          icon: 'search',
        },
      ],
    },
    {
      displayName: 'More tools',
      description: 'Create a blog post about a topic',
      tools: [
        {
          displayName: 'Search on the web',
          icon: 'search',
        },
        {
          displayName: 'Ask me anything',
          icon: 'circle-question-mark',
        },
      ],
    },
  ];

  ngAfterViewInit() {
    this.applyRunner(this.box1()?.nativeElement, this.runner1()?.nativeElement);
    this.applyRunner(this.box2()?.nativeElement, this.runner2()?.nativeElement);
    this.applyRunner(this.box3()?.nativeElement, this.runner3()?.nativeElement);
    this.applyRunner(this.box4()?.nativeElement, this.runner4()?.nativeElement);
  }

  public applyRunner(
    box: HTMLElement | undefined,
    dot: HTMLElement | undefined,
  ) {
    if (!box || !dot) return;

    const rect = box.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const r = parseFloat('36') || 0;

    const path = `M ${r},0 H ${w - r} A ${r},${r} 0 0 1 ${w},${r} V ${h - r} A ${r},${r} 0 0 1 ${w - r},${h} H ${r} A ${r},${r} 0 0 1 0,${h - r} V ${r} A ${r},${r} 0 0 1 ${r},0 Z`;

    try {
      dot.style.offsetPath = `path('${path}')`;
    } catch (error) {
      console.log('Error when setting path animation: ', error);
    }
  }
}
