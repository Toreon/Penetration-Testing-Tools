import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ToolsService } from '../../services/tools.service';
import { Category } from '../../models/category.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-about',
  imports: [MatCardModule, CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About implements OnInit, OnDestroy {
  categories: Category[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private toolsService: ToolsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.toolsService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories: Category[]) => {
        this.categories = categories;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
