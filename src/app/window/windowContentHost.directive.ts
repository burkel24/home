import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[window-content-host]',
})
export class WindowContentHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
