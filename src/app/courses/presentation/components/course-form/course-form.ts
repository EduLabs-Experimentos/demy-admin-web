import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {CourseStore} from '../../../application/store/course.store';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, InputTextModule, TextareaModule, ButtonModule],
  templateUrl: './course-form.html',
  styleUrl: './course-form.scss'
})
export class CourseForm {
  protected readonly store = inject(CourseStore);

  isInvalid(field: 'name' | 'code' | 'description'): boolean {
    const formData = this.store.formData();
    if (field === 'name') {
      return !this.isValidName(formData.name) && formData.name.length > 0;
    }
    if (field === 'code') {
      return !this.isValidCode(formData.code) && formData.code.length > 0;
    }
    if (field === 'description') {
      return !formData.description?.trim() && formData.description.length > 0;
    }
    return false;
  }

  isValidName(name: string): boolean {
    if (!name) return false;
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(name.trim());
  }

  isValidCode(code: string): boolean {
    if (!code) return false;
    return /^[A-Z0-9]{2,10}$/.test(code.trim());
  }

  getErrorMessage(field: 'name' | 'code' | 'description'): string {
    const formData = this.store.formData();
    const value = field === 'name' ? formData.name : field === 'code' ? formData.code : formData.description;

    if (!value) return '';

    if (field === 'name') {
      if (value.length < 2) return 'Name must be at least 2 characters';
      if (value.length > 50) return 'Name must be at most 50 characters';
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'Name must only contain letters and spaces';
    }

    if (field === 'code') {
      if (value.length < 2) return 'Code must be at least 2 characters';
      if (value.length > 10) return 'Code must be at most 10 characters';
      if (!/^[A-Z0-9]+$/.test(value)) return 'Code must only contain uppercase letters and numbers';
    }

    if (field === 'description') {
      if (!value.trim()) return 'Description is required';
    }

    return '';
  }

  submit(): void {
    if (this.store.isEditing()) {
      this.store.updateCourse();
    } else {
      this.store.createCourse();
    }
  }
}
