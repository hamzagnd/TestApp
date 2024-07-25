import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  standalone: true,

  selector: '[tableColumnTemplate]'
})
export class ColumnTemplateDirective {
  @Input('tableColumnTemplate') columnName: string;

  constructor(public templateRef: TemplateRef<any>) {}
}
