/**
 * LANDING PAGE PREMIUM — DRA. RAQUEL OLIVEIRA
 * Funcionalidades: Navbar dinâmica, menu mobile automático,
 * links parametrizados de WhatsApp e Modal acessível de galeria.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Constante base do WhatsApp
  const CLINIC_PHONE = '5521994308867';

  /* ------------------------------------------------------------------------
     1. Cabeçalho Fixo Dinâmico (Efeito ao rolar)
     ------------------------------------------------------------------------ */
  const header = document.getElementById('main-header');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Executa ao iniciar caso a página já inicie rolada

  /* ------------------------------------------------------------------------
     2. Fechamento automático do menu mobile ao clicar em um link
     ------------------------------------------------------------------------ */
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.getElementById('navbarContent');

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      // Verifica se o Bootstrap collapse está instanciado e visível
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  /* ------------------------------------------------------------------------
     3. WhatsApp: Links Dinâmicos por Procedimento
     ------------------------------------------------------------------------ */
  const treatmentButtons = document.querySelectorAll('.whatsapp-trigger');

  treatmentButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const treatmentName = button.getAttribute('data-treatment') || 'Tratamentos';
      const message = `Olá, Dra. Raquel Oliveira! Tenho interesse no procedimento de *${treatmentName}* e gostaria de agendar uma avaliação.`;
      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/${CLINIC_PHONE}?text=${encodedMessage}`;

      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });

  /* ------------------------------------------------------------------------
     4. Modal da Galeria (Visualização Ampliada com Acessibilidade)
     ------------------------------------------------------------------------ */
  const galleryModal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('modalImg');
  const closeBtn = document.querySelector('.modal-close-btn');
  const modalBackdrop = document.querySelector('.modal-backdrop-custom');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let previouslyFocusedElement = null;

  const openModal = (imgSrc, altText) => {
    previouslyFocusedElement = document.activeElement;
    modalImg.src = imgSrc;
    modalImg.alt = altText || 'Visualização detalhada do procedimento';
    galleryModal.classList.add('is-active');
    galleryModal.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
    document.body.style.overflow = 'hidden'; // Impede rolagem do fundo
  };

  const closeModal = () => {
    galleryModal.classList.remove('is-active');
    galleryModal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    document.body.style.overflow = '';
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  };

  // Eventos de clique nas imagens da galeria
  galleryItems.forEach((item) => {
    const img = item.querySelector('img');
    const triggerZoom = () => {
      if (img) openModal(img.src, img.alt);
    };

    item.addEventListener('click', triggerZoom);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerZoom();
      }
    });
  });

  // Fechamento: Botão de fechar, clique fora e Tecla ESC
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && galleryModal.classList.contains('is-active')) {
      closeModal();
    }
  });

  /* ------------------------------------------------------------------------
     5. Animações de entrada suaves com Intersection Observer
     ------------------------------------------------------------------------ */
  const animatedElements = document.querySelectorAll('.pillar-box, .treatment-card, .diff-card, .testimonial-card');

  // Respeita preferência por movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    animatedElements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
});