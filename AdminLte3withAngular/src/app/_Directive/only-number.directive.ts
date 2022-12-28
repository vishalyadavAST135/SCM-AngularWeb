import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyNumber]'
})
export class OnlyNumberDirective {
  private el: NgControl;
  constructor(private ngControl: NgControl) {
    this.el = ngControl;
  }

  @Input() OnlyNumber: boolean;

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // Use NgControl patchValue to prevent the issue on validation
    this.el.control.patchValue(value.replace(/[^0-9]/g, ''));
  }

}
