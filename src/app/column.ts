export enum ColumnType {
  STRING = 'string',
  OPTIONS = 'options',
  DATE= 'date',
  CUSTOM='custom',
  BUTTON='button'
}

export class ColumnDefinition {
  constructor(public key: string, public header: string,  public type: ColumnType = ColumnType.STRING) {}
}
