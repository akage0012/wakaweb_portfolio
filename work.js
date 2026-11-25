// work.html?id=xxxx の xxxx に対応する作品を workdata.js から探して表示する
(function () {
  const root = document.getElementById('workDetail');
  if (!root || typeof WORKS === 'undefined') return;

  const CATEGORY_LABEL = { art: 'Art', design: 'Design' };

  // 要素を作る小さなヘルパー（textContent を使うので文章中の < > も安全）
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const id = new URLSearchParams(location.search).get('id');
  const index = WORKS.findIndex(w => w.id === id);

  // ---- 作品が見つからないとき ----
  if (index === -1) {
    document.title = 'Works | WAKAKO TANIGUCHI';
    const wrap = el('div', 'container work-inner');
    wrap.appendChild(el('p', 'work-notfound', '作品が見つかりませんでした。URLが間違っているか、作品が削除された可能性があります。'));
    const back = el('a', 'btn-more', 'Works一覧へ戻る');
    back.href = 'index.html#works';
    const btnWrap = el('div', 'btn-wrapper');
    btnWrap.appendChild(back);
    wrap.appendChild(btnWrap);
    root.appendChild(wrap);
    return;
  }

  const work = WORKS[index];
  document.title = work.title + ' | WAKAKO TANIGUCHI';

  const inner = el('div', 'container work-inner');

  // パンくず（一覧へ戻る）
  const crumb = el('a', 'work-back', '← Works一覧');
  crumb.href = 'index.html#works';
  inner.appendChild(crumb);

  // タイトル部
  const head = el('header', 'work-head');
  head.appendChild(el('p', 'work-category', CATEGORY_LABEL[work.category] || work.category));
  head.appendChild(el('h1', 'work-title', work.title));
  head.appendChild(el('p', 'work-title-ja', work.titleJa));
  inner.appendChild(head);

  // 画像（クリックで拡大。複数枚ならギャラリーとして前後に送れる）
  const makeImage = (src, className) => {
    const a = el('a', 'glightbox ' + className);
    a.href = src;
    a.setAttribute('data-gallery', 'work-detail');
    a.setAttribute('data-title', work.title);
    const img = document.createElement('img');
    img.src = src;
    img.alt = work.title;
    a.appendChild(img);
    return a;
  };

  const images = work.images || [];
  if (images.length > 0) {
    inner.appendChild(makeImage(images[0], 'work-main-image'));
  }

 


  // 情報パネル（役割・期間・使用ツール）
  const meta = el('dl', 'work-meta');
  const addMeta = (label, value) => {
    const row = el('div', 'work-meta-row');
    row.appendChild(el('dt', null, label));
    const dd = el('dd');
    if (Array.isArray(value)) {
      const list = el('ul', 'tool-list');
      value.forEach(t => list.appendChild(el('li', null, t)));
      dd.appendChild(list);
    } else {
      dd.textContent = value;
    }
    row.appendChild(dd);
    meta.appendChild(row);
  };
  if (work.role) addMeta('担当', work.role);
  if (work.period) addMeta('制作期間', work.period);
  if (work.tools && work.tools.length) addMeta('使用ツール', work.tools);
  inner.appendChild(meta);

  // 概要
  if (work.summary) {
    const s = el('section', 'work-block');
    s.appendChild(el('h2', null, '概要'));
    s.appendChild(el('p', null, work.summary));
    inner.appendChild(s);
  }

  if (work.site) {
    const s = el('section', 'work-block');
    s.appendChild(el('h2', null, 'ウェブサイト'));
    const link = el('a', null, 'ウェブサイトを見る');
    link.href = work.site;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    s.appendChild(link);
    inner.appendChild(s);
  }

  // 課題
  if (work.challenge && work.challenge.length) {
    const s = el('section', 'work-block');
    s.appendChild(el('h2', null, '課題'));
    [].concat(work.challenge).forEach(p => s.appendChild(el('p', null, p)));
    inner.appendChild(s);
  }

  // 感想
  if (work.comment && work.comment.length) {
    const s = el('section', 'work-block');
    s.appendChild(el('h2', null, '制作の感想'));
    work.comment.forEach(p => s.appendChild(el('p', null, p)));
    inner.appendChild(s);
  }

  // 追加画像
  if (images.length > 1) {
    const gallery = el('div', 'work-gallery');
    images.slice(1).forEach(src => gallery.appendChild(makeImage(src, 'work-gallery-item')));
    inner.appendChild(gallery);
  }

  // 前後の作品へ
  const pager = el('nav', 'work-pager');
  const prev = WORKS[index - 1];
  const next = WORKS[index + 1];
  const makePagerLink = (target, label, cls) => {
    if (!target) return el('span', cls + ' is-empty');
    const a = el('a', cls, label + '：' + target.title);
    a.href = 'work.html?id=' + encodeURIComponent(target.id);
    return a;
  };
  pager.appendChild(makePagerLink(prev, '← 前の作品', 'work-pager-prev'));
  pager.appendChild(makePagerLink(next, '次の作品 →', 'work-pager-next'));
  inner.appendChild(pager);

  root.appendChild(inner);
})();