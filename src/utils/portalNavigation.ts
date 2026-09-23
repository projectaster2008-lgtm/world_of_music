/**
 * Portal Navigation Helper for Ating Universe
 * 
 * Ensures navigating to the Ating Universe main portal replaces the parent
 * window context and never opens a new tab.
 */

export const ATING_PORTAL_URL = 'https://ating-universe.vercel.app/';

/**
 * Programmatically navigates to the portal home, replacing the parent/top frame.
 */
export function navigateToPortalHome() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.location.href = ATING_PORTAL_URL;
      return;
    }
  } catch {
    // Cross-origin restriction fallback
  }

  try {
    if (window.top && window.top !== window) {
      window.top.location.href = ATING_PORTAL_URL;
      return;
    }
  } catch {
    // Cross-origin restriction fallback
  }

  window.location.href = ATING_PORTAL_URL;
}

/**
 * Event handler for anchor clicks to ensure parent replacement without opening a new tab.
 */
export function handlePortalHomeClick(e: React.MouseEvent<HTMLAnchorElement>) {
  // If target="_parent" is set on the anchor, let the browser native behavior execute,
  // or attempt direct parent window location replacement.
  try {
    if (window.parent && window.parent !== window) {
      e.preventDefault();
      window.parent.location.href = ATING_PORTAL_URL;
      return;
    }
  } catch {
    // If blocked by cross-origin policy, let the native anchor target="_parent" handle it
    return;
  }

  try {
    if (window.top && window.top !== window) {
      e.preventDefault();
      window.top.location.href = ATING_PORTAL_URL;
      return;
    }
  } catch {
    // Fall back to native anchor click
    return;
  }

  // At top-level window
  if (window.location.href !== ATING_PORTAL_URL) {
    e.preventDefault();
    window.location.href = ATING_PORTAL_URL;
  }
}
