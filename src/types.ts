export interface CaseStudyData {
  overview: string;
  businessType: string;
  challenge: string;
  designApproach: string;
  uxStrategy: string;
  designDirection?: string;
  keyFeatures: string[];
  responsiveDesign: string;
  visualAndInteraction: string;
  developmentApproach: string;
  technologies: string[];
  outcome: string;
  gallery?: string[];
}

export interface Project {
  id: string;
  slug?: string;
  title: string;
  category: string;
  shortDescription: string;
  thumbnail: string;
  image?: string;
  video?: string;
  liveUrl: string;
  year: string;
  featured: boolean;
  published?: boolean;
  order?: number;
  technologies: string[];
  caseStudy: CaseStudyData;
}

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  iconName: string;
  highlights: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  bestFor: string;
  popular?: boolean;
  popularBadge?: string;
  features: string[];
  buttonText: string;
  priceNote?: string;
}

export interface PricingAddOn {
  name: string;
  price: string;
  description?: string;
}

export interface WhyUsReason {
  title: string;
  description: string;
  iconName: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  service?: string | null;
  budget?: string | null;
  message: string;
  read?: boolean;
  status?: string;
  created_at?: string;
}

export interface CMSService {
  id: string;
  number?: string;
  title: string;
  short_description?: string;
  full_description?: string;
  icon_url?: string;
  features?: string[];
  starting_price?: string;
  cta_text?: string;
  cta_url?: string;
  display_order?: number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CMSPricingPackage {
  id: string;
  name: string;
  price: string;
  currency?: string;
  description?: string;
  features?: string[];
  cta_text?: string;
  cta_url?: string;
  badge?: string;
  featured?: boolean;
  display_order?: number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CMSTestimonial {
  id: string;
  client_name: string;
  company?: string;
  role?: string;
  testimonial: string;
  photo_url?: string;
  rating?: number;
  featured?: boolean;
  display_order?: number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WebsiteContentItem {
  id: string;
  section: string;
  content_key: string;
  content_value: string;
  content_type?: string;
  updated_at?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  file_path: string;
  public_url: string;
  file_type?: string;
  file_size?: number;
  category?: string;
  created_at?: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: string;
  created_at?: string;
}
