import { Component, EventEmitter, inject, Output } from '@angular/core';
import { StudentsStore } from '../../../../../application/students';
import { Student } from '../../../../../domain/model/student.entity';
import { TranslatePipe } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [TableModule, InputTextModule, TranslatePipe],
  templateUrl: './student-list.html',
  styleUrl: './student-list.scss'
})
export class StudentList {
  protected store = inject(StudentsStore);

  // Emite el estudiante seleccionado hacia el componente padre
  @Output() editRequest = new EventEmitter<Student>();

  onEdit(student: Student) {
    this.editRequest.emit(student);
  }

  onDelete(id: number) {
    if(confirm('Are you sure you want to delete this student?')) {
      this.store.deleteStudent(id);
    }
  }
}
