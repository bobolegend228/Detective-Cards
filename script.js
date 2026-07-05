const GAME_VERSION = 'beta 3.0';

/* ====================== DATA ====================== */
/* Имена сгруппированы парами с совпадающими инициалами (имя+фамилия) —
   каждая партия берёт две случайные пары, так что среди четверых подозреваемых
   всегда есть два совпадения инициалов. Это специально затрудняет улики вида
   «платок с инициалами», заставляя искать другие доказательства. */
const NAME_GROUPS = [
  [{name:'Джеймс Уитфилд', g:'м'}, {name:'Джулия Уоррен', g:'ж'}],
  [{name:'Эдвард Блэквуд', g:'м'}, {name:'Эмили Бэрроу', g:'ж'}],
  [{name:'Маркус Дюпон', g:'м'}, {name:'Мирабель Дюваль', g:'ж'}],
  [{name:'Алистер Финч', g:'м'}, {name:'Аделина Фокс', g:'ж'}],
  [{name:'Генри Колфилд', g:'м'}, {name:'Грейс Кармайкл', g:'ж'}],
  [{name:'Рикардо Морено', g:'м'}, {name:'Розалинда Марлоу', g:'ж'}],
  [{name:'Натаниэль Грей', g:'м'}, {name:'Нора Гилберт', g:'ж'}],
  [{name:'Винсент Харпер', g:'м'}, {name:'Виктория Хейл', g:'ж'}],
  [{name:'Шон Эверетт', g:'м'}, {name:'Шарлотта Эштон', g:'ж'}],
  [{name:'Ирвин Россетти', g:'м'}, {name:'Изабелла Романо', g:'ж'}],
  [{name:'Саймон Ллойд', g:'м'}, {name:'Софи Лавалль', g:'ж'}],
  [{name:'Патрик Дойл', g:'м'}, {name:'Полин Деверо', g:'ж'}],
  [{name:'Семён Буряк', g:'м'}, {name:'Сергей Коштанов', g:'м'}],
];

const VICTIMS = [
  'лорд Уильям Эштон-Кэрр','миллионер Илон Маск','примадонна Бьянка Россетти',
  'коллекционер Артур Пембрук','мадам Элоиза Деверо','профессор Йоганн Бергман',
  'банкир Себастьян Кросс','актриса Камилла Лавэлль','лорд Уильям Эштон-Кэрр',
  'примадонна Бьянка Россетти','коллекционер Артур Пембрук','мадам Элоиза Деверо',
  'профессор Йоганн Бергман','футболист Тони Кросс','актриса Камилла Лавэлль',
  'лорд Уильям Эштон-Кэрр','Bobokvas228, автор этой игры','примадонна Бьянка Россетти',
  'коллекционер Артур Пембрук','мадам Элоиза Деверо','профессор Йоганн Бергман',
  'банкир Себастьян Кросс','актриса Камилла Лавэлль'
];

const WITNESS_NAMES = [
  'дворецкий Альфред','горничная Бетти','садовник Джозеф','кучер Томас',
  'кухарка Маргарет','лакей Симон','компаньонка миссис Хадсон','старший конюх Патрик'
];

/* Координаты комнат на плане усадьбы (4 столбца × 2 ряда).
   Расстояние между комнатами влияет на игру: чем ближе заявленная
   комната к месту преступления — тем больше «возможностей» было у
   подозреваемого и тем охотнее находятся свидетели; чем дальше — тем
   надёжнее звучит алиби. */
const LOCATIONS = [
  {nom:'библиотека', prep:'библиотеке', col:0, row:0},
  {nom:'кабинет', prep:'кабинете', col:1, row:0},
  {nom:'музыкальный салон', prep:'музыкальном салоне', col:2, row:0},
  {nom:'гостевая спальня', prep:'гостевой спальне', col:3, row:0},
  {nom:'оранжерея', prep:'оранжерее', col:0, row:1},
  {nom:'винный погреб', prep:'винном погребе', col:1, row:1},
  {nom:'бильярдная', prep:'бильярдной', col:2, row:1},
  {nom:'розовый сад', prep:'розовом саду', col:3, row:1},
];

const TIMES = ['21:00','21:30','22:00','22:15','22:45','23:00','23:30'];

const WEAPONS = [
  {nom:'нож для писем', instr:'ножом для писем'},
  {nom:'редкий яд', instr:'редким ядом'},
  {nom:'бронзовый подсвечник', instr:'бронзовым подсвечником'},
  {nom:'шёлковый шнур', instr:'шёлковым шнуром'},
  {nom:'старинный револьвер', instr:'старинным револьвером'},
  {nom:'клавиатура', instr:'клавиатурой'},
];

const MOTIVES = ['ревность','крупный долг','тайное наследство','давняя месть','страх разоблачения афёры','шантаж','оскорблённая гордость'];

const RELATIONS = [
  'деловой партнёр жертвы','дальний родственник жертвы','личный секретарь жертвы','садовник усадьбы',
  'доверенное лицо жертвы','давний соперник жертвы','наследник состояния жертвы','доверенный дворецкий дома'
];

const CARD_META = {
  evidence:{icon:'images/magnifying-glass.png', title:'Улика', desc:'Найти физическую улику.'},
  interrogate:{icon:'images/human.png', title:'Допрос', desc:'Задать вопрос подозреваемому.'},
  alibi:{icon:'images/alibi.png', title:'Алиби', desc:'Быстрый, но ненадёжный намёк.'},
  witness:{icon:'images/vision.png', title:'Свидетель', desc:'Точная проверка — но свидетели на исходе.'},
  confront:{icon:'images/lie.png', title:'Ложь', desc:'Прямое обвинение. Риск пополам.'},
};

const DIFFICULTY = {
  easy:   { label:'Стажёр',     maxTurns:30, witnesses:4, motiveSuspiciousChance:0.85, motiveInnocentChance:0.15, nerveSuspiciousChance:0.7, nerveInnocentChance:0.2,  distanceHints:true,  falseClueChance:0.3 },
  normal: { label:'Детектив',   maxTurns:22, witnesses:3, motiveSuspiciousChance:0.85, motiveInnocentChance:0.30, nerveSuspiciousChance:0.7, nerveInnocentChance:0.25, distanceHints:true,  falseClueChance:0.5 },
  hard:   { label:'Инспектор',  maxTurns:16, witnesses:2, motiveSuspiciousChance:0.80, motiveInnocentChance:0.45, nerveSuspiciousChance:0.6, nerveInnocentChance:0.35, distanceHints:false, falseClueChance:0.7 },
};

const ITEMS_POOL = [
  {
    type:'letter', icon:'📜', name:'Старое письмо',
    desc:'Мятое письмо с разоблачительным текстом. Немедленно вскрывает мотив выбранного подозреваемого.',
    apply(s){
      s.motiveRevealed = true;
      if(s.hasMotive){
        s.suspicion = clamp(s.suspicion+12);
        addLog(`📜 <b>Старое письмо:</b> в тексте явно виден мотив — <b>${s.motive}</b>. ${s.name} замолкает.`);
      } else {
        s.suspicion = clamp(s.suspicion-10);
        addLog(`📜 <b>Старое письмо:</b> адресовано ${s.name}, но носит личный характер и никак не связано с преступлением. Подозрений меньше.`);
      }
    }
  },
  {
    type:'key', icon:'🗝️', name:'Старинный ключ',
    desc:'Ключ от комнаты в усадьбе. Снимает блокировку бурей — или даёт бесплатную беглую проверку алиби.',
    apply(s){
      if(state.stormLocation){
        const loc = state.stormLocation;
        state.stormLocation = null;
        addLog(`🗝️ <b>Старинный ключ:</b> открывает доступ в ${loc} — буря больше не мешает работе там.`);
      } else {
        const roll = Math.random();
        if(s.isCriminal){ s.suspicion = clamp(s.suspicion+18); addLog(`🗝️ <b>Старинный ключ:</b> потайной сейф в комнате ${s.name} открыт. Внутри — документы, которые ставят алиби под сомнение.`); }
        else { s.suspicion = clamp(s.suspicion-12); addLog(`🗝️ <b>Старинный ключ:</b> в сейфе ${s.name} только личные бумаги — ничего криминального.`); }
      }
    }
  },
  {
    type:'glove', icon:'🧤', name:'Окровавленная перчатка',
    desc:'Перчатка со следами. Резко поднимает подозрение к выбранному и немного снижает ко всем остальным.',
    apply(s){
      s.suspicion = clamp(s.suspicion + (s.isCriminal ? 30 : 20));
      state.suspects.filter(o=>o.id!==s.id).forEach(o=>{ o.suspicion = clamp(o.suspicion-7); });
      addLog(`🧤 <b>Окровавленная перчатка:</b> найдена рядом с вещами ${s.name}. Все взгляды обращаются на ${fem(s)?'неё':'него'}.`);
    }
  },
  {
    type:'photo', icon:'📸', name:'Фотография с вечера',
    desc:'Снимок ночи преступления. Работает как бесплатный вызов свидетеля — точно подтверждает или разрушает алиби.',
    apply(s){
      if(!s.claimedRevealed){ addLog(`📸 <b>Фотография:</b> сначала узнайте алиби ${s.name} — не с чем сравнивать.`); return; }
      if(s.witnessResolved){ addLog(`📸 <b>Фотография:</b> алиби ${s.name} уже проверено другим способом.`); return; }
      s.witnessResolved = true;
      const matches = (s.trueLocation.nom===s.claimedLocation.nom && s.trueTime===s.claimedTime);
      if(matches){
        s.alibiBroken = false; s.suspicion = clamp(s.suspicion-32);
        addLog(`📸 <b>Фотография:</b> ${s.name} отчётливо виден(а) в ${s.claimedLocation.prep} в ${s.claimedTime}. Алиби <b>подтверждено фотографией</b>.`);
      } else {
        s.alibiBroken = true; s.suspicion = clamp(s.suspicion+42);
        addLog(`📸 <b>Фотография:</b> ${s.name} на снимке в ${s.trueLocation.prep} около ${s.trueTime} — это противоречит показаниям! Алиби <b>разрушено</b>.`);
      }
    }
  },
];

const EVENTS = [
  {
    name:'storm',
    apply: ()=>{
      const loc = rand(LOCATIONS);
      state.stormLocation = loc.nom;
      return `Внезапная буря отрезала ${loc.prep} от остального дома. Улики оттуда теперь искать труднее.`;
    }
  },
  {
    name:'lawyer',
    apply: ()=>{
      const candidates = state.suspects.filter(s=>!s.lawyered);
      if(candidates.length===0) return null;
      const s = rand(candidates);
      s.lawyered = true;
      return `${s.name} нанял${fem(s)?'а':''} адвоката. Дальнейшие допросы будут наталкиваться на молчание.`;
    }
  },
  {
    name:'rumors',
    apply: ()=>{
      state.suspects.forEach(s=>{ s.suspicion = clamp(s.suspicion + randInt(-10,10)); });
      return `По дому пошли слухи и сплетни — подозрения у всех смешались.`;
    }
  },
  {
    name:'press',
    apply: ()=>{
      state.reputation = Math.max(0, state.reputation-1);
      return `Газетчики пронюхали о деле. Начальство недовольно вашей медлительностью.`;
    }
  },
  {
    name:'newWitness',
    apply: ()=>{
      state.witnessPoolLeft += 1;
      return `Неожиданно объявился ещё один человек, готовый рассказать, что видел в ту ночь.`;
    }
  },
  {
    name:'chaos',
    apply: ()=>{
      if(state.hand.length===0) return null;
      const idx = randInt(0, state.hand.length-1);
      state.hand.splice(idx,1);
      return `В доме поднялась суматоха — одна из ваших карт оказалась бесполезной и была утрачена.`;
    }
  },
];

/* ====================== HELPERS ====================== */
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}
function pickUnique(pool,n){ return shuffle(pool).slice(0,n); }
function clamp(v){ return Math.max(0, Math.min(100, v)); }
function initials(name){ return name.split(' ').map(p=>p[0]+'.').join(''); }
function fem(s){ return s.g === 'ж'; }
function roomDistance(a,b){ return Math.abs(a.col-b.col) + Math.abs(a.row-b.row); }
function distanceFromCrime(loc){ return roomDistance(loc, state.case.crimeLocation); }
function suspicionColor(v){ if(v<33) return '#4f7d4a'; if(v<66) return '#c98a2c'; return '#a83232'; }

/* ====================== EVIDENCE TEMPLATES ====================== */
const critEvidence = [
  s => {
    const twin = state.suspects.find(o=>o.id!==s.id && initials(o.name)===initials(s.name));
    const ambiguity = twin ? ` К сожалению, в доме сразу двое с инициалами «${initials(s.name)}» — это ничего не доказывает само по себе.` : '';
    return `Найден платок с инициалами «${initials(s.name)}» в нескольких шагах от места преступления.${ambiguity}`;
  },
  s => `Свидетель вспоминает силуэт, похожий на ${s.name}, у места преступления незадолго до ${state.case.crimeTime}.`,
  s => `Почерк на обгоревшем письме поразительно похож на почерк ${s.name}.`,
  s => `В вещах ${s.name} обнаружен предмет, который, по описанию, принадлежал жертве.`,
];
const herringEvidence = [
  s => `В личных бумагах ${s.name} нашли резкие слова о жертве — выглядит подозрительно, но прямой связи с преступлением нет.`,
  s => `Прислуга говорит, что ${s.name} в последнее время ${fem(s)?'сильно нервничала':'сильно нервничал'} — впрочем, причина может быть и другой.`,
];
const innocentEvidence = [
  s => `Несколько свидетелей подтверждают: в момент преступления ${s.name} ${fem(s)?'была':'был'} совсем в другом месте по своим делам.`,
  s => `Личные вещи ${s.name} найдены именно там, где, по ${fem(s)?'её':'его'} словам, они и должны быть.`,
  s => `Прислуга подтверждает рассказ ${s.name} — никаких несоответствий.`,
];

/* ====================== STATE ====================== */
let state = {};
let cardUid = 0;

function buildCase(){
  return {
    victim: rand(VICTIMS),
    crimeLocation: rand(LOCATIONS),
    crimeTime: rand(TIMES),
    weapon: rand(WEAPONS),
    caseNo: randInt(100,999),
  };
}

function buildSuspects(caseData, cfg){
  const groups = pickUnique(NAME_GROUPS,3);
  const names = shuffle([...groups[0], ...groups[1], ...groups[2]]);
  const relations = pickUnique(RELATIONS,names.length);
  const order = shuffle(names.map((_,i)=>i));
  const criminalIdx = order[0];
  const herringIdxs = [order[1], order[2]];
  return names.map((n,i)=>{
    const isCriminal = i === criminalIdx;
    const isRedHerring = herringIdxs.includes(i);
    const suspicious = isCriminal || isRedHerring;
    const hasMotive = suspicious ? (Math.random()<cfg.motiveSuspiciousChance) : (Math.random()<cfg.motiveInnocentChance);
    const motive = hasMotive ? rand(MOTIVES) : null;
    const nervous = suspicious ? (Math.random()<cfg.nerveSuspiciousChance) : (Math.random()<cfg.nerveInnocentChance);
    let trueLocation, trueTime, claimedLocation, claimedTime;
    if(isCriminal){
      trueLocation = caseData.crimeLocation;
      trueTime = caseData.crimeTime;
      const otherLocs = LOCATIONS.filter(l=>l.nom!==caseData.crimeLocation.nom);
      const otherTimes = TIMES.filter(t=>t!==caseData.crimeTime);
      claimedLocation = rand(otherLocs);
      claimedTime = rand(otherTimes);
    } else {
      const otherLocs = LOCATIONS.filter(l=>l.nom!==caseData.crimeLocation.nom);
      trueLocation = rand(otherLocs);
      trueTime = rand(TIMES);
      claimedLocation = trueLocation;
      claimedTime = trueTime;
    }
    return {
      id:i, name:n.name, g:n.g, relation:relations[i], motive, hasMotive, nervous,
      isCriminal, isRedHerring, trueLocation, trueTime, claimedLocation, claimedTime,
      suspicion: randInt(5,15), evIndex:0, qIndex:0,
      claimedRevealed:false, relationRevealed:false, motiveRevealed:false, behaviorRevealed:false,
      alibiBroken:null, confronted:false, witnessResolved:false, lawyered:false,
    };
  });
}

function buildDeck(cfg){
  const scale = cfg.maxTurns / 22;
  const n = (base) => Math.max(1, Math.round(base * scale));
  let d = [];
  for(let i=0;i<n(6);i++) d.push('evidence');
  for(let i=0;i<n(9);i++) d.push('interrogate');
  for(let i=0;i<n(6);i++) d.push('alibi');
  for(let i=0;i<n(5);i++) d.push('witness');
  for(let i=0;i<n(4);i++) d.push('confront');
  return shuffle(d);
}

function drawCard(){
  if(state.deck.length===0) return false;
  const t = state.deck.shift();
  state.hand.push({id:cardUid++, type:t});
  return true;
}

function startWithDifficulty(diff){
  state.difficulty = diff;
  closeModal('difficultyModal');
  newGame();
}

function newGame(){
  const diff = state.difficulty || 'normal';
  const cfg = DIFFICULTY[diff];
  state.case = buildCase();
  state.suspects = buildSuspects(state.case, cfg);
  state.deck = buildDeck(cfg);
  state.hand = [];
  for(let i=0;i<5;i++) drawCard();
  state.log = [];
  state.reputation = 3;
  state.selected = null;
  state.gameOver = false;
  state.cardsPlayed = 0;
  state.nextEventAt = 5;
  state.stormLocation = null;
  state.witnessPoolLeft = cfg.witnesses;
  state.maxTurns = cfg.maxTurns;
  state.turnsLeft = cfg.maxTurns;
  state.inventory = [];
  state.itemUid = 0;
  closeModal('resultModal');
  closeModal('accuseModal');
  closeModal('mapModal');
  closeModal('difficultyModal');
  addLog(`<b>[${cfg.label.toUpperCase()}]</b> Около <b>${state.case.crimeTime}</b> в ${state.case.crimeLocation.prep} обнаружено тело. Жертва — <b>${state.case.victim}</b>. Орудие — <b>${state.case.weapon.nom}</b>. У вас <b>${cfg.maxTurns} ходов</b>. Действуйте.`);
  renderAll();
}

/* ====================== LOG ====================== */
function addLog(html){
  state.log.push(html);
  renderLog();
}
function renderLog(){
  const el = document.getElementById('log');
  el.innerHTML = state.log.map((line,i)=>`<div class="log-entry"><span class="log-idx">№${i+1}</span>${line}</div>`).join('');
  el.scrollTop = el.scrollHeight;
}

/* ====================== EVENTS ====================== */
function maybeTriggerEvent(){
  if(state.cardsPlayed < state.nextEventAt) return;
  state.nextEventAt += 5;
  const ev = rand(EVENTS);
  const text = ev.apply();
  if(text){
    addLog(`<span class="event-tag">‼️ ПРОИСШЕСТВИЕ:</span> ${text}`);
  }
}

/* ====================== INVENTORY ====================== */
function tryDropItem(){
  if(Math.random() > 0.28) return;
  const available = ITEMS_POOL.filter(def => !state.inventory.find(it=>it.type===def.type && !it.used));
  if(available.length===0) return;
  const def = rand(available);
  const item = { id: state.itemUid++, type:def.type, icon:def.icon, name:def.name, desc:def.desc, apply:def.apply, used:false };
  state.inventory.push(item);
  addLog(`🎒 <b>Найден предмет:</b> ${def.icon} <b>${def.name}</b> — теперь он в инвентаре.`);
}

function useItem(itemId, targetId){
  const item = state.inventory.find(it=>it.id===itemId);
  const s = state.suspects.find(x=>x.id===targetId);
  if(!item || item.used || !s) return;
  item.used = true;
  item.apply(s);
  closeModal('itemModal');
  renderAll();
}

function openItemModal(itemId){
  if(state.gameOver) return;
  const item = state.inventory.find(it=>it.id===itemId);
  if(!item || item.used) return;
  document.getElementById('itemModalTitle').textContent = `${item.icon} ${item.name}`;
  document.getElementById('itemModalDesc').textContent = item.desc;
  const listEl = document.getElementById('itemTargetList');
  listEl.innerHTML = state.suspects.map(s=>`
    <label onclick="useItem(${itemId},${s.id})">
      <b>${s.name}</b>${s.claimedRevealed ? ` — подозрение: ${s.suspicion}%` : ' — не допрошен'}
    </label>
  `).join('');
  openModal('itemModal');
}

/* ====================== ACTIONS ====================== */
function locAffectedByStorm(s){
  return state.stormLocation && (s.claimedLocation.nom===state.stormLocation || s.trueLocation.nom===state.stormLocation);
}

function doEvidence(s){
  let line;
  const stormHit = locAffectedByStorm(s);
  const mult = stormHit ? 0.5 : 1;
  if(s.isCriminal){
    line = critEvidence[s.evIndex % critEvidence.length](s);
    s.evIndex++;
    s.suspicion = clamp(s.suspicion + Math.round(16*mult));
  } else if(s.isRedHerring){
    if(Math.random()<0.5){
      line = herringEvidence[s.evIndex % herringEvidence.length](s);
      s.suspicion = clamp(s.suspicion + Math.round(9*mult));
    } else {
      line = innocentEvidence[s.evIndex % innocentEvidence.length](s);
      s.suspicion = clamp(s.suspicion - Math.round(6*mult));
    }
    s.evIndex++;
  } else {
    line = innocentEvidence[s.evIndex % innocentEvidence.length](s);
    s.evIndex++;
    s.suspicion = clamp(s.suspicion - Math.round(6*mult));
  }
  if(stormHit) line += ` <i>(буря мешает осмотру — след слабый)</i>`;
  addLog(`🔍 <b>Улика — ${s.name}:</b> ${line}`);
  tryDropItem();
  return {consumed:true};
}

function doInterrogate(s){
  if(s.lawyered){
    addLog(`🗣️ <b>Допрос — ${s.name}:</b> «По совету адвоката я отказываюсь отвечать», — холодно произносит ${s.name}.`);
    return {consumed:true};
  }
  let line;
  const qn = s.qIndex;
  if(qn===0){
    const nervTxt = s.nervous ? 'Голос слегка дрожит.' : 'Отвечает спокойно и уверенно.';
    line = `На вопрос «Где вы были в момент преступления?» ${s.name} отвечает: «Я ${fem(s)?'была':'был'} в ${s.claimedLocation.prep} примерно в ${s.claimedTime}.» ${nervTxt}`;
    s.claimedRevealed = true;
    s.behaviorRevealed = true;
    s.suspicion = clamp(s.suspicion + (s.nervous?6:-3));
    const dist = distanceFromCrime(s.claimedLocation);
    const cfg = DIFFICULTY[state.difficulty||'normal'];
    if(cfg.distanceHints){
      if(dist<=1){
        s.suspicion = clamp(s.suspicion+10);
        line += ` Судя по карте дома, ${s.claimedLocation.nom} совсем рядом с местом преступления — была возможность успеть туда и обратно.`;
      } else if(dist>=3){
        s.suspicion = clamp(s.suspicion-8);
        line += ` Судя по карте дома, ${s.claimedLocation.nom} в другом конце усадьбы — добраться до места преступления и вернуться незамеченным было бы непросто.`;
      }
    }
  } else if(qn===1){
    line = `На вопрос о связи с жертвой ${s.name} признаётся: «Я — ${s.relation}.»`;
    s.relationRevealed = true;
  } else if(qn===2){
    if(s.hasMotive){
      line = `${s.name} отводит взгляд при упоминании жертвы. Возможный мотив: <b>${s.motive}</b>.`;
      s.suspicion = clamp(s.suspicion+8);
    } else {
      line = `${s.name} пожимает плечами: «Мы почти не пересекались.» Видимых мотивов не обнаружено.`;
      s.suspicion = clamp(s.suspicion-4);
    }
    s.motiveRevealed = true;
  } else {
    line = `${s.name} раздражённо отвечает: «Я уже всё рассказал${fem(s)?'а':''} следствию.»`;
  }
  s.qIndex++;
  addLog(`🗣️ <b>Допрос — ${s.name}:</b> ${line}`);
  return {consumed:true};
}

function doAlibi(s){
  if(!s.claimedRevealed){
    addLog(`🕰️ Сначала допросите ${s.name} — иначе нечего проверять.`);
    return {consumed:false};
  }
  const roll = Math.random();
  if(roll > 0.65){
    addLog(`🕰️ <b>Беглая проверка — ${s.name}:</b> показания противоречивы, но точно сказать нельзя.`);
    return {consumed:true};
  }
  if(s.isCriminal){
    s.suspicion = clamp(s.suspicion+14);
    addLog(`🕰️ <b>Беглая проверка — ${s.name}:</b> что-то не сходится в показаниях... возможно, лжёт. Но это лишь догадка.`);
  } else {
    s.suspicion = clamp(s.suspicion-8);
    addLog(`🕰️ <b>Беглая проверка — ${s.name}:</b> алиби выглядит правдоподобно. Впрочем, это не точно.`);
  }
  return {consumed:true};
}

function doWitness(s){
  if(!s.claimedRevealed){
    addLog(`👁️ Сначала допросите ${s.name} — нужно знать, что именно проверять.`);
    return {consumed:false};
  }
  if(s.witnessResolved){
    addLog(`👁️ По ${s.name} уже всё установлено — свидетель сказал своё слово.`);
    return {consumed:true};
  }
  if(state.witnessPoolLeft<=0){
    addLog(`👁️ Все свидетели уже опрошены — больше никто ничего не помнит.`);
    return {consumed:true};
  }
  const dist = distanceFromCrime(s.claimedLocation);
  const successChance = dist<=1 ? 0.55 : (dist>=3 ? 0.25 : 0.4);
  if(Math.random() > successChance){
    const reason = dist>=3 ? ' Комната слишком далеко от шума и суеты той ночи — там почти никого не было.' : '';
    addLog(`👁️ Свидетель кое-что видел в ту ночь, но путается в показаниях — толку никакого.${reason}`);
    return {consumed:true};
  }
  const witnessName = rand(WITNESS_NAMES);
  state.witnessPoolLeft--;
  s.witnessResolved = true;
  const matches = (s.trueLocation.nom===s.claimedLocation.nom && s.trueTime===s.claimedTime);
  if(matches){
    s.alibiBroken = false;
    s.suspicion = clamp(s.suspicion-30);
    addLog(`👁️ <b>${witnessName}</b> подтверждает: видел(а) ${s.name} именно в ${s.claimedLocation.prep} в ${s.claimedTime}. Алиби <b>точно подтверждено</b>.`);
  } else {
    s.alibiBroken = true;
    s.suspicion = clamp(s.suspicion+40);
    addLog(`👁️ <b>${witnessName}</b> утверждает, что видел(а) ${s.name} в ${s.trueLocation.prep} около ${s.trueTime} — это не совпадает с показаниями! Алиби <b>точно разрушено</b>.`);
  }
  return {consumed:true};
}

function doConfront(s){
  if(!s.claimedRevealed){
    addLog(`⚖️ Вам пока не в чём обвинять ${s.name} — сначала допросите.`);
    return {consumed:false};
  }
  if(s.confronted){
    addLog(`⚖️ Вы уже предъявляли это обвинение ${s.name}.`);
    return {consumed:true};
  }
  s.confronted = true;
  if(s.isCriminal){
    s.suspicion = clamp(s.suspicion+26);
    addLog(`⚖️ Вы прямо обвиняете ${s.name} во лжи. ${fem(s)?'Она':'Он'} бледнеет и путается в показаниях — явный признак вины!`);
  } else {
    s.suspicion = clamp(s.suspicion-26);
    state.reputation = Math.max(0, state.reputation-1);
    addLog(`⚖️ Вы обвиняете ${s.name} во лжи, но обвинение разваливается — свидетели подтверждают ${fem(s)?'её':'его'} слова. Ваша репутация детектива страдает.`);
  }
  return {consumed:true};
}

function playCard(handIdx){
  if(state.gameOver) return;
  const card = state.hand[handIdx];
  if(!card) return;
  if(state.selected===null){
    addLog(`<i>Сначала выберите подозреваемого, затем сыграйте карту.</i>`);
    return;
  }
  const s = state.suspects.find(x=>x.id===state.selected);
  let result;
  if(card.type==='evidence') result = doEvidence(s);
  else if(card.type==='interrogate') result = doInterrogate(s);
  else if(card.type==='alibi') result = doAlibi(s);
  else if(card.type==='witness') result = doWitness(s);
  else if(card.type==='confront') result = doConfront(s);
  if(result && result.consumed){
    state.hand.splice(handIdx,1);
    drawCard();
    state.cardsPlayed++;
    state.turnsLeft = Math.max(0, state.turnsLeft - 1);
    maybeTriggerEvent();
    if(state.turnsLeft === 0 && !state.gameOver){
      renderAll();
      addLog(`<span class="event-tag">⏳ ВРЕМЯ ВЫШЛО!</span> Дело закрывается по совокупности подозрений...`);
      setTimeout(()=>{ autoAccuse(); }, 1200);
      return;
    }
  }
  renderAll();
}

function selectSuspect(id){
  if(state.gameOver) return;
  state.selected = (state.selected===id) ? null : id;
  renderSuspects();
}

function autoAccuse(){
  const top = state.suspects.slice().sort((a,b)=>b.suspicion-a.suspicion)[0];
  finalizeAccusation(top.id, true);
}

/* ====================== RENDER ====================== */
function renderAll(){
  document.getElementById('versionTag').textContent = GAME_VERSION;
  document.getElementById('caseStamp').textContent = `ДЕЛО № ${state.case.caseNo}`;
  const cfg = DIFFICULTY[state.difficulty||'normal'];
  document.getElementById('briefing').innerHTML =
    `<b>[${cfg.label}]</b> Жертва — <b>${state.case.victim}</b>. Место: <b>${state.case.crimeLocation.prep}</b>, время — <b>${state.case.crimeTime}</b>, орудие — <b>${state.case.weapon.nom}</b>.`;
  renderTurnPressure();
  renderSuspects();
  renderHand();
  renderInventory();
  renderFooter();
  renderLog();
}

function renderTurnPressure(){
  const el = document.getElementById('turnPressure');
  if(!el) return;
  const left = state.turnsLeft ?? state.maxTurns;
  const max = state.maxTurns || 22;
  const pct = Math.round((left/max)*100);
  const fillColor = pct > 50 ? '#4f7d4a' : pct > 25 ? '#c98a2c' : '#a83232';
  const warn = left <= 4 ? `<span class="pressure-warn">⚠ ОСТАЛОСЬ МАЛО!</span>` : '';
  el.innerHTML = `
    <span class="pressure-label">⏳ Ходов осталось:</span>
    <div class="pressure-track"><div class="pressure-fill" style="width:${pct}%;background:${fillColor};"></div></div>
    <span class="pressure-val" style="color:${fillColor}">${left} / ${max}</span>
    ${warn}
  `;
}

function renderInventory(){
  const el = document.getElementById('inventory');
  if(!el) return;
  const items = state.inventory || [];
  if(items.length===0){ el.innerHTML=''; return; }
  el.innerHTML = items.map(it=>`
    <div class="inv-item ${it.used?'used':''}" onclick="${it.used?'':'openItemModal('+it.id+')'}">
      <span class="inv-icon">${it.icon}</span>
      <span>${it.name}</span>
    </div>
  `).join('');
}

function renderSuspects(){
  const el = document.getElementById('suspects');
  el.innerHTML = state.suspects.map((s,idx)=>{
    const sel = state.selected===s.id ? 'selected' : '';
    const relationChip = s.relationRevealed ? `<span class="chip">Связь: ${s.relation}</span>` : `<span class="chip unknown">Связь: ?</span>`;
    const motiveTxt = s.hasMotive ? s.motive : 'не обнаружен';
    const motiveChip = s.motiveRevealed ? `<span class="chip">Мотив: ${motiveTxt}</span>` : `<span class="chip unknown">Мотив: ?</span>`;
    const alibiChip = s.claimedRevealed ? `<span class="chip">Алиби: ${s.claimedLocation.nom}, ${s.claimedTime}</span>` : `<span class="chip unknown">Алиби: ?</span>`;
    const behTxt = s.nervous ? 'нервозность' : (fem(s)?'спокойна':'спокоен');
    const behChip = s.behaviorRevealed ? `<span class="chip">Поведение: ${behTxt}</span>` : `<span class="chip unknown">Поведение: ?</span>`;
    let badges = '';
    if(s.alibiBroken===true) badges += `<span class="badge broken">Алиби разрушено (точно)</span>`;
    if(s.alibiBroken===false) badges += `<span class="badge confirmed">Алиби подтверждено (точно)</span>`;
    if(s.lawyered) badges += `<span class="badge lawyer">Адвокат</span>`;
    const marker = `left:calc(${s.suspicion}% - 1.5px)`;
    return `
      <div class="suspect-card ${sel}" onclick="selectSuspect(${s.id})">
        <div class="suspect-num">Подозреваемый №${idx+1}</div>
        <div class="suspect-name">${s.name}</div>
        <div class="chips">${relationChip}${motiveChip}${alibiChip}${behChip}</div>
        <div class="badges">${badges}</div>
        <div class="dial"><div class="dial-marker" style="${marker}"></div></div>
        <div class="dial-label">подозрение: ${s.suspicion}%</div>
      </div>
    `;
  }).join('');
}

function renderHand(){
  const el = document.getElementById('hand');
  const n = state.hand.length;
  el.innerHTML = state.hand.map((c,i)=>{
    const meta = CARD_META[c.type];
    const rot = (i - (n-1)/2) * 6;
    const dim = state.selected===null ? 'dim' : '';
    return `
      <div class="action-card ${dim}" style="--rot:${rot}deg; transform:rotate(${rot}deg);" onclick="playCard(${i})">
        <div class="ic">
          <img src="${meta.icon}" alt="${meta.title}" class="card-icon-img">
        </div>
        <div class="ti">${meta.title}</div>
        <div class="de">${meta.desc}</div>
      </div>
    `;
  }).join(''); // Метод .join('') уберет лишние запятые между карточками
}

function renderFooter(){
  const stars = '★'.repeat(state.reputation) + '☆'.repeat(Math.max(0,3-state.reputation));
  document.getElementById('reputation').textContent = `Репутация: ${stars}`;
  document.getElementById('stats').textContent = `Ходов сыграно: ${state.cardsPlayed} · Свидетелей: ${state.witnessPoolLeft}`;
  document.getElementById('accuseBtn').disabled = state.gameOver;
}

/* ====================== MODALS ====================== */
function openModal(id){ const el=document.getElementById(id); if(el) el.classList.remove('hidden'); }
function closeModal(id){ const el=document.getElementById(id); if(el) el.classList.add('hidden'); }

function openAccuseModal(){
  if(state.gameOver) return;
  const listEl = document.getElementById('accuseList');
  listEl.innerHTML = state.suspects.map(s=>`
    <label>
      <input type="radio" name="accuseChoice" value="${s.id}" onchange="document.getElementById('confirmAccuseBtn').disabled=false;">
      ${s.name} — текущее подозрение: ${s.suspicion}%
    </label>
  `).join('');
  document.getElementById('confirmAccuseBtn').disabled = true;
  openModal('accuseModal');
}

function confirmAccuse(){
  const chosen = document.querySelector('input[name="accuseChoice"]:checked');
  if(!chosen) return;
  finalizeAccusation(parseInt(chosen.value,10), false);
}

function finalizeAccusation(id, auto){
  state.gameOver = true;
  closeModal('accuseModal');
  const accused = state.suspects.find(s=>s.id===id);
  const criminal = state.suspects.find(s=>s.isCriminal);
  const reveal = `<p>Жертва — <b>${state.case.victim}</b>. Место: ${state.case.crimeLocation.prep}, ${state.case.crimeTime}; орудие — ${state.case.weapon.nom}. Настоящий преступник — <b>${criminal.name}</b> (${criminal.motive ? 'мотив: '+criminal.motive : 'мотив неизвестен'}).</p>`;
  let html;
  if(accused.id===criminal.id){
    let grade;
    if(auto) grade = 'Время вышло — дело закрылось автоматически на самом подозрительном. Повезло, что угадали!';
    else if(criminal.alibiBroken===true) grade = 'Безупречно! Свидетель уличил преступника — железные доказательства.';
    else if(criminal.confronted) grade = 'Дело раскрыто на нерве — прямое обвинение сработало.';
    else grade = 'Раскрыто по совокупности подозрений — чутьё не подвело.';
    html = `<h3>🎉 Дело закрыто</h3><p>Обвинён <b>${accused.name}</b> — верно!</p>${reveal}<p>${grade}</p>`;
  } else {
    const why = accused.isRedHerring ? ', попавшись на отвлекающий манёвр.' : '.';
    const autoTxt = auto ? ' Время вышло — выбор пал на самого подозрительного, но это был не тот человек.' : `Настоящий виновник скрылся, пока вы шли по ложному следу${why}`;
    html = `<h3>❌ Ошибка следствия</h3><p>Обвинён <b>${accused.name}</b> — это не преступник.</p>${reveal}<p>${autoTxt}</p>`;
  }
  document.getElementById('resultBox').innerHTML = `
    <button class="modal-close" data-close="resultModal">✕</button>
    ${html}
    <div class="modal-actions"><button class="btn btn-accent" id="restartBtn2">Новое дело</button></div>
  `;
  document.getElementById('restartBtn2').addEventListener('click', ()=>{ closeModal('resultModal'); openModal('difficultyModal'); });
  openModal('resultModal');
  renderFooter();
}

function buildFloorplanSVG(){
  const MARGIN=20, ROOM_W=115, ROOM_H=95, CORR_H=26;
  const colX = c => MARGIN + c*ROOM_W;
  const rowY = r => r===0 ? MARGIN : (MARGIN+ROOM_H+CORR_H);
  const centerOf = loc => ({ x: colX(loc.col)+ROOM_W/2, y: rowY(loc.row)+ROOM_H/2 });

  let svg = `<svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" font-family="Courier New, monospace">`;
  svg += `<rect x="8" y="8" width="484" height="244" rx="6" fill="none" stroke="#2b2316" stroke-width="3"/>`;
  // corridor
  svg += `<rect x="${MARGIN}" y="${MARGIN+ROOM_H}" width="${ROOM_W*4}" height="${CORR_H}" fill="#cdbb8d" stroke="#2b2316" stroke-width="1.5"/>`;
  svg += `<text x="${MARGIN+ROOM_W*4/2}" y="${MARGIN+ROOM_H+CORR_H/2+4}" font-size="10" text-anchor="middle" fill="#4a3d24">главный коридор</text>`;

  // rooms
  LOCATIONS.forEach(loc=>{
    const x = colX(loc.col)+3, y = rowY(loc.row)+3, w = ROOM_W-6, h = ROOM_H-6;
    const isCrime = loc.nom === state.case.crimeLocation.nom;
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${isCrime?'#f3dcdc':'#f2e8cf'}" stroke="${isCrime?'#a83232':'#cdbb8d'}" stroke-width="${isCrime?3:2}"/>`;
    const words = loc.nom.split(' ');
    const lines = words.length>1 ? [words[0], words.slice(1).join(' ')] : [loc.nom];
    const cx = x+w/2;
    lines.forEach((ln,li)=>{
      svg += `<text x="${cx}" y="${y+16+li*12}" font-size="10" text-anchor="middle" fill="#2b2316">${ln}</text>`;
    });
    if(isCrime){
      svg += `<text x="${cx}" y="${y+h-12}" font-size="18" text-anchor="middle">💀</text>`;
    }
  });

  // claimed pins, grouped by room
  const claimedPos = {};
  LOCATIONS.forEach(loc=>{
    const group = state.suspects.filter(s=>s.claimedRevealed && s.claimedLocation.nom===loc.nom);
    if(group.length===0) return;
    const c = centerOf(loc);
    group.forEach((s,gi)=>{
      const offsetX = (gi-(group.length-1)/2)*22;
      const px = c.x+offsetX, py = c.y+22;
      claimedPos[s.id] = {x:px, y:py};
      const idx = state.suspects.indexOf(s);
      svg += `<circle cx="${px}" cy="${py}" r="10" fill="${suspicionColor(s.suspicion)}" stroke="#2b2316" stroke-width="1.5"/>`;
      svg += `<text x="${px}" y="${py+3.5}" font-size="10" text-anchor="middle" fill="#fff" font-weight="bold">${idx+1}</text>`;
    });
  });

  // ghost markers for exposed liars (witness-confirmed mismatch)
  state.suspects.forEach(s=>{
    if(!(s.witnessResolved && s.alibiBroken===true)) return;
    const c = centerOf(s.trueLocation);
    const gx = c.x, gy = c.y-22;
    const idx = state.suspects.indexOf(s);
    const claimPos = claimedPos[s.id];
    if(claimPos){
      svg += `<line x1="${claimPos.x}" y1="${claimPos.y}" x2="${gx}" y2="${gy}" stroke="#2b2316" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7"/>`;
    }
    svg += `<circle cx="${gx}" cy="${gy}" r="10" fill="none" stroke="#a83232" stroke-width="2" stroke-dasharray="3,2"/>`;
    svg += `<text x="${gx}" y="${gy+3.5}" font-size="10" text-anchor="middle" fill="#a83232" font-weight="bold">${idx+1}</text>`;
  });

  svg += `</svg>`;
  return svg;
}

function openMapModal(){
  const svg = buildFloorplanSVG();
  const legend = `
    <div class="map-legend">
      <span class="lg-item">💀 — место преступления</span>
      <span class="lg-item"><span class="lg-dot" style="background:#4f7d4a;"></span>заявленное алиби (низкое подозрение)</span>
      <span class="lg-item"><span class="lg-dot" style="background:#c98a2c;"></span>заявленное алиби (среднее)</span>
      <span class="lg-item"><span class="lg-dot" style="background:#a83232;"></span>заявленное алиби (высокое)</span>
      <span class="lg-item"><span class="lg-dot" style="background:transparent;border-style:dashed;"></span>где на самом деле видел свидетель (если алиби разрушено)</span>
      <span class="lg-item">цифра в круге = номер подозреваемого на карточке</span>
    </div>
  `;
  document.getElementById('mapBody').innerHTML = `<div class="map-svg-wrap">${svg}</div>${legend}`;
  openModal('mapModal');
}

/* ====================== INIT ====================== */
function bind(id, evt, handler){
  const el = document.getElementById(id);
  if(el) el.addEventListener(evt, handler);
  else console.warn(`[detective-cards] элемент #${id} не найден.`);
}

document.addEventListener('click', (e)=>{
  if(e.target.matches('[data-close]')){
    closeModal(e.target.getAttribute('data-close'));
  }
});
bind('rulesBtn','click', ()=>openModal('rulesModal'));
bind('newGameBtn','click', ()=>openModal('difficultyModal'));
bind('accuseBtn','click', openAccuseModal);
bind('confirmAccuseBtn','click', confirmAccuse);
bind('mapBtn','click', openMapModal);

// Start by showing difficulty selection
openModal('difficultyModal');
