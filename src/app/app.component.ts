import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ScenarioService } from './scenario.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular TestApp';
  scenarios: any[] = [];
  showAddUserForm = false;
  currentRoute: string;

  constructor(private scenarioService: ScenarioService, private authService: AuthService, private router: Router) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.handleLoginRedirect();
      }
    });
  }

  ngOnInit(): void {
    this.handleLoginRedirect();
    this.getScenarios();
  }

  handleLoginRedirect(): void {
    if (this.authService.isLoggedIn() && this.currentRoute === '/login') {
      this.router.navigate(['/menu']);
    } else if (!this.authService.isLoggedIn() && this.currentRoute !== '/login') {
      this.router.navigate(['/login']);
    }
  }

  getScenarios(): void {
    if (this.authService.isLoggedIn()) {
      this.scenarioService.getScenarios().subscribe(
        data => {
          this.scenarios = data;
        },
        error => {
          console.error('Error fetching scenarios', error);
        }
      );
    }
  }

  addScenario(): void {
    const newScenario = { name: 'New Scenario', user: 'User1', version: '1.0', state: 'Active' }; 
    this.scenarioService.addScenario(newScenario).subscribe(
      data => {
        this.scenarios.push(data);
      },
      error => {
        console.error('Error adding scenario', error);
      }
    );
  }

  isLoginPage(): boolean {
    return this.currentRoute === '/login';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
