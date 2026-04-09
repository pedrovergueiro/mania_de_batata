const catalog = {
  batatas:[
    {id:'b-p',img:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',name:'Batata Frita P',desc:'Porção individual, crocante e sequinha',price:10.99},
    {id:'b-m',img:'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80',name:'Batata Frita M',desc:'Para matar a fome com estilo',price:15.99},
    {id:'b-g',img:'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&q=80',name:'Batata Frita G',desc:'Generosa — para compartilhar ou não',price:22.99},
  ],
  adicionais:[
    {id:'ad-ch',img:'imagens/molhocheddar.jpg',name:'Cheddar',desc:'Molho cremoso e irresistível',price:3.99},
    {id:'ad-ba',img:'imagens/bacon.jpg',name:'Bacon',desc:'Pedaços crocantes e defumados',price:3.99},
    {id:'ad-qu',img:'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',name:'Queijo',desc:'Queijo especial da casa',price:3.99},
    {id:'ad-ca',img:'imagens/calabresa.jpg',name:'Calabresa',desc:'Temperada com toque apimentado',price:3.99},
  ],
  bebidas:[
    {id:'be-cl',img:'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',name:'Coca-Cola Lata 350ml',desc:'Gelada, do jeito certo',price:7.99},
    {id:'be-c2',img:'imagens/coca.jpg',name:'Coca-Cola 2L',desc:'Para toda a família',price:17.99},
    {id:'be-fo',img:'imagens/fanta.jpg',name:'Fanta Laranja 2L',desc:'Refrescante e cítrica',price:14.99},
    {id:'be-gu',img:'imagens/guarana.jpg',name:'Guaraná 2L',desc:'Brasileiro e geladinho',price:14.99},
  ],
};

const cart = {};

function renderGrid(items, gid) {
  const g = document.getElementById(gid);
  g.innerHTML = '';

  items.forEach((item, i) => {
    const d = document.createElement('div');
    d.className = 'pcard';
    d.id = 'pc-' + item.id;
    d.style.cssText = `opacity:0;animation:up .5s ${i * .06 + .05}s ease forwards`;
    d.innerHTML = `
      <img class="pc-img" src="${item.img}" alt="${item.name}" loading="lazy" />
      <div class="pc-body">
        <div class="pc-top">
          <div class="pc-name">${item.name}</div>
          <div class="pc-chk"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
        </div>
        <div class="pc-desc">${item.desc}</div>
        <div class="pc-foot">
          <div class="pc-price"><small>R$</small>${item.price.toFixed(2).replace('.', ',')}</div>
        </div>
        <div class="qty-row" id="qr-${item.id}">
          <button class="qb" id="qb-minus-${item.id}">−</button>
          <span class="qn" id="qn-${item.id}">1</span>
          <button class="qb" id="qb-plus-${item.id}">+</button>
          <span class="qs" id="qs-${item.id}">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>`;

    g.appendChild(d);

    // card click — only fires if NOT a qty button
    d.addEventListener('click', function(e) {
      if (e.target.classList.contains('qb')) return;
      toggleItem(item);
    });

    // qty buttons — attached AFTER appendChild so they exist in DOM
    document.getElementById('qb-minus-' + item.id).addEventListener('click', function(e) {
      e.stopPropagation();
      chq(item.id, -1);
    });

    document.getElementById('qb-plus-' + item.id).addEventListener('click', function(e) {
      e.stopPropagation();
      chq(item.id, 1);
    });
  });
}

function toggleItem(item) {
  const c = document.getElementById('pc-' + item.id);
  if (cart[item.id]) {
    delete cart[item.id];
    c.classList.remove('sel');
  } else {
    cart[item.id] = { ...item, qty: 1 };
    c.classList.add('sel');
    toast(item.name + ' adicionado ✓');
  }
  sync();
}

function chq(id, delta) {
  if (!cart[id]) return;
  const newQty = cart[id].qty + delta;
  if (newQty <= 0) {
    const c = document.getElementById('pc-' + id);
    if (c) c.classList.remove('sel');
    delete cart[id];
  } else {
    cart[id].qty = newQty;
    const n = document.getElementById('qn-' + id);
    const s = document.getElementById('qs-' + id);
    if (n) { n.textContent = newQty; n.classList.add('pop'); setTimeout(() => n.classList.remove('pop'), 280); }
    if (s) s.textContent = 'R$ ' + (cart[id].price * newQty).toFixed(2).replace('.', ',');
  }
  sync();
}

function sync() {
  const items = Object.values(cart);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const b = document.getElementById('hbadge');
  b.textContent = count;
  b.classList.toggle('on', count > 0);
  document.getElementById('ftotal').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
  document.getElementById('fcta').classList.toggle('on', count > 0);

  const bd = document.getElementById('pnbd');
  const ft = document.getElementById('pnft');

  if (!items.length) {
    bd.innerHTML = `<div class="empty"><div class="eic">🛒</div><p>Nenhum item ainda.<br>Escolha algo do cardápio.</p></div>`;
    ft.style.display = 'none';
  } else {
    bd.innerHTML = items.map(i => `
      <div class="ci">
        <img src="${i.img}" alt="${i.name}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0" />
        <div class="ci-meta"><div class="ci-name">${i.name}</div><div class="ci-qty">Qtd: ${i.qty}</div></div>
        <div class="ci-right">
          <div class="ci-price">R$ ${(i.price * i.qty).toFixed(2).replace('.', ',')}</div>
          <button class="ci-rm" onclick="rem('${i.id}')">remover</button>
        </div>
      </div>`).join('');
    ft.style.display = 'block';
    document.getElementById('totval').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    document.getElementById('walink').href = buildWA(items, total);
  }
}

function rem(id) {
  const c = document.getElementById('pc-' + id);
  if (c) c.classList.remove('sel');
  delete cart[id];
  sync();
}

function buildWA(items, total) {
  let m = '🍟 *Pedido — Mania da Batata*\n\n';
  const batatas    = items.filter(i => i.id.startsWith('b-'));
  const adicionais = items.filter(i => i.id.startsWith('ad-'));
  const bebidas    = items.filter(i => i.id.startsWith('be-'));
  if (batatas.length)    { m += '*🥔 Batatas:*\n';    batatas.forEach(i    => { m += `  • ${i.name} ×${i.qty}  →  R$ ${(i.price*i.qty).toFixed(2).replace('.',',')}\n`; }); m += '\n'; }
  if (adicionais.length) { m += '*✦ Adicionais:*\n'; adicionais.forEach(i => { m += `  • ${i.name} ×${i.qty}  →  R$ ${(i.price*i.qty).toFixed(2).replace('.',',')}\n`; }); m += '\n'; }
  if (bebidas.length)    { m += '*🥤 Bebidas:*\n';    bebidas.forEach(i    => { m += `  • ${i.name} ×${i.qty}  →  R$ ${(i.price*i.qty).toFixed(2).replace('.',',')}\n`; }); m += '\n'; }
  m += `💰 *Total: R$ ${total.toFixed(2).replace('.', ',')}*\n\n_Pedido feito pelo site._`;
  return 'https://wa.me/5535984775725?text=' + encodeURIComponent(m);
}

function togglePanel() {
  document.getElementById('overlay').classList.toggle('on');
  document.getElementById('panel').classList.toggle('on');
}

function goSec(id, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 118, behavior: 'smooth' });
}

const secs = ['sec-batatas', 'sec-adicionais', 'sec-bebidas'];
const tabs = document.querySelectorAll('.tab');
window.addEventListener('scroll', () => {
  let cur = 0;
  secs.forEach((id, i) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < 125) cur = i; });
  tabs.forEach((t, i) => t.classList.toggle('active', i === cur));
}, { passive: true });

let tt;
function toast(msg) {
  document.getElementById('tmsg').textContent = msg;
  const el = document.getElementById('toast');
  el.classList.add('on');
  clearTimeout(tt);
  tt = setTimeout(() => el.classList.remove('on'), 2300);
}

renderGrid(catalog.batatas,    'g-batatas');
renderGrid(catalog.adicionais, 'g-adicionais');
renderGrid(catalog.bebidas,    'g-bebidas');
sync();
