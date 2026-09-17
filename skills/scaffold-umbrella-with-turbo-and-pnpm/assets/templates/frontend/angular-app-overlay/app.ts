import { Component } from '@angular/core';
import { ExampleCalculatorComponent } from '@umbrella/example-calculator-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExampleCalculatorComponent],
  template: `
    <main>
      <h1>Example calculator</h1>
      <example-calculator />
    </main>
  `,
})
export class App {}
