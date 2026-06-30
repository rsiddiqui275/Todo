import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoItem } from '../models/todo.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly apiUrl = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.apiUrl);
  }

  create(title: string): Observable<TodoItem> {
    return this.http.post<TodoItem>(this.apiUrl, { title });
  }

  update(id: number, title: string, isCompleted: boolean): Observable<TodoItem> {
    return this.http.put<TodoItem>(`${this.apiUrl}/${id}`, { title, isCompleted });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
