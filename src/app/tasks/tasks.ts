import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SupabaseService } from '../services/supabase';
import { Task } from '../models/task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';

  constructor(private supabaseService: SupabaseService,
     private changeDetectorRef: ChangeDetectorRef) { }

  async ngOnInit(): Promise<void> {
    await this.loadTasks();
    this.changeDetectorRef.detectChanges();
  }

  async loadTasks(): Promise<void> {
    this.tasks = await this.supabaseService.getTasks();
    console.log('Tarefas carregadas:', this.tasks);
  }

  async addTask(): Promise<void> {
    const title = this.newTaskTitle.trim();

    if (!title) {
      return;
    }

    const createdTask = await this.supabaseService.addTask(title);

    if (createdTask) {
      this.tasks.unshift(createdTask);
      this.newTaskTitle = '';
      this.changeDetectorRef.detectChanges();
    }
  }

  async toggleTask(task: Task): Promise<void> {
    const updatedTask: Task = {
      ...task,
      completed: !task.completed
    };

    const result = await this.supabaseService.updateTask(updatedTask);

    if (result) {
      this.tasks = this.tasks.map(t =>
        t.id === result.id ? result : t
      );
      this.changeDetectorRef.detectChanges();
    }
  }

  async editTask(task: Task): Promise<void> {
    const newTitle = prompt('Novo título da tarefa:', task.title);

    if (newTitle === null) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    const updatedTask: Task = {
      ...task,
      title: trimmedTitle
    };

    const result = await this.supabaseService.updateTask(updatedTask);

    if (result) {
      this.tasks = this.tasks.map(t =>
        t.id === result.id ? result : t
      );
      this.changeDetectorRef.detectChanges();
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    const confirmed = confirm('Tens a certeza que queres apagar esta tarefa?');

    if (!confirmed) {
      return;
    }

    const deleted = await this.supabaseService.deleteTask(taskId);

    if (deleted) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      this.changeDetectorRef.detectChanges();
    }
  }
}
