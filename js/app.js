/**
 * ACCSY Dashboard - Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Setup Sidebar Toggle
  const sidebar = document.getElementById('sidebar');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebarCloseMobile = document.getElementById('sidebar-close-mobile');
  const mobileOverlay = document.getElementById('mobile-overlay');

  if (sidebarToggleBtn && sidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-collapsed');
      
      // Update toggle icon
      const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
      sidebarToggleBtn.innerHTML = isCollapsed 
        ? '<i data-lucide="panel-left-open" class="w-4 h-4"></i>'
        : '<i data-lucide="panel-left-close" class="w-4 h-4"></i>';
      
      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  }

  // Mobile drawer controls
  const openMobileSidebar = () => {
    sidebar.classList.remove('-translate-x-full');
    mobileOverlay.classList.remove('hidden');
  };

  const closeMobileSidebar = () => {
    sidebar.classList.add('-translate-x-full');
    mobileOverlay.classList.add('hidden');
  };

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileSidebar);
  if (sidebarCloseMobile) sidebarCloseMobile.addEventListener('click', closeMobileSidebar);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileSidebar);

  // Auto-expand the first menu group ("Catalogs") by default on desktop for friendly preview
  const firstAccordion = document.getElementById('catalogs-submenu');
  if (firstAccordion) {
    firstAccordion.classList.add('expanded');
    const header = firstAccordion.previousElementSibling;
    if (header) {
      const chevron = header.querySelector('.rotate-chevron');
      if (chevron) chevron.classList.add('open');
    }
  }
});

/**
 * Toggle Accordion Submenu
 * @param {string} submenuId - ID of submenu container
 * @param {HTMLElement} headerElement - Clicked button element
 */
function toggleAccordion(submenuId, headerElement) {
  const sidebar = document.getElementById('sidebar');
  // If sidebar is collapsed in mini-mode, expanding an accordion un-collapses sidebar for convenience
  if (sidebar && sidebar.classList.contains('sidebar-collapsed')) {
    sidebar.classList.remove('sidebar-collapsed');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    if (toggleBtn) {
      toggleBtn.innerHTML = '<i data-lucide="panel-left-close" class="w-4 h-4"></i>';
    }
  }

  const submenu = document.getElementById(submenuId);
  if (!submenu) return;

  const isExpanded = submenu.classList.contains('expanded');
  const chevron = headerElement.querySelector('.rotate-chevron');

  if (isExpanded) {
    submenu.classList.remove('expanded');
    if (chevron) chevron.classList.remove('open');
  } else {
    submenu.classList.add('expanded');
    if (chevron) chevron.classList.add('open');
  }
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Navigation Manager
 * @param {'dashboard'|'in-dev'} view - View to display
 * @param {string} parentCategory - Category name (e.g. "Catalogs", "Quick Actions (AR)")
 * @param {string} itemName - Item or feature name (e.g. "Customers", "Create Customer")
 */
function navigateTo(view, parentCategory = 'Dashboard', itemName = 'Overview') {
  const dashboardView = document.getElementById('dashboard-view');
  const inDevView = document.getElementById('in-dev-view');
  const parentCatEl = document.getElementById('indev-parent-category');
  const currentItemEl = document.getElementById('indev-current-item');
  const featureNameEl = document.getElementById('indev-feature-name');
  const dynamicIconEl = document.getElementById('indev-dynamic-icon');

  // Close mobile sidebar if open
  const sidebar = document.getElementById('sidebar');
  const mobileOverlay = document.getElementById('mobile-overlay');
  if (sidebar && window.innerWidth < 768) {
    sidebar.classList.add('-translate-x-full');
    if (mobileOverlay) mobileOverlay.classList.add('hidden');
  }

  // Update active state on sidebar links
  const allNavLinks = document.querySelectorAll('.nav-link');
  allNavLinks.forEach(link => {
    link.classList.remove('active', 'bg-slate-800/90', 'text-white', 'border-slate-700/60');
    const badge = link.querySelector('.sidebar-badge');
    if (badge) badge.remove();
  });

  if (view === 'dashboard') {
    if (dashboardView) {
      dashboardView.classList.remove('hidden');
      dashboardView.classList.add('view-enter');
    }
    if (inDevView) {
      inDevView.classList.add('hidden');
    }

    // Set Dashboard nav active
    const dashboardLink = document.querySelector('[data-nav-id="dashboard"]');
    if (dashboardLink) {
      dashboardLink.classList.add('active', 'bg-slate-800/90', 'text-white', 'border-slate-700/60');
      if (!dashboardLink.querySelector('.sidebar-badge')) {
        const badge = document.createElement('span');
        badge.className = 'sidebar-badge w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400';
        dashboardLink.appendChild(badge);
      }
    }
  } else {
    // Show In Development View
    if (dashboardView) {
      dashboardView.classList.add('hidden');
    }
    if (inDevView) {
      inDevView.classList.remove('hidden');
      inDevView.classList.add('view-enter');
    }

    // Update labels
    if (parentCatEl) parentCatEl.textContent = parentCategory;
    if (currentItemEl) currentItemEl.textContent = itemName;
    if (featureNameEl) featureNameEl.textContent = `"${itemName}"`;

    // Pick contextual icon for development screen
    let iconName = 'construction';
    const lower = itemName.toLowerCase();
    if (lower.includes('customer') || lower.includes('client')) iconName = 'user-check';
    else if (lower.includes('supplier') || lower.includes('vendor')) iconName = 'building-2';
    else if (lower.includes('payment') || lower.includes('pago')) iconName = 'credit-card';
    else if (lower.includes('invoice') || lower.includes('bill') || lower.includes('document')) iconName = 'file-text';
    else if (lower.includes('scenario')) iconName = 'git-branch';
    else if (lower.includes('budget')) iconName = 'calculator';
    else if (lower.includes('calendar')) iconName = 'calendar';
    else if (lower.includes('collection')) iconName = 'hand-coins';

    if (dynamicIconEl) {
      dynamicIconEl.setAttribute('data-lucide', iconName);
    }
  }

  // Scroll viewport to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-render Lucide Icons for dynamically updated elements
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
