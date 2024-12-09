import { Routes } from '@angular/router';
import { AboutComponent } from '../view/about/about.component';
import { HomeComponent } from '../view/home/home.component';
import { AmbientPadComponent } from '../view/ambient-pad/ambient-pad.component';

export const routes: Routes = [
    {path: '', redirectTo:'/home' , pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'about', component: AboutComponent},
    {path: 'ambient-pad', component: AmbientPadComponent},
];

