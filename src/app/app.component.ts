import { Component } from '@angular/core';
import { TodoComponent } from './components/todo/todo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoComponent],
  template: '<app-todo />'
})
export class AppComponent {}
