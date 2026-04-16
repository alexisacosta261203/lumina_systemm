import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from './layout/app-header/app-header';
import { AppFooter } from './layout/app-footer/app-footer';
import { AppToast } from './shared/components/app-toast/app-toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeader, AppFooter, AppToast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'Lumina System';
}