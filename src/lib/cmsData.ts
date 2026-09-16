import { Project, ServiceItem, PricingPlan, Inquiry, CMSService, CMSPricingPackage, CMSTestimonial, WebsiteContentItem, MediaAsset, AdminUser } from '../types';
import { getSupabase } from './supabase';
import { PROJECTS_DATA, SERVICES_DATA, PRICING_PLANS } from '../data';
import { normalizeLiveUrl } from './projectUrl';

// ============================================================================
// DEFAULT FALLBACKS
// ============================================================================

export const DEFAULT_TESTIMONIALS: CMSTestimonial[] = [
  {
    id: 't-1',
    client_name: 'Elena Vance',
    company: 'Vance & Sterling Legal Tech',
    role: 'Founder & Managing Director',
    testimonial: 'AMAAS transformed our enterprise website into an ultra-fast client conversion engine. The bespoke animations, instant sub-second response times, and thoughtful case study flow exceeded our expectations.',
    rating: 5,
    featured: true,
    display_order: 1,
    active: true,
  },
  {
    id: 't-2',
    client_name: 'Marcus K.',
    company: 'Atelier Aura Wellness',
    role: 'Brand Director',
    testimonial: 'From direct appointment inquiry workflows to seamless mobile responsiveness, AMAAS delivered our flagship platform on time and flawlessly engineered. Highly recommended for international brands.',
    rating: 5,
    featured: true,
    display_order: 2,
    active: true,
  },
  {
    id: 't-3',
    client_name: 'Sophia Chen',
    company: 'Lumière Goods',
    role: 'Head of E-Commerce',
    testimonial: 'The level of craftsmanship in both the UI and backend logic is unmatched. The website handles traffic surges smoothly and our customer inquiry rates doubled in the first month.',
    rating: 5,
    featured: true,
    display_order: 3,
    active: true,
  },
];

// ============================================================================
// AUTHORIZATION
// ============================================================================

/**
 * Checks if the authenticated user is an authorized admin in public.admin_users
 */
export async function checkIsAdmin(userId: string, email?: string): Promise<{ isAdmin: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { isAdmin: false, error: 'Database client not configured' };

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      // If table does not exist in schema cache yet, log and inform
      if (error.code === 'PGRST205' || error.message.includes('admin_users')) {
        console.warn('admin_users table not yet created in Supabase schema.');
        return { isAdmin: false, error: 'admin_users_table_missing' };
      }
      return { isAdmin: false, error: error.message };
    }

    if (data && (data.role === 'admin' || data.role === 'superadmin' || data.role === 'owner')) {
      return { isAdmin: true };
    }

    return { isAdmin: false, error: 'User does not have admin permissions in admin_users table.' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown authorization error';
    return { isAdmin: false, error: msg };
  }
}

// ============================================================================
// INQUIRIES CMS
// ============================================================================

export async function fetchInquiries(): Promise<{ inquiries: Inquiry[]; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { inquiries: [], error: 'Supabase client not configured' };

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { inquiries: [], error: error.message };
    }
    return { inquiries: (data as Inquiry[]) || [] };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to load inquiries';
    return { inquiries: [], error: msg };
  }
}

export async function markInquiryRead(id: string, read: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase client not configured' };

  try {
    const { error } = await supabase
      .from('inquiries')
      .update({ read, status: read ? 'reviewed' : 'new' })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Update failed' };
  }
}

export async function deleteInquiry(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase client not configured' };

  try {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Delete failed' };
  }
}

// ============================================================================
// PROJECTS CMS
// ============================================================================

export async function fetchProjectsFromDB(): Promise<{ projects: Project[]; fromDb: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { projects: [], fromDb: false, error: 'Database not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      return { projects: [], fromDb: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { projects: [], fromDb: true };
    }

    // Map database rows to Project interface
    const mapped: Project[] = data.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug || undefined,
      category: row.category || 'Full-Stack Web App',
      shortDescription: row.short_description || '',
      thumbnail: row.thumbnail_url || '',
      image: row.thumbnail_url || undefined,
      video: row.video_url || undefined,
      liveUrl: normalizeLiveUrl(row.project_url) || (row.project_url && row.project_url !== '#' ? row.project_url : ''),
      year: row.project_date || '2026',
      featured: Boolean(row.featured),
      published: row.published !== false,
      order: row.display_order ?? 0,
      technologies: Array.isArray(row.technologies) ? row.technologies : [],
      caseStudy: row.case_study && typeof row.case_study === 'object' ? row.case_study : {
        overview: row.full_description || row.short_description || '',
        businessType: row.client_name || row.category || '',
        challenge: '',
        designApproach: '',
        uxStrategy: '',
        keyFeatures: [],
        responsiveDesign: '',
        visualAndInteraction: '',
        developmentApproach: '',
        technologies: Array.isArray(row.technologies) ? row.technologies : [],
        outcome: '',
        gallery: Array.isArray(row.gallery) ? row.gallery : [],
      },
    }));

    return { projects: mapped, fromDb: true };
  } catch (err: unknown) {
    return { projects: [], fromDb: false, error: err instanceof Error ? err.message : 'Fetch failed' };
  }
}

export async function saveProjectToDB(proj: Project): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Database not configured' };

  // Check auth session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { success: false, error: 'Admin session expired. Please log in again.' };
  }

  try {
    const payload = {
      id: proj.id,
      title: proj.title,
      slug: proj.slug || null,
      short_description: proj.shortDescription,
      full_description: proj.caseStudy?.overview || proj.shortDescription,
      category: proj.category,
      client_name: proj.caseStudy?.businessType || null,
      technologies: proj.technologies || [],
      thumbnail_url: proj.thumbnail,
      gallery: proj.caseStudy?.gallery || [],
      video_url: proj.video || null,
      project_url: normalizeLiveUrl(proj.liveUrl),
      project_date: proj.year,
      featured: proj.featured,
      published: proj.published !== false,
      display_order: proj.order ?? 0,
      case_study: proj.caseStudy,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('projects')
      .upsert(payload, { onConflict: 'id' });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Save failed' };
  }
}

/**
 * Toggles or updates the published/hidden status of a project in Supabase without touching media or deleting the row.
 */
export async function toggleProjectPublishStatus(id: string, published: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Database not configured' };

  // Verify auth session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { success: false, error: 'Admin session expired. Please log in again.' };
  }

  try {
    const { error } = await supabase
      .from('projects')
      .update({
        published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update publication status' };
  }
}

export async function deleteProjectFromDB(id: string): Promise<{ success: boolean; deleted: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn('[CMS Delete Diagnostic] Database client is not configured.');
    return { success: false, deleted: false, error: 'Database not configured' };
  }

  // 1. Verify authenticated session
  const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr || !session || !session.user) {
    console.warn('[CMS Delete Diagnostic] Outcome [A: No authenticated session]:', {
      hasSession: Boolean(session),
      sessionError: sessionErr?.message,
      targetProjectId: id,
    });
    return {
      success: false,
      deleted: false,
      error: 'Admin session expired or invalid. Please log in again.',
    };
  }

  const authenticatedUserId = session.user.id;
  const authenticatedUserEmail = session.user.email;

  // 2. Verify admin authorization via admin_users table (matches project architecture)
  const { isAdmin, error: adminErr } = await checkIsAdmin(authenticatedUserId, authenticatedUserEmail);
  if (!isAdmin) {
    console.warn('[CMS Delete Diagnostic] Outcome [B: Authorization failure in admin_users]:', {
      userId: authenticatedUserId,
      email: authenticatedUserEmail,
      error: adminErr,
      targetProjectId: id,
    });
    return {
      success: false,
      deleted: false,
      error: adminErr || 'Unauthorized: Your account does not have admin permissions in the admin_users table.',
    };
  }

  try {
    // 3. Check if project row exists before deletion (distinguishes Case C from B/D/E)
    const { data: existingRow, error: checkErr } = await supabase
      .from('projects')
      .select('id, title')
      .eq('id', id)
      .maybeSingle();

    if (checkErr) {
      console.warn('[CMS Delete Diagnostic] Pre-delete existence check query note:', checkErr.message);
    }

    if (!existingRow) {
      console.warn('[CMS Delete Diagnostic] Outcome [C: Project ID does not exist in database]:', {
        targetProjectId: id,
        userId: authenticatedUserId,
      });
      return {
        success: false,
        deleted: false,
        error: `Project with ID "${id}" was not found in the database.`,
      };
    }

    // 4. Execute Supabase DELETE with count: 'exact' and select('id')
    console.info('[CMS Delete Diagnostic] Executing DELETE request:', {
      targetProjectId: id,
      targetProjectTitle: existingRow.title,
      userId: authenticatedUserId,
    });

    const deleteResult = await supabase
      .from('projects')
      .delete({ count: 'exact' })
      .eq('id', id)
      .select('id');

    const { data: returnedData, error: deleteErr, count: affectedCount, status: deleteStatus } = deleteResult;

    console.info('[CMS Delete Diagnostic] Raw Supabase DELETE response:', {
      status: deleteStatus,
      error: deleteErr ? { message: deleteErr.message, code: deleteErr.code, details: deleteErr.details } : null,
      returnedData: returnedData || null,
      returnedRowCount: returnedData ? returnedData.length : 0,
      affectedRowCount: affectedCount,
      targetProjectId: id,
    });

    // 5. Handle explicit DB / RLS error
    if (deleteErr) {
      console.error('[CMS Delete Diagnostic] Outcome [B: RLS/permission failure during DELETE]:', {
        code: deleteErr.code,
        message: deleteErr.message,
        details: deleteErr.details,
        targetProjectId: id,
      });
      return {
        success: false,
        deleted: false,
        error: `Database delete failed: ${deleteErr.message} (Code: ${deleteErr.code || 'UNKNOWN'})`,
      };
    }

    // 6. Reliably verify if the row was actually removed from the database
    // Check if row still exists after the DELETE operation
    const { data: verifyRow } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    const rowStillExists = Boolean(verifyRow);

    if (rowStillExists) {
      // Deletion query executed without error, but 0 rows were deleted due to RLS filter
      console.error('[CMS Delete Diagnostic] Outcome [B: RLS/permission failure (row was NOT deleted)]:', {
        targetProjectId: id,
        affectedRowCount: affectedCount,
        returnedRowCount: returnedData ? returnedData.length : 0,
        rowStillExists: true,
      });
      return {
        success: false,
        deleted: false,
        error: 'Delete rejected by database: Row Level Security policy prevented deleting this project. Ensure the "Admins can delete projects" policy is installed in Supabase.',
      };
    }

    // Row is confirmed gone!
    if (!returnedData || returnedData.length === 0) {
      console.info('[CMS Delete Diagnostic] Outcome [D: DELETE succeeded and actually removed row, but returned empty representation due to RLS/PostgREST response behavior]:', {
        targetProjectId: id,
        affectedRowCount: affectedCount,
        verifiedRemoved: true,
      });
    } else {
      console.info('[CMS Delete Diagnostic] Outcome [E: DELETE succeeded and actually removed row with confirmed representation]:', {
        targetProjectId: id,
        returnedData,
        affectedRowCount: affectedCount,
        verifiedRemoved: true,
      });
    }

    return {
      success: true,
      deleted: true,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Delete operation failed';
    console.error('[CMS Delete Diagnostic] Unexpected deletion exception:', errorMsg);
    return {
      success: false,
      deleted: false,
      error: errorMsg,
    };
  }
}

// ============================================================================
// SERVICES CMS
// ============================================================================

export async function fetchServicesFromDB(): Promise<{ services: ServiceItem[]; fromDb: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { services: SERVICES_DATA, fromDb: false };

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return { services: SERVICES_DATA, fromDb: false, error: error?.message };
    }

    const activeRows = data.filter((r) => r.active !== false);
    if (activeRows.length === 0) return { services: SERVICES_DATA, fromDb: false };

    const mapped: ServiceItem[] = activeRows.map((r, idx) => ({
      number: r.number || String(idx + 1).padStart(2, '0'),
      title: r.title,
      description: r.short_description || r.full_description || '',
      iconName: r.icon_url || 'Layout',
      highlights: Array.isArray(r.features) ? r.features : [],
    }));

    return { services: mapped, fromDb: true };
  } catch {
    return { services: SERVICES_DATA, fromDb: false };
  }
}

export async function fetchAllServicesAdmin(): Promise<{ services: CMSService[]; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { services: [] };

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) return { services: [], error: error.message };
    return { services: (data as CMSService[]) || [] };
  } catch (err) {
    return { services: [], error: err instanceof Error ? err.message : 'Failed' };
  }
}

export async function saveServiceToDB(service: CMSService): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('services').upsert(service, { onConflict: 'id' });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Save failed' };
  }
}

export async function deleteServiceFromDB(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Delete failed' };
  }
}

// ============================================================================
// PRICING CMS
// ============================================================================

export async function fetchPricingFromDB(): Promise<{ pricing: PricingPlan[]; fromDb: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { pricing: PRICING_PLANS, fromDb: false };

  try {
    const { data, error } = await supabase
      .from('pricing_packages')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return { pricing: PRICING_PLANS, fromDb: false, error: error?.message };
    }

    const activeRows = data.filter((r) => r.active !== false);
    if (activeRows.length === 0) return { pricing: PRICING_PLANS, fromDb: false };

    const mapped: PricingPlan[] = activeRows.map((r) => ({
      id: r.id,
      name: r.name,
      price: r.price,
      bestFor: r.description || '',
      popular: Boolean(r.featured),
      popularBadge: r.badge || (r.featured ? 'MOST POPULAR' : undefined),
      features: Array.isArray(r.features) ? r.features : [],
      buttonText: r.cta_text || 'Start Your Project',
    }));

    return { pricing: mapped, fromDb: true };
  } catch {
    return { pricing: PRICING_PLANS, fromDb: false };
  }
}

export async function fetchAllPricingAdmin(): Promise<{ packages: CMSPricingPackage[]; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { packages: [] };

  try {
    const { data, error } = await supabase
      .from('pricing_packages')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) return { packages: [], error: error.message };
    return { packages: (data as CMSPricingPackage[]) || [] };
  } catch (err) {
    return { packages: [], error: err instanceof Error ? err.message : 'Failed' };
  }
}

export async function savePricingToDB(pkg: CMSPricingPackage): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('pricing_packages').upsert(pkg, { onConflict: 'id' });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Save failed' };
  }
}

export async function deletePricingFromDB(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('pricing_packages').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Delete failed' };
  }
}

// ============================================================================
// TESTIMONIALS CMS
// ============================================================================

export async function fetchTestimonialsFromDB(): Promise<{ testimonials: CMSTestimonial[]; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { testimonials: DEFAULT_TESTIMONIALS };

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return { testimonials: DEFAULT_TESTIMONIALS, error: error?.message };
    }
    return { testimonials: data as CMSTestimonial[] };
  } catch {
    return { testimonials: DEFAULT_TESTIMONIALS };
  }
}

export async function saveTestimonialToDB(t: Partial<CMSTestimonial>): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const payload = {
      ...t,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('testimonials').upsert(payload, { onConflict: 'id' });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Save failed' };
  }
}

export async function deleteTestimonialFromDB(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Delete failed' };
  }
}

// ============================================================================
// WEBSITE CONTENT CMS
// ============================================================================

export async function fetchWebsiteContent(): Promise<{ content: Record<string, string>; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { content: {} };

  try {
    const { data, error } = await supabase.from('website_content').select('*');
    if (error || !data) return { content: {}, error: error?.message };

    const map: Record<string, string> = {};
    data.forEach((row) => {
      map[`${row.section}.${row.content_key}`] = row.content_value;
    });
    return { content: map };
  } catch {
    return { content: {} };
  }
}

export async function saveWebsiteContent(section: string, key: string, value: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const id = `${section}_${key}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const { error } = await supabase.from('website_content').upsert(
      {
        id,
        section,
        content_key: key,
        content_value: value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Save failed' };
  }
}

// ============================================================================
// MEDIA ASSETS & SUPABASE STORAGE
// ============================================================================

const STORAGE_BUCKET = 'website-assets';

export async function fetchMediaAssets(): Promise<{ assets: MediaAsset[]; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { assets: [] };

  try {
    const { data, error } = await supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return { assets: [], error: error.message };
    return { assets: (data as MediaAsset[]) || [] };
  } catch (err) {
    return { assets: [], error: err instanceof Error ? err.message : 'Failed to fetch media' };
  }
}

export async function uploadMediaFile(
  file: File,
  category: string = 'general',
  onProgress?: (pct: number) => void
): Promise<{ success: boolean; url?: string; asset?: MediaAsset; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Database not configured' };

  // Check auth session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { success: false, error: 'Admin session expired. Please log in again.' };
  }

  // Validate allowed file types
  const allowed = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
  ];
  if (!allowed.includes(file.type)) {
    return { success: false, error: `Unsupported file type: ${file.type}. Allowed: JPG, PNG, WEBP, SVG, MP4, WEBM` };
  }

  // Max 50MB
  if (file.size > 50 * 1024 * 1024) {
    return { success: false, error: 'File exceeds maximum limit of 50MB' };
  }

  try {
    if (onProgress) onProgress(20);

    const ext = file.name.split('.').pop() || 'bin';
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${category}/${Date.now()}_${cleanName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: `Storage upload failed: ${uploadError.message}` };
    }

    if (onProgress) onProgress(70);

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    const publicUrl = publicUrlData.publicUrl;

    // Record in media_assets table if available
    let createdAsset: MediaAsset = {
      id: `asset-${Date.now()}`,
      name: file.name,
      file_path: path,
      public_url: publicUrl,
      file_type: file.type,
      file_size: file.size,
      category,
      created_at: new Date().toISOString(),
    };

    try {
      const { data: insertData, error: insertError } = await supabase
        .from('media_assets')
        .insert({
          name: file.name,
          file_path: path,
          public_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          category,
        })
        .select()
        .maybeSingle();

      if (!insertError && insertData) {
        createdAsset = insertData as MediaAsset;
      }
    } catch {
      // Non-fatal if media_assets table not yet created
    }

    if (onProgress) onProgress(100);
    return { success: true, url: publicUrl, asset: createdAsset };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Upload failed' };
  }
}

export async function deleteMediaAsset(id: string, filePath: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    // Delete from storage
    if (filePath) {
      await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
    }
    // Delete from media_assets table
    await supabase.from('media_assets').delete().eq('id', id);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Delete failed' };
  }
}
