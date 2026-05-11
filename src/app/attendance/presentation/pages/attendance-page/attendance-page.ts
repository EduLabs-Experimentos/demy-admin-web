import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClassAttendanceStore } from '../../../application/class-attendance-store';
import { ClassAttendance } from '../../../domain/model/class-attendance.entity';

@Component({
  selector: 'app-attendance-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './attendance-page.html',
  styleUrl: './attendance-page.scss'
})
export class AttendancePage implements OnInit {
  protected store = inject(ClassAttendanceStore);

  selectedAttendanceId = signal<number | null>(null);
  sessionError = signal<string | null>(null);

  ngOnInit(): void {
    this.store.loadAll();
  }

  selectedAttendance(): ClassAttendance | undefined {
    const id = this.selectedAttendanceId();
    if (!id) return undefined;
    return this.store.attendances().find(a => a.id === id);
  }

  onSessionChange(value: string): void {
    this.selectedAttendanceId.set(value ? Number(value) : null);
    this.sessionError.set(null);
  }

  markPresent(dni: string): void {
    const id = this.selectedAttendanceId();
    if (!id) return;
    this.store.patchStatus(id, dni, 'PRESENT');
  }

  submit(): void {
    if (!this.selectedAttendanceId()) {
      this.sessionError.set('Please select a session first');
      return;
    }
  }
}
