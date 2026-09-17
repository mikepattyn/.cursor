import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Calculator } from '@umbrella/example-calculator';
import { createCalculatorClient } from '@umbrella/calculator-client';

const client = createCalculatorClient({ baseUrl: '/api' });

@Component({
  selector: 'example-calculator',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (submit)="$event.preventDefault()" [attr.aria-busy]="status() === 'loading'">
      <label>
        Left
        <input type="number" name="left" [(ngModel)]="left" />
      </label>
      <label>
        Right
        <input type="number" name="right" [(ngModel)]="right" />
      </label>
      <div>
        <button type="button" (click)="run('add')">Add</button>
        <button type="button" (click)="run('subtract')">Subtract</button>
        <button type="button" (click)="run('multiply')">Multiply</button>
        <button type="button" (click)="run('divide')">Divide</button>
      </div>
      @if (status() === 'loading') {
        <p>Loading saved value…</p>
      }
      @if (status() === 'saved') {
        <p role="status">Saved</p>
      }
      @if (status() === 'offline') {
        <p role="status">Result shown locally; persist is offline</p>
      }
      @if (result() !== null) {
        <p>Result: {{ result() }}</p>
      }
      @if (error()) {
        <p role="alert">{{ error() }}</p>
      }
    </form>
  `,
})
export class ExampleCalculatorComponent {
  private readonly calculator = new Calculator();

  left = 0;
  right = 0;
  readonly result = signal<number | null>(null);
  readonly error = signal<string | null>(null);
  readonly status = signal<'idle' | 'loading' | 'saved' | 'offline'>('loading');

  constructor() {
    void this.hydrate();
  }

  private async hydrate(): Promise<void> {
    const stored = await client.loadStoredValue();
    if (stored !== null) {
      this.result.set(stored);
    }
    this.status.set('idle');
  }

  run(operation: 'add' | 'subtract' | 'multiply' | 'divide'): void {
    this.error.set(null);
    try {
      const next = this.calculator[operation](Number(this.left), Number(this.right));
      this.result.set(next);
      void client.persistValue(next).then((ok) => {
        this.status.set(ok ? 'saved' : 'offline');
      });
    } catch (err) {
      this.result.set(null);
      this.error.set(err instanceof Error ? err.message : 'Calculation failed');
    }
  }
}
