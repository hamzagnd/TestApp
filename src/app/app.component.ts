import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ScenarioService } from './scenario.service';
import { AuthService } from './auth.service';
import { ScenarioStepperComponent } from './scenario-stepper/scenario-stepper.component';

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
  currentUser: any;

  constructor(
    private scenarioService: ScenarioService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.handleLoginRedirect();
      }
    });
  }

  ngOnInit(): void {
    this.authService.loadAuthState();
    this.handleLoginRedirect();
    this.getScenarios();
    this.currentUser = this.authService.getCurrentUser();
  }

  handleLoginRedirect(): void {
    if (this.authService.isLoggedIn() && this.currentRoute === '/login') {
      this.router.navigate(['/test']);
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

  openScenarioStepper(scenario: any): void {
    const dialogRef = this.dialog.open(ScenarioStepperComponent, {
      width: '90vw', 
      data: { scenario }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  isLoginPage(): boolean {
    return this.currentRoute === '/login';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
