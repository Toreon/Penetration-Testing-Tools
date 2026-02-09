export interface Tool {
  id: string;
  name: string;
  summary: string;
  description?: string;
  categories: string[];
  tags: string[];
  platforms: string[];
  license: string;
  maturity: 'stable' | 'active' | 'experimental' | 'archived';
  website?: string;
  docs_url?: string;
  download_url?: string;
  github_repo?: string | null;
  stars?: number | null;
  use_cases?: string[];
  compliance_mapping?: Record<string, string[]>;
  related_tools?: string[];
  added_at?: string;
}
