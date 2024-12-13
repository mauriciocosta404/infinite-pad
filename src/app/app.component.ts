import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from "../view/home/home.component";
import { AboutComponent } from "../view/about/about.component";
import { AmbientPadComponent } from "../view/ambient-pad/ambient-pad.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, HomeComponent, AboutComponent, AmbientPadComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'worship-pad-loop';
}
