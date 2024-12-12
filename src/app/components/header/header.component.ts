import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isActive: boolean = false;

  public handleActiveNavigation = () => {
    this.isActive = !this.isActive;
    console.log(this.isActive);
  }
}
