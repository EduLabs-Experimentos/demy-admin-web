import { Component, ViewChild } from '@angular/core';
import { StudentForm } from './components/student-form/student-form';
import { StudentList } from './components/student-list/student-list';
import { TranslatePipe } from '@ngx-translate/core';
import { Student } from '../../../domain/model/student.entity';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [StudentForm, StudentList, TranslatePipe],
  templateUrl: './students.html',
  styleUrl: './students.scss'
})
export class Students {
  @ViewChild('studentForm') studentFormComponent!: StudentForm;

  // Recibimos el evento de la lista y se lo pasamos al formulario
  onEditRequested(student: Student) {
    this.studentFormComponent.loadStudentForEdit(student);
  }
}
