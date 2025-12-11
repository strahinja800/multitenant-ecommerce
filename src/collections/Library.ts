import { isSuperAdmin } from '@/lib/access'
import { CollectionConfig } from 'payload'

export const Library: CollectionConfig = {
  slug: 'library',
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: 'product',
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: false,
    },
    {
      name: 'purchaseDate',
      type: 'date',
      required: true,
    },
  ],
}
