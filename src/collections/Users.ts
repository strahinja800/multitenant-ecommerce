import type { CollectionConfig } from 'payload'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'

const defaultTenanrArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsCollectionSlug: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  arrayFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  tenantFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
})

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
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
