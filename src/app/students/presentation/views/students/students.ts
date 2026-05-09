import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentsStore } from '../../../application/students';
import { Student } from '../../../domain/model/student.entity';

// PrimeNG Imports (Actualizados para PrimeNG v18+)
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select'; // Reemplaza a DropdownModule
import { DatePickerModule } from 'primeng/datepicker'; // Reemplaza a CalendarModule
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    CardModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './students.html',
  styleUrl: './students.css'
})
export class Students implements OnInit {
  protected store = inject(StudentsStore);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  isEdit = false;
  currentEditingId: number | null = null;

  sexOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dni: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      studentCode: ['', Validators.required],
      phone: ['', Validators.required],
      sex: [null, Validators.required],
      birthDate: [null, Validators.required],
      // Nuevos controles de formulario
      street: ['', Validators.required],
      district: ['', Validators.required],
      province: ['', Validators.required],
      department: ['', Validators.required],
      countryCode: ['PE', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;

    const formValues = this.form.value;
    const studentData = new Student({
      id: this.currentEditingId || 0,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      dni: formValues.dni,
      emailAddress: formValues.emailAddress,
      studentCode: formValues.studentCode,
      phone: formValues.phone,
      sex: formValues.sex,
      birthDate: formValues.birthDate,
      // Pasamos la data al constructor
      street: formValues.street,
      district: formValues.district,
      province: formValues.province,
      department: formValues.department,
      countryCode: formValues.countryCode
    });

    if (this.isEdit) {
      this.store.updateStudent(studentData);
    } else {
      this.store.addStudent(studentData);
    }

    this.resetForm();
  }

  editStudent(student: Student) {
    this.isEdit = true;
    this.currentEditingId = student.id;
    this.form.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      dni: student.dni,
      emailAddress: student.emailAddress,
      studentCode: student.studentCode,
      phone: student.phone,
      sex: student.sex,
      birthDate: new Date(student.birthDate),
      // Cargar la data al editar
      street: student.street,
      district: student.district,
      province: student.province,
      department: student.department,
      countryCode: student.countryCode
    });
  }

  deleteStudent(id: number) {
    if(confirm('Are you sure you want to delete this student?')) {
      this.store.deleteStudent(id);
    }
  }

  resetForm() {
    this.form.reset();
    this.isEdit = false;
    this.currentEditingId = null;
  }
}
