import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, shareReplay, catchError, startWith, tap, filter, take } from 'rxjs/operators';
import { Tool } from '../models/tool.interface';
import { Category } from '../models/category.interface';

export interface FilterOptions {
  categories?: string[];
  platforms?: string[];
  licenses?: string[];
  maturity?: string[];
}

export interface SortOption {
  field: 'stars' | 'name' | 'added_at';
  direction: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  private tools$: Observable<Tool[]>;
  private categories$: Observable<Category[]>;
  private filters$ = new BehaviorSubject<FilterOptions>({});
  private searchQuery$ = new BehaviorSubject<string>('');
  private sortOption$ = new BehaviorSubject<SortOption>({ field: 'stars', direction: 'desc' });
  private toolsLoaded$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.tools$ = this.http.get<Tool[]>('assets/data/tools.json').pipe(
      shareReplay(1),
      tap(() => this.toolsLoaded$.next(true)),
      catchError(error => {
        console.error('Error loading tools data:', error);
        this.toolsLoaded$.next(true); // Mark as loaded even on error
        return of([]);
      })
    );

    // Initialize categories$ immediately to trigger HTTP request
    this.categories$ = this.http.get<{ categories: Category[] }>('assets/data/categories.json').pipe(
      map((data: { categories: Category[] }) => data.categories || []),
      shareReplay(1),
      catchError(error => {
        console.error('Error loading categories data:', error);
        return of([]);
      })
    );
    
    // Trigger the HTTP request by subscribing (will be shared via shareReplay)
    this.categories$.subscribe();
  }

  getToolsLoaded(): Observable<boolean> {
    // Return observable that emits true when tools are loaded
    // If already loaded, emit immediately; otherwise wait
    return this.toolsLoaded$.asObservable().pipe(
      filter(loaded => loaded === true), // Only emit when loaded is true
      take(1) // Take only the first true value
    );
  }

  getAllTools(): Observable<Tool[]> {
    return this.tools$;
  }

  getToolById(id: string): Observable<Tool | undefined> {
    return this.tools$.pipe(
      map(tools => tools.find(tool => tool.id === id))
    );
  }

  getFilteredAndSortedTools(): Observable<Tool[]> {
    return combineLatest([
      this.tools$.pipe(startWith([] as Tool[])),
      this.filters$,
      this.searchQuery$,
      this.sortOption$
    ]).pipe(
      map(([tools, filters, searchQuery, sortOption]) => {
        // Return empty array if tools haven't loaded yet
        if (!tools || tools.length === 0) {
          return [];
        }
        let filtered = [...tools];

        // Apply filters
        if (filters.categories && filters.categories.length > 0) {
          filtered = filtered.filter(tool =>
            filters.categories!.some(cat => tool.categories.includes(cat))
          );
        }

        if (filters.platforms && filters.platforms.length > 0) {
          filtered = filtered.filter(tool =>
            filters.platforms!.some(platform => tool.platforms.includes(platform))
          );
        }

        if (filters.licenses && filters.licenses.length > 0) {
          filtered = filtered.filter(tool =>
            filters.licenses!.includes(tool.license)
          );
        }

        if (filters.maturity && filters.maturity.length > 0) {
          filtered = filtered.filter(tool =>
            filters.maturity!.includes(tool.maturity)
          );
        }

        // Apply search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(tool =>
            tool.name.toLowerCase().includes(query) ||
            tool.summary.toLowerCase().includes(query) ||
            tool.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0;

          switch (sortOption.field) {
            case 'stars':
              const aStars = a.stars ?? 0;
              const bStars = b.stars ?? 0;
              comparison = aStars - bStars;
              break;
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            case 'added_at':
              const aDate = a.added_at ? new Date(a.added_at).getTime() : 0;
              const bDate = b.added_at ? new Date(b.added_at).getTime() : 0;
              comparison = aDate - bDate;
              break;
          }

          return sortOption.direction === 'asc' ? comparison : -comparison;
        });

        return filtered;
      })
    );
  }

  setFilters(filters: FilterOptions): void {
    this.filters$.next(filters);
  }

  setSearchQuery(query: string): void {
    this.searchQuery$.next(query);
  }

  setSortOption(sortOption: SortOption): void {
    this.sortOption$.next(sortOption);
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    return this.categories$.pipe(
      map(categories => categories.find(cat => cat.id === id))
    );
  }

  getAvailableCategories(): Observable<string[]> {
    return this.tools$.pipe(
      map(tools => {
        const categories = new Set<string>();
        tools.forEach(tool => {
          tool.categories.forEach(cat => categories.add(cat));
        });
        return Array.from(categories).sort();
      })
    );
  }

  getAvailablePlatforms(): Observable<string[]> {
    return this.tools$.pipe(
      map(tools => {
        const platforms = new Set<string>();
        tools.forEach(tool => {
          tool.platforms.forEach(platform => platforms.add(platform));
        });
        return Array.from(platforms).sort();
      })
    );
  }

  getAvailableLicenses(): Observable<string[]> {
    return this.tools$.pipe(
      map(tools => {
        const licenses = new Set<string>();
        tools.forEach(tool => licenses.add(tool.license));
        return Array.from(licenses).sort();
      })
    );
  }

  // GitHub stars integration with caching
  async fetchGitHubStars(tool: Tool): Promise<number | null> {
    if (!tool.github_repo) {
      return tool.stars ?? null;
    }

    const cacheKey = `github_stars_${tool.id}`;
    const cacheTimestampKey = `github_stars_timestamp_${tool.id}`;
    const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours

    // Check cache
    const cachedStars = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

    if (cachedStars && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp, 10);
      if (Date.now() - timestamp < cacheDuration) {
        return parseInt(cachedStars, 10);
      }
    }

    // Fetch from GitHub API
    try {
      const [owner, repo] = tool.github_repo.split('/');
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      const stars = data.stargazers_count;

      // Cache the result
      localStorage.setItem(cacheKey, stars.toString());
      localStorage.setItem(cacheTimestampKey, Date.now().toString());

      return stars;
    } catch (error) {
      console.error(`Error fetching GitHub stars for ${tool.github_repo}:`, error);
      return tool.stars ?? null;
    }
  }
}
