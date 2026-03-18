import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { Task } from '../models/task';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getTasks(): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao listar tarefas:', error.message);
      return [];
    }

    return data as Task[];
  }

  async addTask(title: string): Promise<Task | null> {
    const { data, error } = await this.supabase
      .from('tasks')
      .insert([{ title, completed: false }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar tarefa:', error.message);
      return null;
    }

    return data as Task;
  }

  async updateTask(task: Task): Promise<Task | null> {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({
        title: task.title,
        completed: task.completed
      })
      .eq('id', task.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar tarefa:', error.message);
      return null;
    }

    return data as Task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao apagar tarefa:', error.message);
      return false;
    }

    return true;
  }
}
