import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  NgZone,
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
  name: string;
  webViewLink: string;
  mimeType: string;
}

export interface BusquedaResponse {
  archivos: Archivo[];
  ok: boolean;
  total: number;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styles: ``,
  host: {
    ngSkipHydration: 'true',
  },
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

  onBuscar() {
    const q = this.query.trim();
    if (!q) {
      // Toast fuera de Angular para que no meta ruido en CD
      this.ngZone.runOutsideAngular(() => {
        toast.info('Escribe una consulta antes de buscar');
      });
      return;
    }

    // Estado inicial
    this.loading = true;
    this.resultado = null;
    this.busquedaEjecutada = true;
    this.huboError = false;
    this.cdr.markForCheck();

    this.ngZone.runOutsideAngular(() => {
      toast.loading('Buscando…');
    });

    this.busquedaService
      .buscar(q)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (res) => {
          this.ngZone.run(() => {
            this.resultado = res;
            this.cdr.markForCheck();
          });

          this.ngZone.runOutsideAngular(() => {
            if (res.total > 0) {
              toast.success(`Se encontraron ${res.total} documento(s)`);
            } else {
              toast.info('No se encontraron documentos');
            }
          });
        },
        error: (err) => {
          console.error(err);
          this.ngZone.run(() => {
            this.resultado = null;
            this.huboError = true;
            this.cdr.markForCheck();
          });

          this.ngZone.runOutsideAngular(() => {
            toast.error('Error realizando la búsqueda');
          });
        },
      });
  }
}