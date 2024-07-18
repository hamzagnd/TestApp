export enum ColumnType {
  STRING = 'string',
  ENUM = 'enum',
  DATE= 'date',
  CUSTOM='custom',
  BUTTON='button'
}

export class ColumnDefinition {
  constructor(public key: string, public header: string, public type: ColumnType = ColumnType.STRING) {}
}
