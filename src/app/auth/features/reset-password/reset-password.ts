import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Auth,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from '@angular/fire/auth';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styles: ``,
})
export default class ResetPassword implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _auth = inject(Auth);
  private _fb = inject(FormBuilder);

  oobCode: string | null = null;
  email: string | null = null;

  loading = true;
  submitting = false;

  // control de estado para UI
  invalidLink = false;

  form = this._fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  ngOnInit() {
    this.oobCode = this._route.snapshot.queryParamMap.get('oobCode');
    const mode = this._route.snapshot.queryParamMap.get('mode');

    // Si el usuario tipeó la ruta: mostramos UI, NO toast
    if (!this.oobCode || mode !== 'resetPassword') {
      this.loading = false;
      this.invalidLink = true;
      return;
    }

    verifyPasswordResetCode(this._auth, this.oobCode)
      .then((email) => {
        this.email = email;
        this.loading = false;
      })
      .catch(() => {
        // Aquí sí puedes usar toast (ya hay interacción real de flujo)
        // pero igual mejor mostrar UI para no depender del toaster.
        this.loading = false;
        this.invalidLink = true;
      });
  }

  passwordsDoNotMatch() {
    const { password, confirmPassword } = this.form.value;
    return password && confirmPassword && password !== confirmPassword;
  }

  async submit() {
    if (this.form.invalid || this.passwordsDoNotMatch()) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.submitting = true;

      await confirmPasswordReset(
        this._auth,
        this.oobCode!,
        this.form.value.password!
      );

      toast.success('Contraseña creada correctamente');
      this._router.navigateByUrl('/auth/sign-in');
    } catch (e) {
      console.error(e);
      toast.error('No se pudo cambiar la contraseña');
    } finally {
      this.submitting = false;
    }
  }
}
