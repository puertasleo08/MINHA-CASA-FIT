/**
 * Detailed Review — Core Interactions & Telemetry (Vanilla JS)
 * Accessible Tabs, Mobile Menu, Interactive ROI Calculator Teaser, FAQ Tracking, Form Handlers & Affiliate Telemetry.
 * Zero external frameworks. Optimized for Core Web Vitals.
 */
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const track = (name, params) => {
    (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: name }, params));
  };

  // Dynamic Year
  const yearEl = $('#y');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile Navigation Toggle
  const toggleBtn = $('#nav-toggle');
  const mobileNav = $('#mobile-nav');
  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
      mobileNav.classList.toggle('hidden');
    });

    $$('a', mobileNav).forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Accessible Tabs Implementation (ARIA role="tab", role="tabpanel", keyboard arrows)
  $$('[data-tabs]').forEach((group) => {
    const tabs = $$('[role="tab"]', group);
    const selectTab = (tab, fromUser) => {
      tabs.forEach((t) => {
        const isSelected = t === tab;
        t.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        t.tabIndex = isSelected ? 0 : -1;
        const panelId = t.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        if (panel) {
          panel.hidden = !isSelected;
        }
      });

      if (fromUser) {
        track('tab_selected', {
          tab_group: group.dataset.tabs || 'rankings',
          selected_tab: tab.dataset.tab || tab.textContent.trim()
        });
      }
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab, true));
      tab.addEventListener('keydown', (e) => {
        const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        const nextIndex = (index + dir + tabs.length) % tabs.length;
        const nextTab = tabs[nextIndex];
        nextTab.focus();
        selectTab(nextTab, true);
      });
    });
  });

  // Interactive Tool Teaser: SaaS ROI & Matchmaker Estimator
  const roiCalculator = $('[data-roi-calculator]');
  if (roiCalculator) {
    const teamSizeInputs = $$('input[name="team-size"]', roiCalculator);
    const bottleneckInputs = $$('input[name="bottleneck"]', roiCalculator);
    const resultHours = $('[data-roi-hours]', roiCalculator);
    const resultSavings = $('[data-roi-savings]', roiCalculator);
    const resultStack = $('[data-roi-stack]', roiCalculator);

    const calculateROI = () => {
      const selectedSize = $('input[name="team-size"]:checked', roiCalculator)?.value || 'mid';
      const selectedBottleneck = $('input[name="bottleneck"]:checked', roiCalculator)?.value || 'automation';

      const baseRates = {
        solo: { multiplier: 1, baseHours: 12, costPerHour: 45 },
        small: { multiplier: 5, baseHours: 35, costPerHour: 55 },
        mid: { multiplier: 20, baseHours: 140, costPerHour: 65 },
        enterprise: { multiplier: 60, baseHours: 420, costPerHour: 75 }
      };

      const bottleneckMap = {
        automation: { factor: 1.25, stack: 'Make.com + OpenAI API + Airtable' },
        content: { factor: 1.1, stack: 'NeuronWriter + Jasper AI + Descript' },
        sales: { factor: 1.3, stack: 'Apollo.io + HubSpot + Clay' },
        support: { factor: 1.15, stack: 'Intercom AI + Notion + Zendesk' }
      };

      const tier = baseRates[selectedSize] || baseRates.mid;
      const bInfo = bottleneckMap[selectedBottleneck] || bottleneckMap.automation;

      const totalHours = Math.round(tier.baseHours * bInfo.factor);
      const monthlySavings = Math.round(totalHours * tier.costPerHour);

      if (resultHours) resultHours.textContent = `${totalHours} hrs`;
      if (resultSavings) resultSavings.textContent = `$${monthlySavings.toLocaleString('en-US')}`;
      if (resultStack) resultStack.textContent = bInfo.stack;
    };

    [...teamSizeInputs, ...bottleneckInputs].forEach((input) => {
      input.addEventListener('change', () => {
        calculateROI();
        track('roi_calculator_interact', {
          team_size: $('input[name="team-size"]:checked', roiCalculator)?.value,
          bottleneck: $('input[name="bottleneck"]:checked', roiCalculator)?.value
        });
      });
    });

    calculateROI();
  }

  // Contact Form (Client-Side mailto & status feedback)
  const contactForm = $('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(contactForm);
      const targetEmail = contactForm.dataset.contactForm || 'editorial@detailed-review.com';
      const subject = `[Detailed Review Inquiry] ${f.get('assunto') || 'Contact'} — ${f.get('nome') || 'Anonymous'}`;
      const body = `${f.get('mensagem') || ''}\n\n--\nFrom: ${f.get('nome') || ''} <${f.get('email') || ''}>`;
      
      window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      const statusEl = $('[data-contact-status]');
      if (statusEl) {
        statusEl.textContent = `Opening default mail app... If it does not trigger, write directly to ${targetEmail}.`;
      }
      track('contact_form_submitted', { subject: f.get('assunto') });
    });
  }

  // Founder Tool Submission Form Handler
  const toolSubmissionForm = $('[data-tool-submission]');
  if (toolSubmissionForm) {
    toolSubmissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(toolSubmissionForm);
      const targetEmail = 'editorial@detailed-review.com';
      const subject = `[Software Submission] ${f.get('software_name') || ''} (${f.get('software_category') || ''})`;
      const body = `Founder Name: ${f.get('founder_name')}\nEmail: ${f.get('founder_email')}\nSoftware: ${f.get('software_name')}\nURL: ${f.get('software_url')}\nCategory: ${f.get('software_category')}\n\nAccess / Provisioning Details:\n${f.get('test_access')}`;
      
      window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      const statusEl = $('[data-submission-status]');
      if (statusEl) {
        statusEl.textContent = `Opening mail client for submission... You can also email ${targetEmail} directly.`;
      }
      track('tool_submission_submitted', { software: f.get('software_name') });
    });
  }

  // Affiliate Link Click Tracking & Telemetry (GTM/DataLayer compliant)
  document.addEventListener('click', (e) => {
    const affiliateLink = e.target.closest('a[data-aff]');
    if (!affiliateLink) return;

    track('affiliate_outbound_click', {
      vendor: affiliateLink.dataset.aff,
      tool_name: affiliateLink.dataset.tool || '',
      position: affiliateLink.dataset.position || 'body',
      target_url: affiliateLink.href
    });
  });

  // FAQ Details Tracking
  $$('details[data-faq]').forEach((faqItem) => {
    faqItem.addEventListener('toggle', () => {
      if (faqItem.open) {
        const questionText = ($('summary', faqItem) || faqItem).textContent.trim();
        track('faq_viewed', { question: questionText.slice(0, 100) });
      }
    });
  });

  // Sticky CTA Navigation Bar on Scroll
  const stickyBar = $('[data-sticky-bar]');
  const triggerPoint = $('[data-sticky-trigger]');
  if (stickyBar && triggerPoint && 'IntersectionObserver' in window) {
    const handleSticky = (visible) => {
      stickyBar.classList.toggle('translate-y-full', !visible);
      stickyBar.classList.toggle('opacity-0', !visible);
      stickyBar.setAttribute('aria-hidden', visible ? 'false' : 'true');
      $$('a, button', stickyBar).forEach((el) => {
        el.tabIndex = visible ? 0 : -1;
      });
    };
    handleSticky(false);

    const observer = new IntersectionObserver(([entry]) => {
      handleSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(triggerPoint);
  }
})();
