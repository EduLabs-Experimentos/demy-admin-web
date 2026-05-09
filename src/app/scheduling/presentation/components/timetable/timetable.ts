import {Component, Input} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {TimetableGrid} from '../../../application/store/scheduling.store';

const COURSE_COLORS = [
  '#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed',
  '#0284c7', '#9333ea', '#ea580c', '#0d9488', '#4d7c0f', '#be185d'
];

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './timetable.html',
  styleUrl: './timetable.scss'
})
export class Timetable {
  @Input({required: true}) grid!: TimetableGrid;

  getCourseColor(courseName: string): string {
    let hash = 0;
    for (let i = 0; i < courseName.length; i++) {
      hash = (hash * 31 + courseName.charCodeAt(i)) & 0xffffffff;
    }
    return COURSE_COLORS[Math.abs(hash) % COURSE_COLORS.length];
  }

  getColumnWidth(): string {
    return `calc((100% - 72px) / ${this.grid.days.length})`;
  }
}
