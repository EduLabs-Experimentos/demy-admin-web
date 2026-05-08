import {Component, HostListener, inject, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {LanguageSwitcher} from '../language-switcher/language-switcher';
import {FooterContent} from '../footer-content/footer-content';
import {SideNavigationBar} from '../side-navigation-bar/side-navigation-bar';
import {IamStore} from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    LanguageSwitcher,
    FooterContent,
    SideNavigationBar
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  private store = inject(IamStore);
  private router = inject(Router);

  protected isSidenavOpen = false;
  protected isSidenavExpanded = signal(true);
  protected isMobile = signal(window.innerWidth < 1024);

  @HostListener('window:resize')
  onResize() {
    const mobile = window.innerWidth < 1024;
    this.isMobile.set(mobile);
    if (mobile) {
      this.isSidenavOpen = false;
    }
  }

  toggleSidenav(): void {
    if (this.isMobile()) {
      this.isSidenavOpen = !this.isSidenavOpen;
    } else {
      this.isSidenavExpanded.update(v => !v);
    }
  }

  closeSidenav(): void {
    this.isSidenavOpen = false;
  }

  onLogout(): void {
    this.isSidenavOpen = false;
    this.store.signOut(this.router);
  }
}
