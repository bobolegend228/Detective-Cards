/* ================================================================
   КАРТОЧНЫЙ ДЕТЕКТИВ — script.js   beta 4.0
   Логика игры. Строки берутся из i18n.js через t(lang, key, vars).
   ================================================================ */

/* ---- TELEGRAM MINI APP INIT ---- */
const TG = window.Telegram?.WebApp;
if(TG){ TG.ready(); TG.expand(); TG.enableClosingConfirmation(); }
const haptic = {
  light:   ()=>{ try{ TG?.HapticFeedback.impactOccurred('light');   }catch(_){} },
  medium:  ()=>{ try{ TG?.HapticFeedback.impactOccurred('medium');  }catch(_){} },
  success: ()=>{ try{ TG?.HapticFeedback.notificationOccurred('success'); }catch(_){} },
  warning: ()=>{ try{ TG?.HapticFeedback.notificationOccurred('warning'); }catch(_){} },
  error:   ()=>{ try{ TG?.HapticFeedback.notificationOccurred('error');   }catch(_){} },
};

const GAME_VERSION = 'beta 4.0';

/* ---- HELPER: translate with current lang ---- */
function T(key, vars){ return t(state.lang || 'ru', key, vars); }
function GV(suspect){ return gv(state.lang || 'ru', suspect); }

/* ================================================================
   STATIC DATA (lang-independent)
   ================================================================ */
const NAME_GROUPS = [
  [{name:'James Whitfield', g:'м'}, {name:'Julia Warren', g:'ж'}],
  [{name:'Edward Blackwood', g:'м'}, {name:'Emily Barrow', g:'ж'}],
  [{name:'Marcus Dupont', g:'м'}, {name:'Mirabelle Duval', g:'ж'}],
  [{name:'Alister Finch', g:'м'}, {name:'Adelina Fox', g:'ж'}],
  [{name:'Henry Caufield', g:'м'}, {name:'Grace Carmichael', g:'ж'}],
  [{name:'Ricardo Moreno', g:'м'}, {name:'Rosalinda Marlowe', g:'ж'}],
  [{name:'Nathaniel Grey', g:'м'}, {name:'Nora Gilbert', g:'ж'}],
  [{name:'Vincent Harper', g:'м'}, {name:'Victoria Hale', g:'ж'}],
  [{name:'Sean Everett', g:'м'}, {name:'Charlotte Ashton', g:'ж'}],
  [{name:'Irwin Rossetti', g:'м'}, {name:'Isabella Romano', g:'ж'}],
  [{name:'Simon Lloyd', g:'м'}, {name:'Sophie Laval', g:'ж'}],
  [{name:'Patrick Doyle', g:'м'}, {name:'Pauline Devereaux', g:'ж'}],
];

const TIMES = ['21:00','21:30','22:00','22:15','22:45','23:00','23:30'];

const DIFFICULTY = {
  easy:   { maxTurns:30, witnesses:4, motiveSuspiciousChance:0.85, motiveInnocentChance:0.15, nerveSuspiciousChance:0.7, nerveInnocentChance:0.2,  distanceHints:true  },
  normal: { maxTurns:22, witnesses:3, motiveSuspiciousChance:0.85, motiveInnocentChance:0.30, nerveSuspiciousChance:0.7, nerveInnocentChance:0.25, distanceHints:true  },
  hard:   { maxTurns:16, witnesses:2, motiveSuspiciousChance:0.80, motiveInnocentChance:0.45, nerveSuspiciousChance:0.6, nerveInnocentChance:0.35, distanceHints:false },
};

const CARD_TYPES = ['evidence','interrogate','alibi','witness','confront'];
const CARD_ICONS = { evidence:'🔍', interrogate:'🗣️', alibi:'🕰️', witness:'👁️', confront:'⚖️' };

/* ================================================================
   HELPERS
   ================================================================ */
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function pickUnique(pool,n){ return shuffle(pool).slice(0,n); }
function clamp(v){ return Math.max(0,Math.min(100,v)); }
function initials(name){ return name.split(' ').map(p=>p[0]+'.').join(''); }
function fem(s){ return s.g==='ж'; }
function roomDist(a,b){ return Math.abs(a.col-b.col)+Math.abs(a.row-b.row); }
function distFromCrime(loc){ return roomDist(loc, state.case.crimeLocation); }
function suspicionColor(v){ return v<33?'#4f7d4a':v<66?'#c98a2c':'#a83232'; }
function getLocs(){ return I18N[state.lang].data.locations; }
function getMotives(){ return I18N[state.lang].data.motives; }
function getRelations(){ return I18N[state.lang].data.relations; }
function getVictims(){ return I18N[state.lang].data.victims; }
function getWeapons(){ return I18N[state.lang].data.weapons; }
function getWitnessNames(){ return I18N[state.lang].data.witnessNames; }

/* ================================================================
   STATE
   ================================================================ */
let state = { lang: 'ru', difficulty: 'normal' };
let cardUid = 0;

/* ================================================================
   GAME BUILDING
   ================================================================ */
function buildCase(){
  const locs = getLocs();
  const weapons = getWeapons();
  return {
    victim: rand(getVictims()),
    crimeLocation: rand(locs),
    crimeTime: rand(TIMES),
    weapon: rand(weapons),
    caseNo: randInt(100,999),
  };
}

function buildSuspects(caseData, cfg){
  const groups = pickUnique(NAME_GROUPS,3);
  const names = shuffle([...groups[0],...groups[1],...groups[2]]);
  const relations = pickUnique(getRelations(), names.length);
  const motives   = getMotives();
  const order = shuffle(names.map((_,i)=>i));
  const criminalIdx = order[0];
  const herringIdxs = [order[1],order[2]];
  const locs = getLocs();
  return names.map((n,i)=>{
    const isCriminal   = i===criminalIdx;
    const isRedHerring = herringIdxs.includes(i);
    const suspicious   = isCriminal||isRedHerring;
    const hasMotive    = suspicious?(Math.random()<cfg.motiveSuspiciousChance):(Math.random()<cfg.motiveInnocentChance);
    const motive       = hasMotive ? rand(motives) : null;
    const nervous      = suspicious?(Math.random()<cfg.nerveSuspiciousChance):(Math.random()<cfg.nerveInnocentChance);
    let trueLocation, trueTime, claimedLocation, claimedTime;
    if(isCriminal){
      trueLocation   = caseData.crimeLocation;
      trueTime       = caseData.crimeTime;
      const otherL   = locs.filter(l=>l.nom!==caseData.crimeLocation.nom);
      const otherT   = TIMES.filter(t=>t!==caseData.crimeTime);
      claimedLocation = rand(otherL);
      claimedTime     = rand(otherT);
    } else {
      const otherL    = locs.filter(l=>l.nom!==caseData.crimeLocation.nom);
      trueLocation    = rand(otherL);
      trueTime        = rand(TIMES);
      claimedLocation = trueLocation;
      claimedTime     = trueTime;
    }
    return {
      id:i, name:n.name, g:n.g, relation:relations[i], motive, hasMotive, nervous,
      isCriminal, isRedHerring, trueLocation, trueTime, claimedLocation, claimedTime,
      suspicion:randInt(5,15), evIndex:0, qIndex:0,
      claimedRevealed:false, relationRevealed:false, motiveRevealed:false, behaviorRevealed:false,
      alibiBroken:null, confronted:false, witnessResolved:false, lawyered:false,
    };
  });
}

function buildDeck(cfg){
  const s = cfg.maxTurns/22;
  const n = b=>Math.max(1,Math.round(b*s));
  let d=[];
  for(let i=0;i<n(6);i++) d.push('evidence');
  for(let i=0;i<n(9);i++) d.push('interrogate');
  for(let i=0;i<n(6);i++) d.push('alibi');
  for(let i=0;i<n(5);i++) d.push('witness');
  for(let i=0;i<n(4);i++) d.push('confront');
  return shuffle(d);
}

function drawCard(){
  if(!state.deck.length) return false;
  state.hand.push({id:cardUid++, type:state.deck.shift()});
  return true;
}

/* ================================================================
   NEW GAME / LANGUAGE / DIFFICULTY
   ================================================================ */
function setLanguage(lang){
  state.lang = lang;
  closeModal('langModal');
  renderAllModalsText();
  openModal('difficultyModal');
}

function renderAllModalsText(){
  const lang = state.lang;
  // Brand
  const bt = document.getElementById('brandTitle'); if(bt) bt.textContent = T('ui.brand_title');
  const bs = document.getElementById('brandSubtitle'); if(bs) bs.textContent = T('ui.brand_subtitle');
  // Difficulty modal
  const dh = document.getElementById('diffTitle'); if(dh) dh.textContent = T('difficulty.title');
  const ds = document.getElementById('diffSubtitle'); if(ds) ds.textContent = T('difficulty.subtitle');
  const eN = document.getElementById('diffEasyName'); if(eN) eN.textContent = T('difficulty.easy_name');
  const eD = document.getElementById('diffEasyDesc'); if(eD) eD.textContent = T('difficulty.easy_desc');
  const nN = document.getElementById('diffNormalName'); if(nN) nN.textContent = T('difficulty.normal_name');
  const nD = document.getElementById('diffNormalDesc'); if(nD) nD.textContent = T('difficulty.normal_desc');
  const hN = document.getElementById('diffHardName'); if(hN) hN.textContent = T('difficulty.hard_name');
  const hD = document.getElementById('diffHardDesc'); if(hD) hD.textContent = T('difficulty.hard_desc');
  // Rules modal
  const rt = document.getElementById('rulesTitle'); if(rt) rt.textContent = T('rules.title');
  const rl = document.getElementById('rulesList');
  if(rl) rl.innerHTML = ['p1','p2','p3','p4','p5','p6','p7','p8']
    .map(k=>`<p>${T('rules.'+k)}</p>`).join('');
  const rok = document.getElementById('rulesOkBtn'); if(rok) rok.textContent = T('ui.btn_ok');
  // Accuse modal static labels
  const acH = document.getElementById('accuseModalHint'); if(acH) acH.textContent = T('ui.accuse_modal_hint');
  const acC = document.getElementById('accuseCancelBtn'); if(acC) acC.textContent = T('ui.btn_cancel');
  // Map close btn
  const mc = document.getElementById('mapCloseBtn'); if(mc) mc.textContent = T('ui.btn_close');
  // TG MainButton text
  if(TG?.MainButton) TG.MainButton.setText(T('ui.btn_accuse'));
  // data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent = T(el.dataset.i18n);
  });
}

function startWithDifficulty(diff){
  state.difficulty = diff;
  closeModal('difficultyModal');
  newGame();
}

function newGame(){
  const cfg = DIFFICULTY[state.difficulty||'normal'];
  state.case      = buildCase();
  state.suspects  = buildSuspects(state.case, cfg);
  state.deck      = buildDeck(cfg);
  state.hand      = [];
  for(let i=0;i<5;i++) drawCard();
  state.log           = [];
  state.reputation    = 3;
  state.selected      = null;
  state.gameOver      = false;
  state.cardsPlayed   = 0;
  state.nextEventAt   = 5;
  state.stormLocation = null;
  state.witnessPoolLeft = cfg.witnesses;
  state.maxTurns      = cfg.maxTurns;
  state.turnsLeft     = cfg.maxTurns;
  state.inventory     = [];
  state.itemUid       = 0;
  closeModal('resultModal'); closeModal('accuseModal'); closeModal('mapModal');
  const diffLabel = T(`difficulty.${state.difficulty}_name`);
  addLog(T('msg.game_start',{
    difficulty: diffLabel,
    time: state.case.crimeTime,
    location: state.case.crimeLocation.prep,
    victim: state.case.victim,
    weapon: state.case.weapon.nom,
    turns: cfg.maxTurns,
  }));
  renderAll();
}

/* ================================================================
   LOG
   ================================================================ */
function addLog(html){ state.log.push(html); renderLog(); }
function renderLog(){
  const el=document.getElementById('log'); if(!el) return;
  el.innerHTML=state.log.map((line,i)=>`<div class="log-entry"><span class="log-idx">№${i+1}</span>${line}</div>`).join('');
  el.scrollTop=el.scrollHeight;
}

/* ================================================================
   EVENTS
   ================================================================ */
function maybeTriggerEvent(){
  if(state.cardsPlayed<state.nextEventAt) return;
  state.nextEventAt+=5;
  const events=[
    ()=>{
      const loc=rand(getLocs());
      state.stormLocation=loc.nom;
      return T('msg.event_storm',{location:loc.prep});
    },
    ()=>{
      const c=state.suspects.filter(s=>!s.lawyered);
      if(!c.length) return null;
      const s=rand(c); s.lawyered=true;
      const sfx = fem(s)?T('msg.event_lawyer_f_suffix'):T('msg.event_lawyer_m_suffix');
      return T('msg.event_lawyer',{name:s.name, suffix:sfx});
    },
    ()=>{ state.suspects.forEach(s=>{s.suspicion=clamp(s.suspicion+randInt(-10,10));}); return T('msg.event_rumors'); },
    ()=>{ state.reputation=Math.max(0,state.reputation-1); return T('msg.event_press'); },
    ()=>{ state.witnessPoolLeft+=1; return T('msg.event_new_witness'); },
    ()=>{
      if(!state.hand.length) return null;
      state.hand.splice(randInt(0,state.hand.length-1),1);
      return T('msg.event_chaos');
    },
  ];
  const text=rand(events)();
  if(text) addLog(`<span class="event-tag">${T('msg.event_prefix')}</span> ${text}`);
}

/* ================================================================
   INVENTORY
   ================================================================ */
function getItemDefs(){
  return [
    {
      type:'letter', icon:'📜',
      nameKey:'msg.item_letter_name', descKey:'msg.item_letter_desc',
      apply(s){
        s.motiveRevealed=true;
        if(s.hasMotive){
          s.suspicion=clamp(s.suspicion+12);
          addLog(T('msg.item_letter_motive_yes',{motive:s.motive, Name:s.name}));
        } else {
          s.suspicion=clamp(s.suspicion-10);
          addLog(T('msg.item_letter_motive_no',{name:s.name}));
        }
      }
    },
    {
      type:'key', icon:'🗝️',
      nameKey:'msg.item_key_name', descKey:'msg.item_key_desc',
      apply(s){
        if(state.stormLocation){
          const loc=state.stormLocation; state.stormLocation=null;
          addLog(T('msg.item_key_storm',{location:loc}));
        } else {
          if(s.isCriminal){ s.suspicion=clamp(s.suspicion+18); addLog(T('msg.item_key_guilty',{name:s.name})); }
          else { s.suspicion=clamp(s.suspicion-12); addLog(T('msg.item_key_innocent',{name:s.name})); }
        }
      }
    },
    {
      type:'glove', icon:'🧤',
      nameKey:'msg.item_glove_name', descKey:'msg.item_glove_desc',
      apply(s){
        s.suspicion=clamp(s.suspicion+(s.isCriminal?30:20));
        state.suspects.filter(o=>o.id!==s.id).forEach(o=>{o.suspicion=clamp(o.suspicion-7);});
        const g=GV(s);
        addLog(T('msg.item_glove_log',{name:s.name, him:g.him}));
      }
    },
    {
      type:'photo', icon:'📸',
      nameKey:'msg.item_photo_name', descKey:'msg.item_photo_desc',
      apply(s){
        if(!s.claimedRevealed){ addLog(T('msg.item_photo_no_claimed',{name:s.name})); return; }
        if(s.witnessResolved){  addLog(T('msg.item_photo_already',{name:s.name})); return; }
        s.witnessResolved=true;
        const ok=(s.trueLocation.nom===s.claimedLocation.nom && s.trueTime===s.claimedTime);
        if(ok){
          s.alibiBroken=false; s.suspicion=clamp(s.suspicion-32);
          addLog(T('msg.item_photo_confirmed',{name:s.name, claimed_loc:s.claimedLocation.prep, claimed_time:s.claimedTime}));
        } else {
          s.alibiBroken=true; s.suspicion=clamp(s.suspicion+42);
          addLog(T('msg.item_photo_broken',{name:s.name, true_loc:s.trueLocation.prep, true_time:s.trueTime}));
        }
      }
    },
  ];
}

function tryDropItem(){
  if(Math.random()>0.28) return;
  const defs=getItemDefs();
  const available=defs.filter(def=>!state.inventory.find(it=>it.type===def.type&&!it.used));
  if(!available.length) return;
  const def=rand(available);
  const item={id:state.itemUid++, type:def.type, icon:def.icon, nameKey:def.nameKey, descKey:def.descKey, apply:def.apply, used:false};
  state.inventory.push(item);
  addLog(T('msg.item_found',{icon:def.icon, name:T(def.nameKey)}));
}

function openItemModal(itemId){
  if(state.gameOver) return;
  const item=state.inventory.find(it=>it.id===itemId);
  if(!item||item.used) return;
  document.getElementById('itemModalTitle').textContent=`${item.icon} ${T(item.nameKey)}`;
  document.getElementById('itemModalDesc').textContent=T(item.descKey);
  const listEl=document.getElementById('itemTargetList');
  listEl.innerHTML=state.suspects.map(s=>`
    <label onclick="useItem(${itemId},${s.id})">
      <b>${s.name}</b>${s.claimedRevealed?` — ${s.suspicion}%`:' — ?'}
    </label>`).join('');
  openModal('itemModal');
}

function useItem(itemId,targetId){
  const item=state.inventory.find(it=>it.id===itemId);
  const s=state.suspects.find(x=>x.id===targetId);
  if(!item||item.used||!s) return;
  item.used=true; item.apply(s);
  closeModal('itemModal'); renderAll();
}

/* ================================================================
   ACTIONS
   ================================================================ */
function locHasStorm(s){ return state.stormLocation&&(s.claimedLocation.nom===state.stormLocation||s.trueLocation.nom===state.stormLocation); }

function doEvidence(s){
  const storm=locHasStorm(s);
  const mult=storm?0.5:1;
  let line;
  const critPool=[
    ()=>{
      const twin=state.suspects.find(o=>o.id!==s.id&&initials(o.name)===initials(s.name));
      const amb=twin?T('msg.ev_crit_handkerchief_ambiguity',{initials:initials(s.name)}):'';
      return T('msg.ev_crit_handkerchief',{initials:initials(s.name), ambiguity:amb});
    },
    ()=>T('msg.ev_crit_silhouette',{name:s.name, time:state.case.crimeTime}),
    ()=>T('msg.ev_crit_letter',{name:s.name}),
    ()=>T('msg.ev_crit_item',{name:s.name}),
  ];
  const herringPool=[
    ()=>T('msg.ev_herring_papers',{name:s.name}),
    ()=>{const g=GV(s); return T('msg.ev_herring_nervous',{name:s.name, was_nervous:g.nervous});},
  ];
  const innocentPool=[
    ()=>{const g=GV(s); return T('msg.ev_innocent_witnesses',{name:s.name, was:g.was});},
    ()=>{const g=GV(s); return T('msg.ev_innocent_belongings',{name:s.name, his:g.his, He:g.he});},
    ()=>T('msg.ev_innocent_staff',{name:s.name}),
  ];
  if(s.isCriminal){
    line=rand(critPool)(); s.evIndex++; s.suspicion=clamp(s.suspicion+Math.round(16*mult));
  } else if(s.isRedHerring){
    if(Math.random()<0.5){ line=rand(herringPool)(); s.suspicion=clamp(s.suspicion+Math.round(9*mult)); }
    else { line=rand(innocentPool)(); s.suspicion=clamp(s.suspicion-Math.round(6*mult)); }
    s.evIndex++;
  } else {
    line=rand(innocentPool)(); s.evIndex++; s.suspicion=clamp(s.suspicion-Math.round(6*mult));
  }
  if(storm) line+=T('msg.ev_storm_suffix');
  addLog(T('msg.ev_log',{name:s.name, text:line}));
  tryDropItem();
  return {consumed:true};
}

function doInterrogate(s){
  if(s.lawyered){ addLog(T('msg.int_lawyer',{name:s.name})); return {consumed:true}; }
  const g=GV(s); let line;
  const qn=s.qIndex;
  if(qn===0){
    const key=s.nervous?'msg.int_where_nervous':'msg.int_where_calm';
    line=T(key,{name:s.name, was:g.was, claimed_loc:s.claimedLocation.prep, claimed_time:s.claimedTime, He:g.he});
    s.claimedRevealed=true; s.behaviorRevealed=true;
    s.suspicion=clamp(s.suspicion+(s.nervous?6:-3));
    const cfg=DIFFICULTY[state.difficulty||'normal'];
    if(cfg.distanceHints){
      const d=distFromCrime(s.claimedLocation);
      if(d<=1){ s.suspicion=clamp(s.suspicion+10); line+=T('msg.int_near_crime',{loc:s.claimedLocation.nom, name:s.name}); }
      else if(d>=3){ s.suspicion=clamp(s.suspicion-8); line+=T('msg.int_far_crime',{loc:s.claimedLocation.nom}); }
    }
  } else if(qn===1){
    line=T('msg.int_relation',{name:s.name, relation:s.relation}); s.relationRevealed=true;
  } else if(qn===2){
    if(s.hasMotive){ line=T('msg.int_motive_yes',{name:s.name, motive:s.motive}); s.suspicion=clamp(s.suspicion+8); }
    else { line=T('msg.int_motive_no',{name:s.name}); s.suspicion=clamp(s.suspicion-4); }
    s.motiveRevealed=true;
  } else {
    const sfx=fem(s)?T('msg.int_tired_f_suffix'):T('msg.int_tired_m_suffix');
    line=T('msg.int_tired',{name:s.name, suffix:sfx});
  }
  s.qIndex++;
  addLog(T('msg.int_log',{name:s.name, text:line}));
  return {consumed:true};
}

function doAlibi(s){
  if(!s.claimedRevealed){ addLog(T('msg.alibi_no_claimed',{name:s.name})); return {consumed:false}; }
  if(Math.random()>0.65){ addLog(T('msg.alibi_inconclusive',{name:s.name})); return {consumed:true}; }
  if(s.isCriminal){ s.suspicion=clamp(s.suspicion+14); addLog(T('msg.alibi_suspicious',{name:s.name})); }
  else { s.suspicion=clamp(s.suspicion-8); addLog(T('msg.alibi_clean',{name:s.name})); }
  return {consumed:true};
}

function doWitness(s){
  if(!s.claimedRevealed){ addLog(T('msg.witness_no_claimed',{name:s.name})); return {consumed:false}; }
  if(s.witnessResolved){  addLog(T('msg.witness_already_done',{name:s.name})); return {consumed:true}; }
  if(state.witnessPoolLeft<=0){ addLog(T('msg.witness_pool_empty')); return {consumed:true}; }
  const d=distFromCrime(s.claimedLocation);
  const chance=d<=1?0.55:(d>=3?0.25:0.4);
  if(Math.random()>chance){
    addLog(d>=3?T('msg.witness_confused_far'):T('msg.witness_confused'));
    return {consumed:true};
  }
  const wname=rand(getWitnessNames());
  state.witnessPoolLeft--;
  s.witnessResolved=true;
  const ok=(s.trueLocation.nom===s.claimedLocation.nom&&s.trueTime===s.claimedTime);
  const g=GV(s);
  if(ok){
    s.alibiBroken=false; s.suspicion=clamp(s.suspicion-30);
    addLog(T('msg.witness_confirmed',{witness:wname, name:s.name, claimed_loc:s.claimedLocation.prep, claimed_time:s.claimedTime}));
  } else {
    s.alibiBroken=true; s.suspicion=clamp(s.suspicion+40);
    addLog(T('msg.witness_broken',{witness:wname, he:g.he, name:s.name, true_loc:s.trueLocation.prep, true_time:s.trueTime}));
  }
  return {consumed:true};
}

function doConfront(s){
  if(!s.claimedRevealed){ addLog(T('msg.confront_no_claimed',{name:s.name})); return {consumed:false}; }
  if(s.confronted){ addLog(T('msg.confront_already',{name:s.name})); return {consumed:true}; }
  s.confronted=true;
  const g=GV(s);
  if(s.isCriminal){
    s.suspicion=clamp(s.suspicion+26);
    addLog(T('msg.confront_guilty',{name:s.name, He:g.he, pale:g.pale, confused:g.confused, his:g.his}));
  } else {
    s.suspicion=clamp(s.suspicion-26);
    state.reputation=Math.max(0,state.reputation-1);
    addLog(T('msg.confront_innocent',{name:s.name, his:g.his, him:g.him}));
  }
  return {consumed:true};
}

function playCard(handIdx){
  if(state.gameOver) return;
  const card=state.hand[handIdx]; if(!card) return;
  if(state.selected===null){ addLog(T('ui.no_suspect_selected')); return; }
  const s=state.suspects.find(x=>x.id===state.selected);
  let result;
  if(card.type==='evidence')    result=doEvidence(s);
  if(card.type==='interrogate') result=doInterrogate(s);
  if(card.type==='alibi')       result=doAlibi(s);
  if(card.type==='witness')     result=doWitness(s);
  if(card.type==='confront')    result=doConfront(s);
  if(result&&result.consumed){
    haptic.medium();
    state.hand.splice(handIdx,1); drawCard();
    state.cardsPlayed++;
    state.turnsLeft=Math.max(0,state.turnsLeft-1);
    maybeTriggerEvent();
    if(state.turnsLeft===0&&!state.gameOver){
      renderAll();
      addLog(`<span class="event-tag">${T('msg.timeout')}</span>`);
      haptic.warning();
      setTimeout(()=>autoAccuse(),1200);
      return;
    }
  }
  renderAll();
}

function selectSuspect(id){
  if(state.gameOver) return;
  haptic.light();
  state.selected=(state.selected===id)?null:id;
  renderSuspects();
}

/* ================================================================
   AUTO ACCUSE (turn limit)
   ================================================================ */
function autoAccuse(){
  const top=state.suspects.slice().sort((a,b)=>b.suspicion-a.suspicion)[0];
  finalizeAccusation(top.id,true);
}

/* ================================================================
   RENDER
   ================================================================ */
function renderAll(){
  const vt=document.getElementById('versionTag'); if(vt) vt.textContent=GAME_VERSION;
  const cs=document.getElementById('caseStamp'); if(cs) cs.textContent=T('ui.stamp_case',{n:state.case.caseNo});
  const brf=document.getElementById('briefing');
  const diffLabel=T(`difficulty.${state.difficulty||'normal'}_name`);
  if(brf) brf.innerHTML=T('msg.briefing',{difficulty:diffLabel, victim:state.case.victim, location:state.case.crimeLocation.prep, time:state.case.crimeTime, weapon:state.case.weapon.nom});
  renderTurnPressure();
  renderSuspects();
  renderHand();
  renderInventory();
  renderFooter();
  renderLog();
  renderTopbarLabels();
  renderAllModalsText();
}

function renderTopbarLabels(){
  // brand titles are static in HTML — just update title attr on icon buttons
  const mapBtn=document.getElementById('mapBtn'); if(mapBtn) mapBtn.title=T('ui.btn_map');
  const rulesBtn=document.getElementById('rulesBtn'); if(rulesBtn) rulesBtn.title=T('ui.btn_rules');
  const newBtn=document.getElementById('newGameBtn'); if(newBtn) newBtn.title=T('ui.btn_new_game');
  // panel titles
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent=T(el.dataset.i18n);
  });
}

function renderTurnPressure(){
  const el=document.getElementById('turnPressure'); if(!el) return;
  const left=state.turnsLeft??state.maxTurns;
  const max=state.maxTurns||22;
  const pct=Math.round((left/max)*100);
  const fc=pct>50?'#4f7d4a':pct>25?'#c98a2c':'#a83232';
  const warn=left<=4?`<span class="pressure-warn">${T('pressure.warn')}</span>`:'';
  el.innerHTML=`
    <span class="pressure-label">${T('pressure.label')}</span>
    <div class="pressure-track"><div class="pressure-fill" style="width:${pct}%;background:${fc};"></div></div>
    <span class="pressure-val" style="color:${fc}">${T('pressure.val',{left,max})}</span>
    ${warn}`;
}

function renderSuspects(){
  const el=document.getElementById('suspects'); if(!el) return;
  el.innerHTML=state.suspects.map((s,idx)=>{
    const sel=state.selected===s.id?'selected':'';
    const relChip=s.relationRevealed
      ?`<span class="chip">${T('ui.chip_relation',{v:s.relation})}</span>`
      :`<span class="chip unknown">${T('ui.chip_relation_unknown')}</span>`;
    const motChip=s.motiveRevealed
      ?`<span class="chip">${T('ui.chip_motive',{v:s.hasMotive?s.motive:T('ui.chip_motive_unknown').replace('?','—')})}</span>`
      :`<span class="chip unknown">${T('ui.chip_motive_unknown')}</span>`;
    const alibiChip=s.claimedRevealed
      ?`<span class="chip">${T('ui.chip_alibi',{loc:s.claimedLocation.nom, time:s.claimedTime})}</span>`
      :`<span class="chip unknown">${T('ui.chip_alibi_unknown')}</span>`;
    const behTxt=s.nervous?T('ui.behavior_nervous'):(state.lang==='ru'?(fem(s)?'спокойна':'спокоен'):state.lang==='de'?'ruhig':'calm');
    const behChip=s.behaviorRevealed
      ?`<span class="chip">${T('ui.chip_behavior',{v:behTxt})}</span>`
      :`<span class="chip unknown">${T('ui.chip_behavior_unknown')}</span>`;
    let badges='';
    if(s.alibiBroken===true)  badges+=`<span class="badge broken">${T('ui.badge_alibi_broken')}</span>`;
    if(s.alibiBroken===false) badges+=`<span class="badge confirmed">${T('ui.badge_alibi_confirmed')}</span>`;
    if(s.lawyered)            badges+=`<span class="badge lawyer">${T('ui.badge_lawyer')}</span>`;
    return `
      <div class="suspect-card ${sel}" onclick="selectSuspect(${s.id})">
        <div class="suspect-num">${T('ui.suspect_num',{n:idx+1})}</div>
        <div class="suspect-name">${s.name}</div>
        <div class="chips">${relChip}${motChip}${alibiChip}${behChip}</div>
        <div class="badges">${badges}</div>
        <div class="dial"><div class="dial-marker" style="left:calc(${s.suspicion}% - 1.5px)"></div></div>
        <div class="dial-label">${T('ui.suspicion_label',{v:s.suspicion})}</div>
      </div>`;
  }).join('');
}

function renderHand(){
  const el=document.getElementById('hand'); if(!el) return;
  const n=state.hand.length;
  el.innerHTML=state.hand.map((c,i)=>{
    const rot=(i-(n-1)/2)*6;
    const dim=state.selected===null?'dim':'';
    return `
      <div class="action-card ${dim}" style="transform:rotate(${rot}deg);" onclick="playCard(${i})">
        <div class="ic">${CARD_ICONS[c.type]}</div>
        <div class="ti">${T(`cards.${c.type}_title`)}</div>
        <div class="de">${T(`cards.${c.type}_desc`)}</div>
      </div>`;
  }).join('');
  const di=document.getElementById('deckInfo');
  if(di) di.textContent=T('ui.deck_info',{deck:state.deck.length, hand:state.hand.length});
}

function renderInventory(){
  const el=document.getElementById('inventory'); if(!el) return;
  const items=state.inventory||[];
  if(!items.length){ el.innerHTML=''; return; }
  el.innerHTML=items.map(it=>`
    <div class="inv-item ${it.used?'used':''}" onclick="${it.used?'':` openItemModal(${it.id})`}">
      <span class="inv-icon">${it.icon}</span>
      <span>${T(it.nameKey)}</span>
    </div>`).join('');
}

function renderFooter(){
  const stars='★'.repeat(state.reputation)+'☆'.repeat(Math.max(0,3-state.reputation));
  const rep=document.getElementById('reputation'); if(rep) rep.textContent=T('ui.reputation_label',{stars});
  const st=document.getElementById('stats'); if(st) st.textContent=T('ui.stats_label',{played:state.cardsPlayed, witnesses:state.witnessPoolLeft});
  if(TG?.MainButton){ state.gameOver?TG.MainButton.hide():TG.MainButton.show(); }
  const fb=document.getElementById('accuseBtn'); if(fb) fb.disabled=state.gameOver;
}

/* ================================================================
   DIFFICULTY MODAL RENDER (текст зависит от языка)
   ================================================================ */
function renderTopbarLabels(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent = T(el.dataset.i18n);
  });
}
function buildFloorplanSVG(){
  const locs=getLocs();
  const MARGIN=20,ROOM_W=115,ROOM_H=95,CORR_H=26;
  const colX=c=>MARGIN+c*ROOM_W;
  const rowY=r=>r===0?MARGIN:(MARGIN+ROOM_H+CORR_H);
  const center=loc=>({x:colX(loc.col)+ROOM_W/2, y:rowY(loc.row)+ROOM_H/2});
  let svg=`<svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" font-family="Courier New, monospace">`;
  svg+=`<rect x="8" y="8" width="484" height="244" rx="6" fill="none" stroke="#2b2316" stroke-width="3"/>`;
  svg+=`<rect x="${MARGIN}" y="${MARGIN+ROOM_H}" width="${ROOM_W*4}" height="${CORR_H}" fill="#cdbb8d" stroke="#2b2316" stroke-width="1.5"/>`;
  svg+=`<text x="${MARGIN+ROOM_W*2}" y="${MARGIN+ROOM_H+CORR_H/2+4}" font-size="10" text-anchor="middle" fill="#4a3d24">${T('ui.map_corridor')}</text>`;
  locs.forEach(loc=>{
    const x=colX(loc.col)+3,y=rowY(loc.row)+3,w=ROOM_W-6,h=ROOM_H-6;
    const isCrime=loc.nom===state.case.crimeLocation.nom;
    svg+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${isCrime?'#f3dcdc':'#f2e8cf'}" stroke="${isCrime?'#a83232':'#cdbb8d'}" stroke-width="${isCrime?3:2}"/>`;
    const words=loc.nom.split(' ');
    const lines=words.length>2?[words.slice(0,Math.ceil(words.length/2)).join(' '),words.slice(Math.ceil(words.length/2)).join(' ')]:[loc.nom];
    const cx=x+w/2;
    lines.forEach((ln,li)=>{ svg+=`<text x="${cx}" y="${y+16+li*12}" font-size="10" text-anchor="middle" fill="#2b2316">${ln}</text>`; });
    if(isCrime) svg+=`<text x="${cx}" y="${y+h-12}" font-size="18" text-anchor="middle">💀</text>`;
  });
  const claimedPos={};
  locs.forEach(loc=>{
    const group=state.suspects.filter(s=>s.claimedRevealed&&s.claimedLocation.nom===loc.nom);
    if(!group.length) return;
    const c=center(loc);
    group.forEach((s,gi)=>{
      const ox=(gi-(group.length-1)/2)*22;
      const px=c.x+ox,py=c.y+22;
      claimedPos[s.id]={x:px,y:py};
      const idx=state.suspects.indexOf(s);
      svg+=`<circle cx="${px}" cy="${py}" r="10" fill="${suspicionColor(s.suspicion)}" stroke="#2b2316" stroke-width="1.5"/>`;
      svg+=`<text x="${px}" y="${py+3.5}" font-size="10" text-anchor="middle" fill="#fff" font-weight="bold">${idx+1}</text>`;
    });
  });
  state.suspects.forEach(s=>{
    if(!(s.witnessResolved&&s.alibiBroken===true)) return;
    const c=center(s.trueLocation);
    const gx=c.x,gy=c.y-22;
    const idx=state.suspects.indexOf(s);
    const cp=claimedPos[s.id];
    if(cp) svg+=`<line x1="${cp.x}" y1="${cp.y}" x2="${gx}" y2="${gy}" stroke="#2b2316" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7"/>`;
    svg+=`<circle cx="${gx}" cy="${gy}" r="10" fill="none" stroke="#a83232" stroke-width="2" stroke-dasharray="3,2"/>`;
    svg+=`<text x="${gx}" y="${gy+3.5}" font-size="10" text-anchor="middle" fill="#a83232" font-weight="bold">${idx+1}</text>`;
  });
  svg+=`</svg>`;
  return svg;
}

function openMapModal(){
  const svg=buildFloorplanSVG();
  const legend=`
    <div class="map-legend">
      <span class="lg-item">💀 ${T('ui.map_legend_crime')}</span>
      <span class="lg-item"><span class="lg-dot" style="background:#4f7d4a;"></span>${T('ui.map_legend_low')}</span>
      <span class="lg-item"><span class="lg-dot" style="background:#c98a2c;"></span>${T('ui.map_legend_mid')}</span>
      <span class="lg-item"><span class="lg-dot" style="background:#a83232;"></span>${T('ui.map_legend_high')}</span>
      <span class="lg-item"><span class="lg-dot" style="border-style:dashed;background:transparent;"></span>${T('ui.map_legend_witness')}</span>
    </div>`;
  const mb=document.getElementById('mapBody'); if(mb) mb.innerHTML=`<div class="map-svg-wrap">${svg}</div>${legend}`;
  const mt=document.getElementById('mapModalTitle'); if(mt) mt.textContent=T('ui.map_title');
  openModal('mapModal');
}

/* ================================================================
   ACCUSE / RESULT
   ================================================================ */
function openAccuseModal(){
  if(state.gameOver) return;
  const listEl=document.getElementById('accuseList'); if(!listEl) return;
  listEl.innerHTML=state.suspects.map(s=>`
    <label>
      <input type="radio" name="accuseChoice" value="${s.id}" onchange="document.getElementById('confirmAccuseBtn').disabled=false;">
      ${T('ui.accuse_option',{name:s.name, suspicion:s.suspicion})}
    </label>`).join('');
  document.getElementById('confirmAccuseBtn').disabled=true;
  const h=document.getElementById('accuseModalTitle'); if(h) h.textContent=T('ui.accuse_modal_title');
  openModal('accuseModal');
}

function confirmAccuse(){
  const ch=document.querySelector('input[name="accuseChoice"]:checked'); if(!ch) return;
  finalizeAccusation(parseInt(ch.value,10),false);
}

function finalizeAccusation(id,auto){
  state.gameOver=true; closeModal('accuseModal');
  const accused=state.suspects.find(s=>s.id===id);
  const criminal=state.suspects.find(s=>s.isCriminal);
  const g=GV(criminal);
  const revealKey=criminal.motive?'msg.result_reveal':'msg.result_reveal_no_motive';
  const reveal=T(revealKey,{victim:state.case.victim, location:state.case.crimeLocation.prep, time:state.case.crimeTime, weapon:state.case.weapon.nom, criminal:criminal.name, motive:criminal.motive||''});
  let html;
  if(accused.id===criminal.id){
    let grade;
    if(auto)                        grade=T('msg.result_win_grade_auto');
    else if(criminal.alibiBroken)   grade=T('msg.result_win_grade_witness');
    else if(criminal.confronted)    grade=T('msg.result_win_grade_confront');
    else                            grade=T('msg.result_win_grade_default');
    html=`<h3>${T('msg.result_win_title')}</h3><p>${T('msg.result_win_correct',{name:accused.name})}</p><p>${reveal}</p><p>${grade}</p>`;
    haptic.success();
  } else {
    const isHerring=accused.isRedHerring;
    const bodyKey=auto?'msg.result_lose_auto':(isHerring?'msg.result_lose_herring':'msg.result_lose_other');
    const body=T(bodyKey,{hidden:g.hidden});
    html=`<h3>${T('msg.result_lose_title')}</h3><p>${T('msg.result_lose_body',{name:accused.name})}</p><p>${reveal}</p><p>${body}</p>`;
    haptic.error();
  }
  const rb=document.getElementById('resultBox'); if(!rb) return;
  rb.innerHTML=`
    <button class="modal-close" data-close="resultModal">✕</button>
    ${html}
    <div class="modal-actions">
      <button class="btn btn-accent" id="restartBtn2">${T('ui.result_new_game')}</button>
    </div>`;
  document.getElementById('restartBtn2').addEventListener('click',()=>{
    closeModal('resultModal');
    if(TG?.MainButton) TG.MainButton.hide();
    openModal('langModal');
  });
  openModal('resultModal');
  renderFooter();
}

/* ================================================================
   MODALS
   ================================================================ */
function openModal(id){ const el=document.getElementById(id); if(el) el.classList.remove('hidden'); }
function closeModal(id){ const el=document.getElementById(id); if(el) el.classList.add('hidden'); }

/* ================================================================
   INIT
   ================================================================ */
function bind(id,evt,handler){
  const el=document.getElementById(id);
  if(el) el.addEventListener(evt,handler);
  else console.warn(`[detective] #${id} not found`);
}

document.addEventListener('click',e=>{
  if(e.target.matches('[data-close]')) closeModal(e.target.getAttribute('data-close'));
});

bind('rulesBtn','click',()=>{ haptic.light(); openModal('rulesModal'); });
bind('newGameBtn','click',()=>{ haptic.light(); openModal('langModal'); });
bind('mapBtn','click',()=>{ haptic.light(); openMapModal(); });
bind('confirmAccuseBtn','click',confirmAccuse);

if(TG?.MainButton){
  TG.MainButton.setText('⚖️');
  TG.MainButton.setParams({color:'#c9a227',text_color:'#1a1306'});
  TG.MainButton.onClick(()=>{ haptic.medium(); openAccuseModal(); });
} else {
  const fb=document.createElement('button');
  fb.className='btn btn-accent'; fb.id='accuseBtn';
  fb.textContent='⚖️ Accusation';
  fb.addEventListener('click',openAccuseModal);
  const footer=document.querySelector('.footer');
  if(footer) footer.appendChild(fb);
}

// Start with language selection
openModal('langModal');
