import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { CustomValidators } from '../shared/custom.validators';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
 export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  // fullNameLength = 0;

  validationMessages = {
    'fullName': {
      'required': 'Full Name is required',
      'minlength': 'Full Name must be greater than 2 characters',
      'maxlength': 'Full Name must be less than 10 characters',
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domain should be as specified'
    },
    'confirmEmail': {
      'required': 'Confirm email is required.'
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm Email do not match'
    },
    'phone': {
      'required': 'Phone is required'
      },
    'skillName': {
      'required': 'Skill Name is required.'
    },
    'experienceInYears': {
      'required': 'Experience is required.'
    },
    'proficiency': {
      'required': 'Proficiency is required.'
    },

  };

  formErrors = {
    'fullName': '',
    'email': '',
    'confirmEmail': '',
    'emailGroup': '',
    'phone': '',
    'skillName': '',
    'experienceInYears': '',
    'proficiency': '',
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('srayalil.com')]],
        confirmEmail: ['', Validators.required],
      }, { validator: matchEmail }),
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });

    // this.employeeForm.get('fullName').valueChanges.subscribe(
    //   (value: string) => {
    //     this.fullNameLength = value.length;
    //     console.log(value);
    //  });
     this.employeeForm.valueChanges.subscribe(
      (value: any) => {
        this.logValidationErrors(this.employeeForm);
       });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    });
  }
  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  onLoadDataClick(): void {
     this.employeeForm.setValue({
       fullName: 'sree',
       email: 'sreedevivp4u@gmail.com',
       skills: {
        skillName: 'C#',
        experienceInYears: 8,
        proficiency: 'beginner'
      }
     });
     this.employeeForm.patchValue({
      fullName: 'sreedevi'
     });
    // const formArray = new FormArray([
    //  new FormControl('John', Validators.required),
    //  new FormGroup({
    //    country: new FormControl('', Validators.required)
    //  }),
    //  new FormArray([])
    // ]);
    // console.log(formArray.length);
    // for (const control of formArray.controls) {
    //  if (control instanceof FormControl) {
    //    console.log('control is FormControl');
    //  }
    //  if (control instanceof FormGroup) {
    //    console.log('control is FormGroup');
    //  }
    //  if (control instanceof FormArray) {
    //    console.log('control is FormArray');
    //  }
    // }
    // const formArray1 = this.fb.array([
    //  new FormControl('John', Validators.required),
    //  new FormControl('IT', Validators.required)
    // ]);
    // formArray1.push(new FormControl('Male', Validators.required));
    // console.log(formArray1.at(2).value);
  }
  onContactPreferenceChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    const emailControl = this.employeeForm.get('email');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
      emailControl.clearValidators();
    } else {
      phoneControl.clearValidators();
      emailControl.setValidators(Validators.required);
    }
    phoneControl.updateValueAndValidity();
    emailControl.updateValueAndValidity();
  }
  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }
  onSubmit(): void {
    console.log(this.employeeForm.touched);
    console.log(this.employeeForm.value);

    console.log(this.employeeForm.controls.fullName.touched);
    console.log(this.employeeForm.get('fullName').value);
  }

  // onLogKeyValues(): void {
  //   this.logValidationErrors(this.employeeForm);
  //   console.log(this.formErrors);
  // }
  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach(
      (key: string) => {
        const abstractControl = group.get(key);
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
        if (abstractControl instanceof FormGroup) {
          this.logValidationErrors(abstractControl);
          // abstractControl.disable();
        }
        if (abstractControl instanceof FormArray) {
          for (const control of abstractControl.controls) {
            if (control instanceof FormGroup) {
              this.logValidationErrors(control);
            }
          }
           // abstractControl.disable();
        }
      });
  }
}
function matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if (emailControl.value === confirmEmailControl.value || confirmEmailControl.pristine) {
    return null;
  } else {
    return { 'emailMismatch': true };
  }
}
