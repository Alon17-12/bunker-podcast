/**
 * Supabase Database types.
 * Hand-written to match the structure that supabase-js expects.
 * Regenerate via `npm run db:types` after running `npx supabase login`.
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

export type Database = {
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          whatsapp?: string;
          package?: CustomerPackage;
          retainer_active?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          title?: string;
          episode_number?: number | null;
          recorded_at?: string;
          status?: EpisodeStatus;
          current_version?: number;
          bunny_video_id?: string | null;
          share_token?: string | null;
          share_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'episodes_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'customers';
            referencedColumns: ['id'];
          },
        ];
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
          created_at?: string;
        };
        Update: {
          id?: string;
          episode_id?: string;
          version_number?: number;
          bunny_video_id?: string;
          duration_seconds?: number | null;
          sent_at?: string | null;
          approved_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'episode_versions_episode_id_fkey';
            columns: ['episode_id'];
            isOneToOne: false;
            referencedRelation: 'episodes';
            referencedColumns: ['id'];
          },
        ];
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
          created_at?: string;
        };
        Update: {
          id?: string;
          episode_id?: string;
          order_num?: number;
          title?: string;
          start_time_seconds?: number;
          end_time_seconds?: number;
          status?: ReelStatus;
          bunny_video_id?: string | null;
          created_by?: CreatorRole;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reels_episode_id_fkey';
            columns: ['episode_id'];
            isOneToOne: false;
            referencedRelation: 'episodes';
            referencedColumns: ['id'];
          },
        ];
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
          created_at?: string;
        };
        Update: {
          id?: string;
          episode_id?: string;
          version_id?: string;
          type?: FeedbackType;
          timestamp_seconds?: number | null;
          comment?: string;
          resolved?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'feedback_items_episode_id_fkey';
            columns: ['episode_id'];
            isOneToOne: false;
            referencedRelation: 'episodes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feedback_items_version_id_fkey';
            columns: ['version_id'];
            isOneToOne: false;
            referencedRelation: 'episode_versions';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      episode_status: EpisodeStatus;
      reel_status: ReelStatus;
      customer_package: CustomerPackage;
      feedback_type: FeedbackType;
      creator_role: CreatorRole;
    };
    CompositeTypes: Record<string, never>;
  };
};
