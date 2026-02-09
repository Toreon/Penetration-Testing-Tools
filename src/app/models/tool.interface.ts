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
  image_url?: string;
  pricing?: {
    type: 'free' | 'paid' | 'freemium' | 'open_source';
    price?: string;
    currency?: string;
    notes?: string;
  };
  installation?: {
    methods: string[];
    commands?: string[];
    package_managers?: string[];
  };
  authors?: string[];
  maintainers?: string[];
  use_cases?: string[];
  compliance_mapping?: Record<string, string[]>;
  related_tools?: string[];
  similar_tools?: string[];
  added_at?: string;
}
