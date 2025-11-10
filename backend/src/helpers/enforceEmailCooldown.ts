import { User } from "@prisma/client"

// helpers/enforceEmailCooldown.js
export function enforceEmailCooldown(user: User, {
  cooldownMs = 5 * 60 * 1000,
} = {}) {
  if (!user) return // no user = nothing to check

  const lastSent = user.lastEmailSentAt
  if (lastSent) {
    const elapsed = Date.now() - new Date(lastSent).getTime()
    if (elapsed < cooldownMs) {
      const waitSecs = Math.ceil((cooldownMs - elapsed) / 1000)
      throw new Error(`Please wait ${waitSecs} seconds before requesting another email.`)
    }
  }
}
