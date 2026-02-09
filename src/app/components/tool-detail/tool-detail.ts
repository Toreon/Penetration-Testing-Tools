import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter, switchMap, take, first } from 'rxjs/operators';

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
    private toolsService: ToolsService,
    private cdr: ChangeDetectorRef
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
    this.tool = undefined;
    this.cdr.detectChanges();
    
    // First, ensure tools are loaded by subscribing to getAllTools
    // This will trigger the HTTP request if it hasn't been made yet
    this.toolsService.getAllTools()
      .pipe(
        filter(tools => tools.length > 0), // Wait until we have tools
        take(1), // Take the first emission with tools
        switchMap(() => this.toolsService.getToolById(id)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (tool) => {
          if (!tool) {
            this.loading = false;
            this.cdr.detectChanges();
            this.router.navigate(['/tools']);
            return;
          }
          this.tool = tool;
          this.loading = false;
          this.cdr.detectChanges();
          this.loadRelatedTools();
          this.loadGitHubStars();
        },
        error: (error) => {
          console.error('Error loading tool:', error);
          this.loading = false;
          this.cdr.detectChanges();
          this.router.navigate(['/tools']);
        }
      });
  }

  loadRelatedTools(): void {
    const relatedIds: string[] = [];
    
    if (this.tool?.related_tools && this.tool.related_tools.length > 0) {
      relatedIds.push(...this.tool.related_tools);
    }
    
    if (this.tool?.similar_tools && this.tool.similar_tools.length > 0) {
      relatedIds.push(...this.tool.similar_tools);
    }
    
    if (relatedIds.length === 0) {
      return;
    }

    this.toolsService.getAllTools()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tools => {
        this.relatedTools = tools.filter(t => 
          relatedIds.includes(t.id)
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
