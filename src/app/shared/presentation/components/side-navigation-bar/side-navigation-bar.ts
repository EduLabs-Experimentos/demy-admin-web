import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {UserService} from '../../../../iam/application/services/user.service';

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  icon: string;
  label: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-side-navigation-bar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './side-navigation-bar.html',
  styleUrl: './side-navigation-bar.scss'
})
export class SideNavigationBar {
  private readonly userService = inject(UserService);

  @Input() collapsed = false;
  @Output() logout = new EventEmitter<void>();
  @Output() navigated = new EventEmitter<void>();

  navSections: NavSection[] = [
    {
      title: 'sidebar.sections.overview',
      items: [
        { icon: 'pi pi-th-large', label: 'sidebar.dashboard', route: '/home', roles: ['ADMIN', 'TEACHER'] }
      ]
    },
    {
      title: 'sidebar.sections.academy',
      items: [
        { icon: 'pi pi-briefcase', label: 'sidebar.teachers', route: '/teachers', roles: ['ADMIN'] },
        { icon: 'pi pi-users', label: 'sidebar.students', route: '/students', roles: ['ADMIN'] }
      ]
    },
    {
      title: 'sidebar.sections.classes',
      items: [
        { icon: 'pi pi-calendar-clock', label: 'sidebar.academic-periods', route: '/academic-periods', roles: ['ADMIN'] },
        { icon: 'pi pi-book', label: 'sidebar.courses', route: '/courses', roles: ['ADMIN'] },
        { icon: 'pi pi-map', label: 'sidebar.classrooms', route: '/classrooms', roles: ['ADMIN'] },
        { icon: 'pi pi-calendar', label: 'sidebar.schedules', route: '/schedules', roles: ['ADMIN'] }
      ]
    },
    {
      title: 'sidebar.sections.administration',
      items: [
        { icon: 'pi pi-user-plus', label: 'sidebar.enrollment', route: '/enrollment', roles: ['ADMIN'] },
        { icon: 'pi pi-clock', label: 'sidebar.scheduling', route: '/search-schedules', roles: ['ADMIN'] },
        { icon: 'pi pi-credit-card', label: 'sidebar.billing', route: '/payments', roles: ['ADMIN'] },
        { icon: 'pi pi-wallet', label: 'sidebar.accounting', route: '/finance', roles: ['ADMIN'] }
      ]
    },
    {
      title: 'sidebar.sections.general',
      items: [
        { icon: 'pi pi-cog', label: 'sidebar.settings', route: '/settings', roles: ['ADMIN', 'TEACHER'] },
        { icon: 'pi pi-question-circle', label: 'sidebar.help', route: '/help', roles: ['ADMIN', 'TEACHER'] }
      ]
    }
  ];

  get visibleSections(): NavSection[] {
    const role = this.userService.getUserRole();
    return this.navSections
      .filter(section => section.title !== 'sidebar.sections.general')
      .map(section => ({
        title: section.title,
        items: section.items.filter(item => item.roles.includes(role))
      }))
      .filter(section => section.items.length > 0);
  }

  get bottomItems(): NavItem[] {
    const role = this.userService.getUserRole();
    const generalSection = this.navSections.find(s => s.title === 'sidebar.sections.general');
    return generalSection
      ? generalSection.items.filter(item => item.roles.includes(role))
      : [];
  }

  onNavigate() {
    this.navigated.emit();
  }

  onLogout() {
    this.userService.clearUserData();
    this.logout.emit();
  }
}
