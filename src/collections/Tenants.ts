import { isSuperAdmin } from '@/lib/access'
import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    {
      name: 'name',
      required: true,
      type: 'text',
      label: 'Store name',
      admin: {
        // person looking st the dashboard
        description: 'This is the name of the store',
      },
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      required: true,
      unique: true,
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        description:
          'This is the subdomain for the store (e.g. [slug].sthg.com)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'stripeAccountId',
      type: 'text',
      required: true,
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        readOnly: true,
        description:
          'You cannot create products until you submit your Stripe details',
      },
    },
    {
      name: 'stripeDetailsSubmitted',
      type: 'checkbox',
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        description:
          'You cannot create products until you submit your Stripe details`',
      },
    },
  ],
}
