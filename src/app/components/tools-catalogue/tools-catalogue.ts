import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ToolsService, FilterOptions, SortOption } from '../../services/tools.service';
import { Tool } from '../../models/tool.interface';

@Component({
  selector: 'app-tools-catalogue',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tools-catalogue.html',
  styleUrl: './tools-catalogue.scss'
})
export class ToolsCatalogue implements OnInit, OnDestroy {
  tools: Tool[] = [];
  filteredTools: Tool[] = [];
  categories: string[] = [];
  platforms: string[] = [];
  licenses: string[] = [];
  loading = true;
  filtersExpanded = true;
  
  filterForm!: FormGroup;
  searchControl!: any;
  sortControl!: any;
  
  private destroy$ = new Subject<void>();

  constructor(
    private toolsService: ToolsService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.searchControl = this.fb.control('');
    this.sortControl = this.fb.control('stars-desc');
    this.filterForm = this.fb.group({
      categories: this.fb.control([]),
      platforms: this.fb.control([]),
      licenses: this.fb.control([]),
      maturity: this.fb.control([])
    });
  }

  ngOnInit(): void {
    // Track when tools are actually loaded from HTTP
    this.toolsService.getToolsLoaded()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loaded: boolean) => {
        if (loaded) {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });

    // Subscribe to filtered and sorted tools
    this.toolsService.getFilteredAndSortedTools()
      .pipe(
        takeUntil(this.destroy$),
        tap(tools => {
          this.filteredTools = tools;
          this.cdr.detectChanges();
        })
      )
      .subscribe();

    // Load available filter options
    this.toolsService.getAvailableCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(cats => {
        this.categories = cats;
        this.cdr.detectChanges();
      });

    this.toolsService.getAvailablePlatforms()
      .pipe(takeUntil(this.destroy$))
      .subscribe(platforms => {
        this.platforms = platforms;
        this.cdr.detectChanges();
      });

    this.toolsService.getAvailableLicenses()
      .pipe(takeUntil(this.destroy$))
      .subscribe(licenses => {
        this.licenses = licenses;
        this.cdr.detectChanges();
      });

    // Watch for filter changes
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(filters => {
        this.toolsService.setFilters(filters as FilterOptions);
      });

    // Watch for search changes with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((query: string | null) => {
        this.toolsService.setSearchQuery(query || '');
      });

    // Watch for sort changes
    this.sortControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((sortValue: string | null) => {
        const [field, direction] = (sortValue || 'stars-desc').split('-');
        this.toolsService.setSortOption({ field: field as any, direction: direction as 'asc' | 'desc' });
      });

    // Set initial sort option
    const [field, direction] = (this.sortControl.value || 'stars-desc').split('-');
    this.toolsService.setSortOption({ field: field as any, direction: direction as 'asc' | 'desc' });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFilters(): void {
    this.filtersExpanded = !this.filtersExpanded;
  }

  get activeFiltersCount(): number {
    const filters = this.filterForm.value;
    let count = 0;
    if (filters.categories?.length) count += filters.categories.length;
    if (filters.platforms?.length) count += filters.platforms.length;
    if (filters.licenses?.length) count += filters.licenses.length;
    if (filters.maturity?.length) count += filters.maturity.length;
    return count;
  }

  clearFilters(): void {
    this.filterForm.reset({
      categories: [],
      platforms: [],
      licenses: [],
      maturity: []
    });
    this.searchControl.setValue('');
    this.sortControl.setValue('stars-desc');
  }

  toggleCategory(category: string): void {
    const current = this.filterForm.get('categories')?.value || [];
    const index = current.indexOf(category);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(category);
    }
    this.filterForm.get('categories')?.setValue([...current]);
  }

  isCategorySelected(category: string): boolean {
    return (this.filterForm.get('categories')?.value || []).includes(category);
  }

  togglePlatform(platform: string, checked: boolean): void {
    const current = this.filterForm.get('platforms')?.value || [];
    if (checked) {
      if (!current.includes(platform)) {
        this.filterForm.get('platforms')?.setValue([...current, platform]);
      }
    } else {
      this.filterForm.get('platforms')?.setValue(current.filter((p: string) => p !== platform));
    }
  }

  isPlatformSelected(platform: string): boolean {
    return (this.filterForm.get('platforms')?.value || []).includes(platform);
  }

  toggleMaturity(maturity: string): void {
    const current = this.filterForm.get('maturity')?.value || [];
    const index = current.indexOf(maturity);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(maturity);
    }
    this.filterForm.get('maturity')?.setValue([...current]);
  }

  isMaturitySelected(maturity: string): boolean {
    return (this.filterForm.get('maturity')?.value || []).includes(maturity);
  }

  formatCategory(category: string): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}
