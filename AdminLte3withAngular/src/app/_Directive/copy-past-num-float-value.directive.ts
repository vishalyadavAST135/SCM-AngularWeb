
import { Directive,ElementRef, HostListener  } from '@angular/core';

@Directive({
  selector: '[appCopyPastNumFloatValue]'
})
export class CopyPastNumFloatValueDirective {

  DIGITS_REGEXP =  new RegExp(/\D/g);
  constructor(private el: ElementRef) { 
      // Sanatize clipboard by removing any non-numeric input after pasting
      this.el.nativeElement.onpaste = (e:any) => {
          e.preventDefault();
          let text;
          let clp = (e.originalEvent || e).clipboardData;
          if (clp === undefined || clp === null) {
              text = (<any>window).clipboardData.getData('text') || '';
              if (text !== '') {
                 // text = text.replace(this.DIGITS_REGEXP, '');
                 text = text.replace(/[^0-9\\.]+/g, '');
                  if (window.getSelection) {
                      let newNode = document.createElement('span');
                      newNode.innerHTML = text;
                      window.getSelection().getRangeAt(0).insertNode(newNode);
                  } else {
                      (<any>window).selection.createRange().pasteHTML(text);
                  }
              }
          } else {
              text = clp.getData('text/plain') || '';
              if (text !== '') {
                  text = text.replace(/[^0-9\\.]+/g, '');
                  document.execCommand('insertText', false, text);
              }
          }
      };
  }

@HostListener('keydown', ['$event']) onKeyDown(event) {
  let e = <KeyboardEvent> event;
  if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
    // Allow: Ctrl+A
    (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
    // Allow: Ctrl+C
    (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
    // Allow: Ctrl+V
    (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
    // Allow: Ctrl+X
    (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
    // Allow: home, end, left, right
    (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
  }
}
