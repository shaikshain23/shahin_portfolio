/**
 * Shahin Shaik - Official Executive Dark Portfolio Dossier
 * Streamlined Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Update dynamic year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Initialize Clipboard Actions
  initClipboardActions();
});

/* ==========================================================================
   Toast Notification & Clipboard Actions
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('toast-hidden');
  toast.classList.add('toast-visible');

  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.classList.add('toast-hidden');
  }, 2800);
}

function initClipboardActions() {
  const email = 'alwaysshahin3@gmail.com';
  const copyTopBtn = document.getElementById('copy-email-top-btn');
  const copyBottomBtn = document.getElementById('copy-email-bottom-btn');

  const copyHandler = (e) => {
    e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email)
        .then(() => showToast(`Copied: ${email}`))
        .catch(() => fallbackCopyText(email));
    } else {
      fallbackCopyText(email);
    }
  };

  if (copyTopBtn) copyTopBtn.addEventListener('click', copyHandler);
  if (copyBottomBtn) copyBottomBtn.addEventListener('click', copyHandler);
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`Copied: ${text}`);
  } catch (err) {
    showToast(`Email: ${text}`);
  }
  document.body.removeChild(textArea);
}
