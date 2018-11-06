import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.css']
})
export class CreateDepartmentComponent implements OnInit {

  departmentForm: FormGroup;
  constructor() { }

  ngOnInit() {

    this.departmentForm = new FormGroup({
      departmentName: new FormControl(),
      category: new FormControl()
    });
  }

  onSubmit(): void {
    console.log(this.departmentForm.value);
  }
  onLoadDataClick(): void {
    this.departmentForm.setValue({
      departmentName: 'IT',
      category: 'Technical'
    });    
  }
}
