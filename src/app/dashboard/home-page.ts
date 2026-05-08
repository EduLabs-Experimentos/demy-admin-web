import {Component, inject} from '@angular/core';
import {IamStore} from '../iam/application/iam.store';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export class HomePage {
  protected store = inject(IamStore);
}
