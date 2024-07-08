import { Component, OnInit } from '@angular/core';
import { ScenarioService } from './scenario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular TestApp';
  scenarios: any[] = [];
  showAddUserForm = false;

  constructor(private scenarioService: ScenarioService) { }

  ngOnInit(): void {
    this.getScenarios();
  }

  getScenarios(): void {
    this.scenarioService.getScenarios().subscribe(
      data => {
        this.scenarios = data;
      },
      error => {
        console.error('Error fetching scenarios', error);
      }
    );
  }

  addScenario(): void {
    const newScenario = { name: 'New Scenario', user: 'User1', version: '1.0', state: 'Active' }; // Örnek senaryo verisi
    this.scenarioService.addScenario(newScenario).subscribe(
      data => {
        this.scenarios.push(data);
      },
      error => {
        console.error('Error adding scenario', error);
      }
    );
  }
}
