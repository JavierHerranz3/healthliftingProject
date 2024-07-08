import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WelcomepageRoutingModule } from './welcomepage-routing.module';

@NgModule({
  declarations: [WelcomePageComponent],
  imports: [
    MatIconModule,
    CommonModule,
    MatIconButton,
    RouterModule,
    WelcomepageRoutingModule,
  ],
})
export class WelcomepageModule {}
