// Central plan configuration.
// Import this anywhere you need to enforce or display plan limits.

export type PlanId = 'starter' | 'pro' | 'enterprise'

export interface PlanConfig {
  id: PlanId
  name: string
  maxUsers: number | null        // null = unlimited
  maxDocuments: number | null    // null = unlimited
  maxIntegrations: number | null // null = unlimited
  aiDailyLimit: boolean          // true = has a daily AI usage cap
  apiAccess: boolean
  prioritySupport: boolean
  customOnboarding: boolean
}

export const PLANS: Record<PlanId, PlanConfig> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    maxUsers: 1,
    maxDocuments: 10,
    maxIntegrations: 0,
    aiDailyLimit: true,
    apiAccess: false,
    prioritySupport: false,
    customOnboarding: false,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    maxUsers: 5,
    maxDocuments: 25,
    maxIntegrations: 2,
    aiDailyLimit: false,
    apiAccess: false,
    prioritySupport: false,
    customOnboarding: false,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    maxUsers: 50,
    maxDocuments: null,
    maxIntegrations: null,
    aiDailyLimit: false,
    apiAccess: true,
    prioritySupport: true,
    customOnboarding: true,
  },
}

/** Returns the plan config for a workspace's current plan string, defaulting to starter. */
export function getPlan(planId: string | null | undefined): PlanConfig {
  return PLANS[(planId as PlanId) ?? 'starter'] ?? PLANS.starter
}

/** Returns true if the workspace plan allows the given feature. */
export function canUseFeature(
  planId: string | null | undefined,
  feature: keyof Pick<PlanConfig, 'apiAccess' | 'prioritySupport' | 'customOnboarding'>
): boolean {
  return getPlan(planId)[feature]
}

/** Returns true if the workspace is within the user limit. */
export function withinUserLimit(planId: string | null | undefined, currentUsers: number): boolean {
  const limit = getPlan(planId).maxUsers
  return limit === null || currentUsers < limit
}

/** Returns true if the workspace is within the document limit. */
export function withinDocumentLimit(planId: string | null | undefined, currentDocs: number): boolean {
  const limit = getPlan(planId).maxDocuments
  return limit === null || currentDocs < limit
}

/** Returns true if the workspace is within the integration limit. */
export function withinIntegrationLimit(planId: string | null | undefined, currentIntegrations: number): boolean {
  const limit = getPlan(planId).maxIntegrations
  return limit === null || currentIntegrations < limit
}
