/**
 * Supabase generated types.
 * Run `npm run db:types` to regenerate after migrations.
 *
 * For now, this file is hand-written until we connect to a real project.
 * After Supabase project is created, replace this with auto-generated output.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type EpisodeStatus =
  | 'recorded'
  | 'reviewing'
  | 'sent_v1'
  | 'revisions_v1'
  | 'sent_v2'
  | 'revisions_v2'
  | 'sent_v3'
  | 'approved'
  | 'archived';

export type ReelStatus =
  | 'selected'
  | 'editing'
  | 'sent_v1'
  | 'revisions_v1'
  | 'sent_v2'
  | 'revisions_v2'
  | 'sent_v3'
  | 'approved';

export type CustomerPackage = 'photo_only' | 'photo_edit' | 'retainer';
export type FeedbackType = 'timestamped' | 'general';
export type CreatorRole = 'client' | 'admin';

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          whatsapp: string;
          package: CustomerPackage;
          retainer_active: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          whatsapp: string;
          package?: CustomerPackage;
          retainer_active?: boolean;
          notes?: string | null;
        };
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      episodes: {
        Row: {
          id: string;
          customer_id: string;
          title: string;
          episode_number: number | null;
          recorded_at: string;
          status: EpisodeStatus;
          current_version: number;
          bunny_video_id: string | null;
          share_token: string | null;
          share_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          title: string;
          episode_number?: number | null;
          recorded_at: string;
          status?: EpisodeStatus;
          current_version?: number;
          bunny_video_id?: string | null;
          share_token?: string | null;
          share_expires_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['episodes']['Insert']>;
      };
      episode_versions: {
        Row: {
          id: string;
          episode_id: string;
          version_number: number;
          bunny_video_id: string;
          duration_seconds: number | null;
          sent_at: string | null;
          approved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          episode_id: string;
          version_number: number;
          bunny_video_id: string;
          duration_seconds?: number | null;
          sent_at?: string | null;
          approved_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['episode_versions']['Insert']>;
      };
      reels: {
        Row: {
          id: string;
          episode_id: string;
          order_num: number;
          title: string;
          start_time_seconds: number;
          end_time_seconds: number;
          status: ReelStatus;
          bunny_video_id: string | null;
          created_by: CreatorRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          episode_id: string;
          order_num: number;
          title: string;
          start_time_seconds: number;
          end_time_seconds: number;
          status?: ReelStatus;
          bunny_video_id?: string | null;
          created_by: CreatorRole;
        };
        Update: Partial<Database['public']['Tables']['reels']['Insert']>;
      };
      feedback_items: {
        Row: {
          id: string;
          episode_id: string;
          version_id: string;
          type: FeedbackType;
          timestamp_seconds: number | null;
          comment: string;
          resolved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          episode_id: string;
          version_id: string;
          type: FeedbackType;
          timestamp_seconds?: number | null;
          comment: string;
          resolved?: boolean;
        };
        Update: Partial<Database['public']['Tables']['feedback_items']['Insert']>;
      };
    };
  };
}
