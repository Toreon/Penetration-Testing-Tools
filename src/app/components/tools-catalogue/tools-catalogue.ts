import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    MatChipsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule
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
  
  filterForm: FormGroup;
  searchControl: any;
  sortControl: any;
  
  private destroy$ = new Subject<void>();

  constructor(
    private toolsService: ToolsService,
    private fb: FormBuilder
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
    // Load available filter options
    this.toolsService.getAvailableCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(cats => this.categories = cats);

    this.toolsService.getAvailablePlatforms()
      .pipe(takeUntil(this.destroy$))
      .subscribe(platforms => this.platforms = platforms);

    this.toolsService.getAvailableLicenses()
      .pipe(takeUntil(this.destroy$))
      .subscribe(licenses => this.licenses = licenses);

    // Subscribe to filtered and sorted tools
    this.toolsService.getFilteredAndSortedTools()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tools => {
        this.filteredTools = tools;
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
}
