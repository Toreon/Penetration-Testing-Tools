import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { ToolsService } from '../../services/tools.service';
import { Tool } from '../../models/tool.interface';

@Component({
  selector: 'app-tool-detail',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './tool-detail.html',
  styleUrl: './tool-detail.scss'
})
export class ToolDetail implements OnInit, OnDestroy {
  tool: Tool | undefined;
  relatedTools: Tool[] = [];
  currentStars: number | null = null;
  loading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toolsService: ToolsService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params['id'];
        this.loadTool(id);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTool(id: string): void {
    this.loading = true;
    this.toolsService.getToolById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(tool => {
        if (!tool) {
          this.router.navigate(['/tools']);
          return;
        }
        this.tool = tool;
        this.loading = false;
        this.loadRelatedTools();
        this.loadGitHubStars();
      });
  }

  loadRelatedTools(): void {
    if (!this.tool?.related_tools || this.tool.related_tools.length === 0) {
      return;
    }

    this.toolsService.getAllTools()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tools => {
        this.relatedTools = tools.filter(t => 
          this.tool!.related_tools!.includes(t.id)
        );
      });
  }

  async loadGitHubStars(): Promise<void> {
    if (!this.tool) return;
    
    const stars = await this.toolsService.fetchGitHubStars(this.tool);
    this.currentStars = stars;
  }

  formatCategory(category: string): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}
