/**
 * Test if clipboard API is actually usable (not just present)
 */
async function testClipboardAPI(): Promise<boolean> {
  if (!navigator.clipboard || !window.isSecureContext) {
    return false;
  }
  
  try {
    // Try to test permissions without triggering the full API
    if ('permissions' in navigator) {
      const permission = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
      return permission.state === 'granted' || permission.state === 'prompt';
    }
    
    // Fallback: just check if the API exists
    return typeof navigator.clipboard.writeText === 'function';
  } catch {
    return false;
  }
}

/**
 * Utility function to copy text to clipboard with fallback support
 * Handles cases where Clipboard API is blocked or unavailable
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // First check if clipboard API is actually usable
  const clipboardUsable = await testClipboardAPI();
  
  if (clipboardUsable) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Silent fallback to legacy method
    }
  }
  
  // Use legacy method (document.execCommand)
  return new Promise((resolve) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      textArea.style.zIndex = '-1';
      textArea.setAttribute('readonly', '');
      textArea.setAttribute('aria-hidden', 'true');
      
      document.body.appendChild(textArea);
      
      try {
        // Focus and select the text
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, text.length);
        
        // Try to copy using execCommand
        const successful = document.execCommand('copy');
        resolve(successful);
      } catch {
        resolve(false);
      } finally {
        // Clean up
        if (document.body.contains(textArea)) {
          document.body.removeChild(textArea);
        }
      }
    } catch {
      resolve(false);
    }
  });
}

/**
 * Check if clipboard API is available
 */
export function isClipboardAvailable(): boolean {
  return !!(navigator.clipboard && window.isSecureContext);
}

/**
 * Check if any copy method is likely to work
 */
export function isCopySupported(): boolean {
  // Check if modern clipboard API might work
  const hasClipboard = isClipboardAvailable();
  
  // Check if legacy execCommand is supported
  const hasExecCommand = document.queryCommandSupported && document.queryCommandSupported('copy');
  
  return hasClipboard || hasExecCommand;
}