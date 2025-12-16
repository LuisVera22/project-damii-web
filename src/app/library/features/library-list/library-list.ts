import { Component, OnInit } from '@angular/core';
import { DriveService } from '../../data-access/drive-service';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { toast } from 'ngx-sonner';

export interface ArchivoDrive {
  id: string;
  nombre: string;
  tipo: string;
  creado: string;
  modificado: string;
  carpetaPadre: string | null;
  vistaWeb: string;
  icono: string;
}

export interface ListadoArchivosResponse {
  ok: boolean;
  archivos: ArchivoDrive[];
  nextPageToken?: string | null;
}

const FOLDER_MIME = 'application/vnd.google-apps.folder';

@Component({
  selector: 'app-library-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './library-list.html',
  styles: ``,
})
export default class LibraryList implements OnInit {
  archivos: ArchivoDrive[] = [];
  loading = false;
  error: string | null = null;
  nextPageToken: string | null = null;

  // navegación por carpetas
  currentFolderId: string | null = null;
  breadcrumb: ArchivoDrive[] = [];

  constructor(private driveService: DriveService) {}

  ngOnInit(): void {
    this.cargarArchivos();
  }

  esCarpeta(archivo: ArchivoDrive): boolean {
    return archivo.tipo === FOLDER_MIME;
  }

  cargarArchivos(mas: boolean = false): void {
    this.loading = true;

    if (!mas) {
      this.nextPageToken = null;
      // si quieres que mientras carga se vea solo el spinner:
      this.archivos = [];
    }

    const token = mas ? this.nextPageToken || undefined : undefined;
    const carpeta = this.currentFolderId || undefined;

    this.driveService
      .getArchivos(carpeta, token)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (resp) => {
          if (mas) {
            this.archivos = [...this.archivos, ...resp.archivos];
          } else {
            this.archivos = resp.archivos;
          }
          this.nextPageToken = resp.nextPageToken || null;
        },
        error: () => {
          this.error = 'Error al cargar los archivos.';
          toast.error('Error al cargar los archivos.');
        },
      });
  }

  abrirCarpeta(carpeta: ArchivoDrive): void {
    this.breadcrumb.push(carpeta);
    this.currentFolderId = carpeta.id;
    this.cargarArchivos(false);
  }

  volverAlInicio(): void {
    this.breadcrumb = [];
    this.currentFolderId = null;
    this.cargarArchivos(false);
  }
}
