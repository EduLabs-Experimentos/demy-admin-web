import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentsStore } from '../../../../../application/students';
import { Student } from '../../../../../domain/model/student.entity';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, ButtonModule, InputTextModule, SelectModule, DatePickerModule],
  templateUrl: './student-form.html',
  styleUrl: './student-form.scss'
})
export class StudentForm implements OnInit {
  protected store = inject(StudentsStore);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  isEdit = false;
  currentEditingId: number | null = null;

  sexOptions = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' }
  ];

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      studentCode: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      sex: [null, Validators.required],
      birthDate: [null, Validators.required],
      street: ['', Validators.required],
      district: ['', Validators.required],
      province: ['', Validators.required],
      department: ['', Validators.required],
      countryCode: ['+51', Validators.required]
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['email']) return 'Email inválido (ej: correo@ejemplo.com)';
    if (control.errors['pattern']) {
      if (field === 'firstName' || field === 'lastName') return 'Solo letras y espacios';
      if (field === 'dni') return 'Debe tener 8 dígitos';
      if (field === 'phone') return 'Debe tener 9 dígitos';
    }
    if (control.errors['minlength']) {
      if (field === 'dni') return 'Debe tener al menos 8 dígitos';
    }
    return 'Valor inválido';
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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
      street: formValues.street,
      district: formValues.district,
      province: formValues.province,
      department: formValues.department,
      countryCode: formValues.countryCode
    });

    if (this.isEdit) {
      this.store.updateStudent(studentData, () => this.resetForm());
    } else {
      this.store.addStudent(studentData, () => this.resetForm());
    }
  }

  loadStudentForEdit(student: Student) {
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
      birthDate: student.birthDate ? new Date(student.birthDate) : null,
      street: student.street,
      district: student.district,
      province: student.province,
      department: student.department,
      countryCode: student.countryCode || '+51'
    });
  }

  resetForm() {
    this.form.reset({ countryCode: '+51' });
    this.isEdit = false;
    this.currentEditingId = null;
    this.store.clearError();
  }
}
