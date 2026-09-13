import { z } from 'zod';

// Auth validation
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Product validation
export const ProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255),
  description: z.string().max(1000).optional(),
  slug: z.string().min(1).max(255),
  price: z.number().positive('Price must be positive'),
  previousPrice: z.number().positive().optional().nullable(),
  rating: z.number().min(0).max(5).optional().nullable(),
  reviewCount: z.number().nonnegative().optional(),
  image: z.string().url('Invalid image URL').optional().nullable(),
  categoryId: z.string().min(1, 'Category is required'),
  active: z.boolean().default(true),
});

// Category validation
export const CategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z.string().min(1).max(100),
  emoji: z.string().emoji().optional(),
  active: z.boolean().default(true),
  order: z.number().nonnegative().default(0),
});

// Affiliate Link validation
export const AffiliateLinkSchema = z.object({
  productId: z.string().min(1),
  url: z.string().url('Invalid URL'),
  active: z.boolean().default(true),
});

// Social Link validation
export const SocialLinkSchema = z.object({
  platform: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  url: z.string().url('Invalid URL'),
  icon: z.string().optional(),
  active: z.boolean().default(true),
  order: z.number().nonnegative().default(0),
});

// Site Settings validation
export const SiteSettingsSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(500),
  avatarUrl: z.string().url().optional().nullable(),
  bio: z.string().max(500).optional(),
  bioHandle: z.string().max(100),
  seoTitle: z.string().max(255),
  seoDescription: z.string().max(160),
  affiliateDisclosure: z.string().max(1000),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type ProductInput = z.infer<typeof ProductSchema>;
export type CategoryInput = z.infer<typeof CategorySchema>;
export type AffiliateLinkInput = z.infer<typeof AffiliateLinkSchema>;
export type SocialLinkInput = z.infer<typeof SocialLinkSchema>;
export type SiteSettingsInput = z.infer<typeof SiteSettingsSchema>;
