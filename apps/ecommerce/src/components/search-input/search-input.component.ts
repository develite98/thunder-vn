import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MixIconComponent } from '@mixcore/ui/icons';

@Component({
  selector: 'app-animated-input',
  templateUrl: './search-input.component.html',
  imports: [MixIconComponent, FormsModule],
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @ViewChild('theInput', { static: true })
  theInput!: ElementRef<HTMLInputElement>;

  readonly targetText = 'Xin chào, bạn cần gì hôm nay';
  displayText = signal(''); //
  private intervalId: any = null;

  isFocused = false;
  inputValue = '';

  typingSpeed = 60;

  public onSearch = output<string>();

  ngOnInit(): void {
    this.startTypingIfNeeded();
  }

  ngOnDestroy(): void {
    this.clearTyping();
  }

  onFocus() {
    this.isFocused = true;
    this.clearTyping();
  }

  onBlur() {
    this.isFocused = false;

    this.startTypingIfNeeded();
  }

  onInput() {
    if (this.inputValue && this.intervalId) {
      this.clearTyping();
    }
  }

  focusInput() {
    this.theInput.nativeElement.focus();
  }

  private startTypingIfNeeded() {
    if (this.isFocused) return;
    if (this.inputValue && this.inputValue.length > 0) return;

    this.clearTyping();
    let idx = 0;
    this.displayText.set('');

    this.intervalId = setInterval(() => {
      if (this.isFocused || (this.inputValue && this.inputValue.length > 0)) {
        this.clearTyping();
        return;
      }

      if (idx < this.targetText.length) {
        this.displayText.update((s) => (s += this.targetText[idx++]));
      } else {
        idx = 0;
        this.displayText.set('');
        this.displayText.update((s) => (s += this.targetText[idx++]));
      }
    }, this.typingSpeed);
  }

  private clearTyping() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public submit() {
    if (this.inputValue && this.inputValue.trim() !== '') {
      // Handle search logic here
      this.onSearch.emit(this.inputValue.trim());
    } else {
    }
  }
}
