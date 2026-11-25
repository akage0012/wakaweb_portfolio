// JavaScript
document.addEventListener('DOMContentLoaded', () => {

  // 1. Lightbox (GLightbox) の初期化
  // GLightbox が読み込まれているページでのみ初期化
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      touchNavigation: true,
      loop: true,
      autoplayVideos: true
    });
  }

  // 2. モバイル用ハンバーガーメニューの開閉処理
  const burgerBtn = document.getElementById('burgerBtn');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-list a');

  if (burgerBtn && nav) {
    burgerBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
      burgerBtn.classList.toggle('open');
    });

    // ナビゲーションリンクタップ時にメニューを閉じる
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        burgerBtn.classList.remove('open');
      });
    });
  }

  // 3. Works フィルタリング機能
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.work-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // アクティブクラスの切り替え
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      workItems.forEach(item => {
        const itemCategories = (item.getAttribute('data-category') || '')
          .split(',')
          .map(category => category.trim());
        const isVisible = filterValue === 'all' || itemCategories.includes(filterValue);

        item.style.display = isVisible ? '' : 'none';
      });
    });
  });

});