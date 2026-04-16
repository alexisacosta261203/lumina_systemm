import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeader {}