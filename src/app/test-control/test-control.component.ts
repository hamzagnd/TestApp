import { Component, OnInit } from '@angular/core';
import { TableData } from '../models/table-data.model';
import {MatTableDataSource} from "@angular/material/table";

interface Test{
  name: string;
  version: string;
  state: string;
  subItems?: Test[];

}

@Component({
  selector: 'app-test-control',
  templateUrl: './test-control.component.html',
  styleUrl: './test-control.component.css'
})
export class TestControlComponent implements OnInit{
  columns =['name','user' , 'version','state'];
  data: TableData<Test>[]=[
    new TableData({ name: 'deneme1', version: '20.3', state: 'geçti', subItems: [{ name: 'alt deneme1', version: '1.0', state: 'geçti' }] }),
    new TableData({ name: 'deneme2', version: '20.3', state: 'test edilmedi', subItems: [{ name: 'alt deneme2', version: '1.1', state: 'test edilmedi' }] }),
    new TableData({name:'deneme3', user: 'admin',version:'23.3',state:'geçti'}),
    new TableData({name:'deneme4', user: 'admin',version:'21.4',state:'kaldı'}),
    //new TableData({name:'deneme5',version:'22.8',state:'test edilmedi'}),
  ];

  dataSource : MatTableDataSource<TableData<Test>>;
  selectedTest: Test | null = null;
  expandedElement: Test = null;

  ngOnInit(): void {
    this.dataSource= new MatTableDataSource(this.data);
  }

  onNameClick(test: Test) {
    this.selectedTest = test;
  }
  onRowClick(test: Test) {
    this.selectedTest = test;
    this.expandedElement = this.expandedElement === test ? null : test;
  }


  closeStepper() {
    this.selectedTest = null;
  }







}
