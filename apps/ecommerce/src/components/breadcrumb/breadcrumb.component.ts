import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface IBreadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'mix-breadcrumb',
  imports: [RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  public items = input<IBreadcrumb[]>();
}
