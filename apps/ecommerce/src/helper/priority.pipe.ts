import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priority',
  standalone: true,
})
export class PrioritiyPipe implements PipeTransform {
  transform(value: any[], ...args: any[]): any[] {
    return value.sort((a, b) => a.priority - b.priority);
  }
}
