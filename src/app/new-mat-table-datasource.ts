import { MatTableDataSource } from '@angular/material/table';

export class NewMatTableDatasource<T> extends MatTableDataSource<T> {

  constructor(initialData: T[] = []) {
    super(initialData);
  }

  load(data: T[]) {
    this.data = data;
  }

  save(): T[] {
    return this.data;
  }

}
