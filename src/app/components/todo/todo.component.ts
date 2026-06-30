import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoItem } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  todos: TodoItem[] = [];
  newTitle = '';
  editingId: number | null = null;
  editingTitle = '';
  error = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getAll().subscribe({
      next: todos => this.todos = todos,
      error: () => this.error = 'Failed to load todos.'
    });
  }

  addTodo(): void {
    const title = this.newTitle.trim();
    if (!title) return;
    this.todoService.create(title).subscribe({
      next: item => {
        this.todos.push(item);
        this.newTitle = '';
      },
      error: () => this.error = 'Failed to add todo.'
    });
  }

  toggleComplete(todo: TodoItem): void {
    this.todoService.update(todo.id, todo.title, !todo.isCompleted).subscribe({
      next: updated => {
        const idx = this.todos.findIndex(t => t.id === todo.id);
        if (idx !== -1) this.todos[idx] = updated;
      },
      error: () => this.error = 'Failed to update todo.'
    });
  }

  startEdit(todo: TodoItem): void {
    this.editingId = todo.id;
    this.editingTitle = todo.title;
  }

  saveEdit(todo: TodoItem): void {
    const title = this.editingTitle.trim();
    if (!title) return;
    this.todoService.update(todo.id, title, todo.isCompleted).subscribe({
      next: updated => {
        const idx = this.todos.findIndex(t => t.id === todo.id);
        if (idx !== -1) this.todos[idx] = updated;
        this.editingId = null;
      },
      error: () => this.error = 'Failed to save edit.'
    });
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  deleteTodo(id: number): void {
    this.todoService.delete(id).subscribe({
      next: () => this.todos = this.todos.filter(t => t.id !== id),
      error: () => this.error = 'Failed to delete todo.'
    });
  }

  get remaining(): number {
    return this.todos.filter(t => !t.isCompleted).length;
  }
}
