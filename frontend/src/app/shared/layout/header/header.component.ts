import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  navigateToDocuments() {
    this.router.navigate(['/documents']);
    this.closeMenu();
  }

  navigateToUpload() {
    this.router.navigate(['/documents/upload']);
    this.closeMenu();
  }

  navigateToCreate() {
    this.router.navigate(['/documents/create']);
    this.closeMenu();
  }
}
