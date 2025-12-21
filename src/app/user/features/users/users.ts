import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

import { UserService, User } from '../../data-access/user-service';
import { AdminUsersService } from '../../data-access/admin-users';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.html',
})
export default class Users {
  private _userService = inject(UserService);
  private _adminUsersService = inject(AdminUsersService);
  private _fb = inject(FormBuilder);

  users$: Observable<User[]> = this._userService.getUsers();

  isCreateOpen = false;
  isSubmitting = false;

  // loading por userId para el toggle
  isToggling: Record<string, boolean> = {};

  createForm = this._fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    role: ['user', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  openCreate() {
    this.isCreateOpen = true;
    this.createForm.reset({
      firstName: '',
      lastName: '',
      role: 'user',
      email: '',
    });
  }

  closeCreate() {
    this.isCreateOpen = false;
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isCreateOpen) {
      this.closeCreate();
    }
  }

  async submitCreate() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    try {
      this.isSubmitting = true;
      const payload = this.createForm.getRawValue();
      await firstValueFrom(this._adminUsersService.createUser(payload as any));
      toast.success('Invitación enviada al correo');
      this.closeCreate();
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.status === 409
          ? 'El correo ya está registrado'
          : e?.error?.message ?? e?.message ?? 'No se pudo registrar';
      toast.error(msg);
    } finally {
      this.isSubmitting = false;
    }
  }

  hasError(name: string, error: string) {
    const c = this.createForm.get(name);
    return !!(c && c.touched && c.hasError(error));
  }

  // Activar / Desactivar: solo targets role admin o user
  async toggleActive(u: User) {
    if (u.role === 'superadmin') return;

    const next = !(u.active ?? true);

    try {
      this.isToggling[u.id] = true;
      await this._adminUsersService.setActive(u.id, next);
      toast.success(next ? 'Usuario activado' : 'Usuario desactivado');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? 'No se pudo actualizar el estado');
    } finally {
      this.isToggling[u.id] = false;
    }
  }
}
