import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Si usas ng2-charts:
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { AnalyticsService, BusquedaPorDia, DashboardResponse, DocumentoPopular, Kpis, UltimaBusqueda } from '../../data-access/analytics-service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './analytics.html',
  styles: ``,
})
export default class Analytics implements OnInit {
  loading = false;
  error: string | null = null;

  kpis: Kpis = {
    totalBusquedas: 0,
    totalDocumentos: 0,
    usuariosUnicos: 0
  };

  // Datos crudos
  busquedasPorDia: BusquedaPorDia[] = [];
  documentosPopulares: DocumentoPopular[] = [];
  ultimasBusquedas: UltimaBusqueda[] = [];

  // Datos para las gráficas
  busquedasChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  documentosChartData: ChartData<'pie'> = { labels: [], datasets: [] };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.loading = true;
    this.error = null;

    this.analyticsService.getDashboard().subscribe({
      next: (data: DashboardResponse) => {
        this.kpis = data.kpis;
        this.busquedasPorDia = data.busquedasPorDia;
        this.documentosPopulares = data.documentosPopulares;
        this.ultimasBusquedas = data.ultimasBusquedas;

        this.armarGraficos();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar las analíticas.';
        this.loading = false;
      }
    });
  }

  private armarGraficos(): void {
    // Gráfico de barras: búsquedas por día
    this.busquedasChartData = {
      labels: this.busquedasPorDia.map(b => b.dia),
      datasets: [
        {
          data: this.busquedasPorDia.map(b => b.total),
          label: 'Búsquedas'
        }
      ]
    };

    // Gráfico de torta: documentos populares
    this.documentosChartData = {
      labels: this.documentosPopulares.map(d => d.titulo),
      datasets: [
        {
          data: this.documentosPopulares.map(d => d.total)
        }
      ]
    };
  }
}
