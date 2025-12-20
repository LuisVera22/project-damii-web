import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Busqueda } from '../../data-access/busqueda';
import { toast } from 'ngx-sonner';

export interface BusquedaRequest {
  query: string;
}

export interface Archivo {
  id: string;
  title: string;
  link: string;
  score: number;
  reason: string;
}

export interface BusquedaResponse {
  status: string;
  total: number;
  query: string;
  answer: string;
  files: Archivo[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styles: ``,
  host: { ngSkipHydration: 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Chat {
  private busquedaService = inject(Busqueda);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  query = '';
  loading = false;
  resultado: BusquedaResponse | null = null;
  busquedaEjecutada = false;
  huboError = false;


  private loadingToastId: string | number | null = null;

onBuscar() {
  const q = this.query.trim();
  if (!q) {
    toast.info('Escribe una consulta antes de buscar');
    return;
  }

  this.loading = true;
  this.resultado = null;
  this.busquedaEjecutada = true;
  this.huboError = false;
  this.cdr.markForCheck();

  this.loadingToastId = toast.loading('Buscando…');

  this.busquedaService
    .buscar(q)
    .pipe(
      finalize(() => {
        if (this.loadingToastId != null) {
          toast.dismiss(this.loadingToastId);
          this.loadingToastId = null;
        }

        this.ngZone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      })
    )
    .subscribe({
      next: (res) => {
        const safe = {
          status: res?.status ?? 'ok',
          total: Number(res?.total ?? 0),
          query: res?.query ?? q,
          answer: res?.answer ?? '',
          files: Array.isArray(res?.files) ? res.files : [],
        };

        this.ngZone.run(() => {
          this.resultado = safe;
          this.cdr.markForCheck();
        });

        if (safe.total > 0) toast.success(`Se encontraron ${safe.total} documento(s)`);
        else toast.info('No se encontraron documentos');
      },
      error: (err) => {
        console.error(err);

        this.ngZone.run(() => {
          this.resultado = {
            status: 'error',
            total: 0,
            query: q,
            answer: 'Ocurrió un error realizando la búsqueda.',
            files: [],
          };
          this.huboError = true;
          this.cdr.markForCheck();
        });

        toast.error('Error realizando la búsqueda');
      },
    });
}

}
