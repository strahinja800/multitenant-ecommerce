import type { CollectionConfig } from 'payload'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { isSuperAdmin } from '@/lib/access'

const defaultTenanrArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsCollectionSlug: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  arrayFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
  tenantFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
})

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user)) return true

      return req.user?.id === id
    },
  },
  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  auth: true,
  fields: [
    {
      name: 'username',
      required: true,
      unique: true,
      type: 'text',
    },
    {
      name: 'email',
      required: true,
      unique: true,
      type: 'email',
      index: true,
    },
    {
      name: 'password',
      required: true,
      type: 'text',
    },
    {
      admin: {
        position: 'sidebar',
      },
      name: 'roles',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      options: ['super-admin', 'user'],
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      ...defaultTenanrArrayField,
      admin: {
        ...(defaultTenanrArrayField?.admin || {}),
        position: 'sidebar',
      },
    },
  ],
}
