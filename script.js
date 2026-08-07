/* Card Detective — beta 6.0 */
const TG=window.Telegram?.WebApp;
if(TG){TG.ready();TG.expand();TG.enableClosingConfirmation();}
const haptic={
  light:()=>{try{TG?.HapticFeedback.impactOccurred('light');}catch(_){}},
  medium:()=>{try{TG?.HapticFeedback.impactOccurred('medium');}catch(_){}},
  success:()=>{try{TG?.HapticFeedback.notificationOccurred('success');}catch(_){}},
  warning:()=>{try{TG?.HapticFeedback.notificationOccurred('warning');}catch(_){}},
  error:()=>{try{TG?.HapticFeedback.notificationOccurred('error');}catch(_){}},
};

const GAME_VERSION='beta 6.0';
const SAVE_KEY='detective_save_v5';
const PROFILE_KEY='detective_profile_v6';
const ARCHIVE_KEY='detective_archive_v6';

function T(key,vars){return t(state.lang||'ru',key,vars);}
function GV(s){return gv(state.lang||'ru',s);}

/* ---- IMAGES ---- */
const CARD_IMG={evidence:'images/magnifying-glass.png',interrogate:'images/human.png',alibi:'images/alibi.png',witness:'images/vision.png',confront:'images/lie.png'};
const CARD_EMOJI={evidence:'🔍',interrogate:'🗣️',alibi:'🕰️',witness:'👁️',confront:'⚖️'};
function cardIcon(type){return `<img src="${CARD_IMG[type]}" style="width:22px;height:22px;object-fit:contain;display:block;margin:0 auto" onerror="this.outerHTML='<span style=font-size:1.3rem>${CARD_EMOJI[type]}</span>'">`;}

/* ---- STATIC DATA ---- */
const NAME_GROUPS=[
  [{name:'James Whitfield',g:'м'},{name:'Julia Warren',g:'ж'}],
  [{name:'Edward Blackwood',g:'м'},{name:'Emily Barrow',g:'ж'}],
  [{name:'Marcus Dupont',g:'м'},{name:'Mirabelle Duval',g:'ж'}],
  [{name:'Alister Finch',g:'м'},{name:'Adelina Fox',g:'ж'}],
  [{name:'Henry Caufield',g:'м'},{name:'Grace Carmichael',g:'ж'}],
  [{name:'Ricardo Moreno',g:'м'},{name:'Rosalinda Marlowe',g:'ж'}],
  [{name:'Nathaniel Grey',g:'м'},{name:'Nora Gilbert',g:'ж'}],
  [{name:'Vincent Harper',g:'м'},{name:'Victoria Hale',g:'ж'}],
  [{name:'Sean Everett',g:'м'},{name:'Charlotte Ashton',g:'ж'}],
  [{name:'Irwin Rossetti',g:'м'},{name:'Isabella Romano',g:'ж'}],
  [{name:'Simon Lloyd',g:'м'},{name:'Sophie Laval',g:'ж'}],
  [{name:'Patrick Doyle',g:'м'},{name:'Pauline Devereaux',g:'ж'}],
];
const TIMES=['21:00','21:30','22:00','22:15','22:45','23:00','23:30'];
const DIFFICULTY={
  easy:{maxTurns:30,witnesses:4,motiveSuspiciousChance:.85,motiveInnocentChance:.15,nerveSuspiciousChance:.7,nerveInnocentChance:.2,distanceHints:true},
  normal:{maxTurns:22,witnesses:3,motiveSuspiciousChance:.85,motiveInnocentChance:.30,nerveSuspiciousChance:.7,nerveInnocentChance:.25,distanceHints:true},
  hard:{maxTurns:16,witnesses:2,motiveSuspiciousChance:.80,motiveInnocentChance:.45,nerveSuspiciousChance:.6,nerveInnocentChance:.35,distanceHints:false},
};
const RANKS=[
  {min:0,  max:29,  key:'rank_0'},
  {min:30, max:79,  key:'rank_1'},
  {min:80, max:149, key:'rank_2'},
  {min:150,max:249, key:'rank_3'},
  {min:250,max:Infinity,key:'rank_4'},
];

/* ---- HELPERS ---- */
function rand(a){return a[Math.floor(Math.random()*a.length)];}
function randInt(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function shuffle(a){const r=a.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}
function pickUnique(p,n){return shuffle(p).slice(0,n);}
function clamp(v){return Math.max(0,Math.min(100,v));}
function initials(n){return n.split(' ').map(p=>p[0]+'.').join('');}
function fem(s){return s.g==='ж';}
function roomDist(a,b){return Math.abs(a.col-b.col)+Math.abs(a.row-b.row);}
function distFromCrime(loc){return roomDist(loc,state.case.crimeLocation);}
function suspicionColor(v){return v<33?'#4f7d4a':v<66?'#c98a2c':'#a83232';}
function getLocs(){return I18N[state.lang].data.locations;}
function getMotives(){return I18N[state.lang].data.motives;}
function getRelations(){return I18N[state.lang].data.relations;}
function getVictims(){return I18N[state.lang].data.victims;}
function getWeapons(){return I18N[state.lang].data.weapons;}
function getWitnessNames(){return I18N[state.lang].data.witnessNames;}
function getVictimBio(idx){return (I18N[state.lang].victimBios||[])[idx]||'';}
function getRankInfo(pts){return RANKS.find(r=>pts>=r.min&&pts<=r.max)||RANKS[0];}

/* ---- STATE ---- */
let state={lang:'ru',difficulty:'normal'};
let cardUid=0;
let activeTab='Suspects';

/* ════════════════════════════════════════════
   PROFILE SYSTEM
════════════════════════════════════════════ */
function loadProfile(){
  try{
    const raw=localStorage.getItem(PROFILE_KEY);
    return raw?JSON.parse(raw):{name:'',points:0,solved:0,failed:0,streak:0,bestStreak:0};
  }catch(_){return {name:'',points:0,solved:0,failed:0,streak:0,bestStreak:0};}
}
function saveProfile(p){
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p));}catch(_){}
}
function addProfileResult(won, diff){
  const p=loadProfile();
  const pts={easy:10,normal:20,hard:35}[diff]||10;
  const lossPts={easy:2,normal:5,hard:10}[diff]||5;
  if(won){
    p.points=Math.max(0,p.points+pts);
    p.solved=(p.solved||0)+1;
    p.streak=(p.streak||0)+1;
    p.bestStreak=Math.max(p.bestStreak||0,p.streak);
  } else {
    p.points=Math.max(0,p.points-lossPts);
    p.failed=(p.failed||0)+1;
    p.streak=0;
  }
  saveProfile(p);
}
function renderProfileModal(){
  const p=loadProfile();
  const inp=document.getElementById('profileNameInput');
  if(inp)inp.value=p.name||'';
  const rank=getRankInfo(p.points);
  const rankName=T(`ui.${rank.key}`);
  const rt=document.getElementById('profileRankText');if(rt)rt.textContent=rankName;
  const pp=document.getElementById('profilePoints');if(pp)pp.textContent=`${p.points} pts`;
  const nextRankIdx=RANKS.findIndex(r=>r.key===rank.key);
  const nextRank=RANKS[nextRankIdx+1];
  const pct=nextRank?Math.round(((p.points-rank.min)/(nextRank.min-rank.min))*100):100;
  const pf=document.getElementById('profileProgressFill');if(pf)pf.style.width=Math.min(100,pct)+'%';
  const pl=document.getElementById('profileProgressLabels');
  if(pl)pl.innerHTML=`<span>${rankName}</span><span>${nextRank?T(`ui.${nextRank.key}`):'MAX'}</span>`;
  const avatar=document.getElementById('profileAvatar');
  if(avatar){const avatars=['🕵️','🔍','🎖️','⭐','🏆'];avatar.textContent=avatars[Math.min(nextRankIdx,avatars.length-1)];}
  const statsEl=document.getElementById('profileStats');
  if(statsEl)statsEl.innerHTML=`
    <div class="stat-card"><div class="stat-val">${p.solved||0}</div><div class="stat-label">${T('ui.profile_solved')}</div></div>
    <div class="stat-card"><div class="stat-val">${p.failed||0}</div><div class="stat-label">${T('ui.profile_failed')}</div></div>
    <div class="stat-card"><div class="stat-val">${p.bestStreak||0}</div><div class="stat-label">${T('ui.profile_streak')}</div></div>
    <div class="stat-card"><div class="stat-val">${(p.solved||0)+(p.failed||0)}</div><div class="stat-label">Total</div></div>`;
}
function openProfileModal(){renderProfileModal();openModal('profileModal');}

/* ════════════════════════════════════════════
   ARCHIVE SYSTEM
════════════════════════════════════════════ */
function loadArchive(){
  try{const r=localStorage.getItem(ARCHIVE_KEY);return r?JSON.parse(r):[];}catch(_){return [];}
}
function addToArchive(entry){
  try{
    const archive=loadArchive();
    archive.unshift(entry);
    if(archive.length>50)archive.splice(50);
    localStorage.setItem(ARCHIVE_KEY,JSON.stringify(archive));
  }catch(_){}
}
function renderArchiveModal(){
  const archive=loadArchive();
  const el=document.getElementById('archiveList');if(!el)return;
  if(!archive.length){
    el.innerHTML=`<p class="archive-empty">${T('ui.archive_empty')}</p>`;return;
  }
  el.innerHTML=archive.map((c,i)=>`
    <div class="archive-item ${c.won?'win':'loss'}">
      <div class="arc-top">
        <span class="arc-num">№${c.caseNo}</span>
        <span class="arc-victim">${c.victim}</span>
        <span class="arc-result ${c.won?'win':'loss'}">${c.won?T('ui.archive_solved'):T('ui.archive_failed')}</span>
      </div>
      <div class="arc-bottom">
        🔫 ${c.criminal} · ${c.difficulty} · ${c.cardsPlayed} ${T('ui.archive_cards')} · ${c.date}
      </div>
    </div>`).join('');
}
function openArchiveModal(){renderArchiveModal();openModal('archiveModal');}

/* ════════════════════════════════════════════
   RELATIONSHIPS
════════════════════════════════════════════ */
const REL_TYPES=['loves','debt','rivals','friends','secret'];

function buildRelationships(suspects){
  const rels=[];
  const ids=suspects.map(s=>s.id);
  // Always: one debt to victim (for a suspicious suspect)
  const debtTarget=suspects.find(s=>s.isRedHerring||s.isCriminal)||rand(suspects);
  rels.push({type:'debt',aId:debtTarget.id,bId:null});
  // One interpersonal relationship between two suspects
  const pair=pickUnique(ids.filter(id=>id!==debtTarget.id),2);
  if(pair.length>=2)rels.push({type:rand(['loves','rivals','friends']),aId:pair[0],bId:pair[1]});
  // Maybe a secret
  if(Math.random()<0.55){
    const rest=ids.filter(id=>id!==debtTarget.id&&!pair.includes(id));
    const sp=pickUnique(rest.length>=2?rest:ids,2);
    if(sp.length>=2)rels.push({type:'secret',aId:sp[0],bId:sp[1]});
  }
  return rels;
}

function getRelForSuspect(sId){
  return (state.relationships||[]).filter(r=>r.aId===sId||r.bId===sId);
}
function getRelChips(s){
  if(!s.relRevealed)return '';
  return (state.relationships||[]).filter(r=>r.aId===s.id||r.bId===s.id).map(r=>{
    const otherId=r.aId===s.id?r.bId:r.aId;
    const other=otherId!=null?state.suspects.find(x=>x.id===otherId):null;
    const bName=other?other.name.split(' ')[0]:'';
    const key=`rel_chip_${r.type}`;
    return `<span class="chip rel">${T(`ui.${key}`,{b:bName})}</span>`;
  }).join('');
}
function applyRelationshipOnInterrogate(s){
  const rels=(state.relationships||[]).filter(r=>r.aId===s.id);
  let extraLine='';
  for(const r of rels){
    if(r.type==='debt'){
      s.suspicion=clamp(s.suspicion+10);
      const debtText={ru:'К тому же выясняется, что подозреваемый задолжал крупную сумму самой жертве.',en:'It also emerges that the suspect owed a significant sum to the victim.',de:'Außerdem stellt sich heraus, dass der Verdächtige dem Opfer eine große Summe schuldete.'};
      extraLine+=' '+debtText[state.lang||'ru'];
    }
    if(r.type==='loves'&&r.bId!=null){
      const other=state.suspects.find(x=>x.id===r.bId);
      if(other){
        other.suspicion=clamp(other.suspicion-6);
        const loveText={ru:`При упоминании ${other.name.split(' ')[0]} взгляд подозреваемого теплеет — похоже, чувства мешают объективности.`,en:`At the mention of ${other.name.split(' ')[0]}, the suspect's expression softens — feelings seem to cloud their judgment.`,de:`Bei der Erwähnung von ${other.name.split(' ')[0]} wirkt der Verdächtige weicher — Gefühle trüben offenbar das Urteil.`};
        extraLine+=' '+loveText[state.lang||'ru'];
      }
    }
    if(r.type==='rivals'&&r.bId!=null){
      const other=state.suspects.find(x=>x.id===r.bId);
      if(other){
        other.suspicion=clamp(other.suspicion+8);
        const rivalText={ru:`Не удержавшись, подозреваемый упоминает, что ${other.name.split(' ')[0]} в ту ночь вёл себя очень странно.`,en:`The suspect can't help mentioning that ${other.name.split(' ')[0]} was acting very strangely that night.`,de:`Der Verdächtige kann sich nicht zurückhalten und erwähnt, dass ${other.name.split(' ')[0]} in jener Nacht sehr seltsam wirkte.`};
        extraLine+=' '+rivalText[state.lang||'ru'];
      }
    }
  }
  s.relRevealed=true;
  return extraLine;
}

/* ════════════════════════════════════════════
   TABS / LAYOUT
════════════════════════════════════════════ */
function switchTab(name){
  haptic.light();activeTab=name;
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  const panel=document.getElementById('tab'+name);if(panel)panel.classList.add('active');
  const btn=document.getElementById('tb'+name);if(btn)btn.classList.add('active');
  if(name==='Log'){const l=document.getElementById('log');if(l)l.scrollTop=l.scrollHeight;}
  if(name==='Items')updateItemsBadge();
}
function updateLayoutVars(){
  const h=document.getElementById('appHeader');
  if(h)document.documentElement.style.setProperty('--header-h',h.getBoundingClientRect().height+'px');
}
function showScreen(name){
  document.getElementById('startScreen').classList.toggle('hidden',name!=='start');
  document.getElementById('gameScreen').classList.toggle('hidden',name!=='game');
}

/* ════════════════════════════════════════════
   SAVE / LOAD
════════════════════════════════════════════ */
function serializeLoc(loc){return loc?loc.nom:null;}
function deserializeLoc(nom){return nom?getLocs().find(l=>l.nom===nom)||null:null;}
function saveGame(){
  if(state.gameOver){clearSave();return;}
  try{
    localStorage.setItem(SAVE_KEY,JSON.stringify({
      version:GAME_VERSION,lang:state.lang,difficulty:state.difficulty,
      case:{victim:state.case.victim,victimIdx:state.case.victimIdx,crimeLocationNom:state.case.crimeLocation.nom,crimeTime:state.case.crimeTime,weaponNom:state.case.weapon.nom,caseNo:state.case.caseNo},
      suspects:state.suspects.map(s=>({...s,claimedLocation:serializeLoc(s.claimedLocation),trueLocation:serializeLoc(s.trueLocation)})),
      relationships:state.relationships,
      deck:state.deck,hand:state.hand,log:state.log,
      reputation:state.reputation,selected:state.selected,gameOver:state.gameOver,
      cardsPlayed:state.cardsPlayed,nextEventAt:state.nextEventAt,stormLocation:state.stormLocation,
      witnessPoolLeft:state.witnessPoolLeft,maxTurns:state.maxTurns,turnsLeft:state.turnsLeft,
      inventory:state.inventory.map(it=>({id:it.id,type:it.type,icon:it.icon,nameKey:it.nameKey,descKey:it.descKey,used:it.used})),
      itemUid:state.itemUid,
    }));
  }catch(e){console.warn('Save failed:',e);}
}
function clearSave(){try{localStorage.removeItem(SAVE_KEY);}catch(_){}}
function hasSave(){
  try{const r=localStorage.getItem(SAVE_KEY);if(!r)return false;const s=JSON.parse(r);return!!s&&s.version===GAME_VERSION&&!s.gameOver;}catch(_){return false;}
}
function loadSave(){
  try{
    const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;
    const save=JSON.parse(raw);if(!save||save.version!==GAME_VERSION)return false;
    state.lang=save.lang||'ru';state.difficulty=save.difficulty||'normal';
    const locs=getLocs(),weapons=getWeapons();
    const crimeLoc=locs.find(l=>l.nom===save.case.crimeLocationNom);
    const weapon=weapons.find(w=>w.nom===save.case.weaponNom);
    if(!crimeLoc||!weapon)return false;
    state.case={victim:save.case.victim,victimIdx:save.case.victimIdx||0,crimeLocation:crimeLoc,crimeTime:save.case.crimeTime,weapon,caseNo:save.case.caseNo};
    state.suspects=save.suspects.map(s=>({...s,claimedLocation:deserializeLoc(s.claimedLocation),trueLocation:deserializeLoc(s.trueLocation)}));
    state.relationships=save.relationships||[];
    state.deck=save.deck;state.hand=save.hand;state.log=save.log;
    state.reputation=save.reputation;state.selected=save.selected;state.gameOver=save.gameOver;
    state.cardsPlayed=save.cardsPlayed;state.nextEventAt=save.nextEventAt;state.stormLocation=save.stormLocation;
    state.witnessPoolLeft=save.witnessPoolLeft;state.maxTurns=save.maxTurns;state.turnsLeft=save.turnsLeft;
    state.itemUid=save.itemUid||0;
    const defs=getItemDefs();
    state.inventory=(save.inventory||[]).map(raw=>({...raw,apply:(defs.find(d=>d.type===raw.type)||{apply:()=>{}}).apply}));
    cardUid=state.itemUid+20;return true;
  }catch(e){console.warn('Load failed:',e);return false;}
}

/* ════════════════════════════════════════════
   BUILD GAME
════════════════════════════════════════════ */
function buildCase(){
  const victims=getVictims();
  const victimIdx=randInt(0,victims.length-1);
  return{victim:victims[victimIdx],victimIdx,crimeLocation:rand(getLocs()),crimeTime:rand(TIMES),weapon:rand(getWeapons()),caseNo:randInt(100,999)};
}
function buildSuspects(caseData,cfg){
  const groups=pickUnique(NAME_GROUPS,3);
  const names=shuffle([...groups[0],...groups[1],...groups[2]]);
  const relations=pickUnique(getRelations(),names.length);
  const motives=getMotives();
  const order=shuffle(names.map((_,i)=>i));
  const criminalIdx=order[0];const herringIdxs=[order[1],order[2]];
  const locs=getLocs();
  return names.map((n,i)=>{
    const isCriminal=i===criminalIdx,isRedHerring=herringIdxs.includes(i),suspicious=isCriminal||isRedHerring;
    const hasMotive=suspicious?(Math.random()<cfg.motiveSuspiciousChance):(Math.random()<cfg.motiveInnocentChance);
    const motive=hasMotive?rand(motives):null;
    const nervous=suspicious?(Math.random()<cfg.nerveSuspiciousChance):(Math.random()<cfg.nerveInnocentChance);
    let trueLocation,trueTime,claimedLocation,claimedTime;
    if(isCriminal){
      trueLocation=caseData.crimeLocation;trueTime=caseData.crimeTime;
      claimedLocation=rand(locs.filter(l=>l.nom!==caseData.crimeLocation.nom));
      claimedTime=rand(TIMES.filter(t=>t!==caseData.crimeTime));
    } else {
      trueLocation=rand(locs.filter(l=>l.nom!==caseData.crimeLocation.nom));
      trueTime=rand(TIMES);claimedLocation=trueLocation;claimedTime=trueTime;
    }
    return{id:i,name:n.name,g:n.g,relation:relations[i],motive,hasMotive,nervous,isCriminal,isRedHerring,trueLocation,trueTime,claimedLocation,claimedTime,suspicion:randInt(5,15),evIndex:0,qIndex:0,claimedRevealed:false,relationRevealed:false,motiveRevealed:false,behaviorRevealed:false,alibiBroken:null,confronted:false,witnessResolved:false,lawyered:false,relRevealed:false};
  });
}
function buildDeck(cfg){
  const s=cfg.maxTurns/22,n=b=>Math.max(1,Math.round(b*s));
  return shuffle([...Array(n(6)).fill('evidence'),...Array(n(9)).fill('interrogate'),...Array(n(6)).fill('alibi'),...Array(n(5)).fill('witness'),...Array(n(4)).fill('confront')]);
}
function drawCard(){if(!state.deck.length)return false;state.hand.push({id:cardUid++,type:state.deck.shift()});return true;}

/* ════════════════════════════════════════════
   GAME FLOW
════════════════════════════════════════════ */
function setLanguage(lang){
  state.lang=lang;closeModal('langModal');renderStartMenu();renderAllModalsText();
  openModal('difficultyModal');
}
function startWithDifficulty(diff){
  state.difficulty=diff;clearSave();closeModal('difficultyModal');newGame();
}
function newGame(){
  const cfg=DIFFICULTY[state.difficulty||'normal'];
  state.case=buildCase();
  state.suspects=buildSuspects(state.case,cfg);
  state.relationships=buildRelationships(state.suspects);
  state.deck=buildDeck(cfg);
  state.hand=[];for(let i=0;i<5;i++)drawCard();
  state.log=[];state.reputation=3;state.selected=null;state.gameOver=false;state.cardsPlayed=0;
  state.nextEventAt=5;state.stormLocation=null;state.witnessPoolLeft=cfg.witnesses;
  state.maxTurns=cfg.maxTurns;state.turnsLeft=cfg.maxTurns;state.inventory=[];state.itemUid=0;
  closeModal('resultModal');closeModal('accuseModal');closeModal('mapModal');closeModal('saveModal');
  showScreen('game');
  addLog(T('msg.game_start',{difficulty:T(`difficulty.${state.difficulty}_name`),time:state.case.crimeTime,location:state.case.crimeLocation.prep,victim:state.case.victim,weapon:state.case.weapon.nom,turns:cfg.maxTurns}));
  switchTab('Suspects');renderAll();saveGame();
}
function goToStartMenu(){
  showScreen('start');renderStartMenu();
}

/* ════════════════════════════════════════════
   LOG FEED
════════════════════════════════════════════ */
const _feedQueue=[];let _feedBusy=false;
function _stripHtml(html){
  return html.replace(/<span[^>]*class="log-idx"[^>]*>.*?<\/span>/g,'').replace(/<span[^>]*class="event-tag"[^>]*>[^<]*<\/span>/g,'‼️ ').replace(/<b>(.*?)<\/b>/gi,'$1').replace(/<i>(.*?)<\/i>/gi,'$1').replace(/<[^>]+>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
}
function _feedNext(){
  if(!_feedQueue.length){_feedBusy=false;return;}
  _feedBusy=true;
  const{html,isEvent,isItem}=_feedQueue.shift();
  const feed=document.getElementById('logFeed');
  if(!feed){_feedBusy=false;setTimeout(_feedNext,50);return;}
  const header=document.getElementById('appHeader');
  feed.style.top=(header?header.getBoundingClientRect().bottom:130)+6+'px';
  const plain=_stripHtml(html);
  const text=plain.length>200?plain.slice(0,200)+'…':plain;
  if(!text){_feedBusy=false;setTimeout(_feedNext,50);return;}
  const holdMs=Math.min(4500,Math.max(2800,text.length*17));
  const bubble=document.createElement('div');
  bubble.className='log-bubble'+(isEvent?' is-event':'')+(isItem?' is-item':'');
  bubble.textContent=text;
  feed.style.display='flex';feed.appendChild(bubble);
  requestAnimationFrame(()=>requestAnimationFrame(()=>bubble.classList.add('visible')));
  setTimeout(()=>{
    bubble.classList.remove('visible');bubble.classList.add('fading');
    setTimeout(()=>{bubble.remove();if(!feed.children.length)feed.style.display='none';setTimeout(_feedNext,120);},480);
  },holdMs);
}
function feedLog(html){
  const isEvent=html.includes('event-tag');
  const isItem=html.includes('🎒')||html.includes('item_found');
  _feedQueue.push({html,isEvent,isItem});
  if(!_feedBusy)_feedNext();
}
function addLog(html){
  state.log.push(html);renderLog();feedLog(html);
  if(activeTab!=='Log'){const b=document.getElementById('tbLog');if(b){b.style.color='var(--accent)';setTimeout(()=>{if(activeTab!=='Log')b.style.color='';},800);}}
}
function renderLog(){
  const el=document.getElementById('log');if(!el)return;
  el.innerHTML=state.log.map((l,i)=>`<div class="log-entry"><span class="log-idx">№${i+1}</span>${l}</div>`).join('');
  if(activeTab==='Log')el.scrollTop=el.scrollHeight;
}

/* ════════════════════════════════════════════
   EVENTS
════════════════════════════════════════════ */
function maybeTriggerEvent(){
  if(state.cardsPlayed<state.nextEventAt)return;state.nextEventAt+=5;
  const evs=[
    ()=>{const loc=rand(getLocs());state.stormLocation=loc.nom;return T('msg.event_storm',{location:loc.prep});},
    ()=>{const c=state.suspects.filter(s=>!s.lawyered);if(!c.length)return null;const s=rand(c);s.lawyered=true;return T('msg.event_lawyer',{name:s.name,suffix:fem(s)?T('msg.event_lawyer_f_suffix'):T('msg.event_lawyer_m_suffix')});},
    ()=>{state.suspects.forEach(s=>{s.suspicion=clamp(s.suspicion+randInt(-10,10));});return T('msg.event_rumors');},
    ()=>{state.reputation=Math.max(0,state.reputation-1);return T('msg.event_press');},
    ()=>{state.witnessPoolLeft+=1;return T('msg.event_new_witness');},
    ()=>{if(!state.hand.length)return null;state.hand.splice(randInt(0,state.hand.length-1),1);return T('msg.event_chaos');},
  ];
  const text=rand(evs)();
  if(text)addLog(`<span class="event-tag">${T('msg.event_prefix')}</span> ${text}`);
}

/* ════════════════════════════════════════════
   INVENTORY
════════════════════════════════════════════ */
function getItemDefs(){
  return[
    {type:'letter',icon:'📜',nameKey:'msg.item_letter_name',descKey:'msg.item_letter_desc',apply(s){s.motiveRevealed=true;if(s.hasMotive){s.suspicion=clamp(s.suspicion+12);addLog(T('msg.item_letter_motive_yes',{motive:s.motive,Name:s.name}));}else{s.suspicion=clamp(s.suspicion-10);addLog(T('msg.item_letter_motive_no',{name:s.name}));}}},
    {type:'key',icon:'🗝️',nameKey:'msg.item_key_name',descKey:'msg.item_key_desc',apply(s){if(state.stormLocation){const l=state.stormLocation;state.stormLocation=null;addLog(T('msg.item_key_storm',{location:l}));}else if(s.isCriminal){s.suspicion=clamp(s.suspicion+18);addLog(T('msg.item_key_guilty',{name:s.name}));}else{s.suspicion=clamp(s.suspicion-12);addLog(T('msg.item_key_innocent',{name:s.name}));}}},
    {type:'glove',icon:'🧤',nameKey:'msg.item_glove_name',descKey:'msg.item_glove_desc',apply(s){s.suspicion=clamp(s.suspicion+(s.isCriminal?30:20));state.suspects.filter(o=>o.id!==s.id).forEach(o=>{o.suspicion=clamp(o.suspicion-7);});addLog(T('msg.item_glove_log',{name:s.name,him:GV(s).him}));}},
    {type:'photo',icon:'📸',nameKey:'msg.item_photo_name',descKey:'msg.item_photo_desc',apply(s){if(!s.claimedRevealed){addLog(T('msg.item_photo_no_claimed',{name:s.name}));return;}if(s.witnessResolved){addLog(T('msg.item_photo_already',{name:s.name}));return;}s.witnessResolved=true;const ok=s.trueLocation.nom===s.claimedLocation.nom&&s.trueTime===s.claimedTime;if(ok){s.alibiBroken=false;s.suspicion=clamp(s.suspicion-32);addLog(T('msg.item_photo_confirmed',{name:s.name,claimed_loc:s.claimedLocation.prep,claimed_time:s.claimedTime}));}else{s.alibiBroken=true;s.suspicion=clamp(s.suspicion+42);addLog(T('msg.item_photo_broken',{name:s.name,true_loc:s.trueLocation.prep,true_time:s.trueTime}));}}},
  ];
}
function showItemToast(item){
  document.querySelectorAll('.item-toast').forEach(el=>el.remove());
  const label=state.lang==='de'?'im Tab Gegenstände':state.lang==='en'?'check Items tab':'во вкладке Предметы';
  const toast=document.createElement('div');toast.className='item-toast';
  toast.innerHTML=`<span class="t-icon">${item.icon}</span><span class="t-text">🎒 <b>${T(item.nameKey)}</b> — ${label}</span>`;
  document.body.appendChild(toast);
  const btn=document.getElementById('tbItems');
  if(btn){btn.classList.remove('flash-anim');void btn.offsetWidth;btn.classList.add('flash-anim');setTimeout(()=>btn.classList.remove('flash-anim'),2000);}
  setTimeout(()=>toast.remove(),2700);
}
function tryDropItem(){
  const evidencePlayed=state.suspects.reduce((acc,s)=>acc+s.evIndex,0);
  const forceFirst=evidencePlayed<=3&&state.inventory.length===0;
  if(Math.random()>(forceFirst?0.75:0.45))return;
  const defs=getItemDefs();
  const avail=defs.filter(def=>!state.inventory.find(it=>it.type===def.type&&!it.used));
  if(!avail.length)return;
  const def=rand(avail);
  const item={id:state.itemUid++,type:def.type,icon:def.icon,nameKey:def.nameKey,descKey:def.descKey,apply:def.apply,used:false};
  state.inventory.push(item);
  addLog(T('msg.item_found',{icon:def.icon,name:T(def.nameKey)}));
  showItemToast(item);updateItemsBadge();
}
function updateItemsBadge(){
  const unused=(state.inventory||[]).filter(it=>!it.used).length;
  const badge=document.getElementById('itemsBadge');if(!badge)return;
  if(unused>0&&activeTab!=='Items'){badge.textContent=unused;badge.classList.remove('hidden');}
  else badge.classList.add('hidden');
}
function openItemModal(itemId){
  if(state.gameOver)return;
  const item=state.inventory.find(it=>it.id===itemId);if(!item||item.used)return;
  document.getElementById('itemModalTitle').textContent=`${item.icon} ${T(item.nameKey)}`;
  document.getElementById('itemModalDesc').textContent=T(item.descKey);
  document.getElementById('itemTargetList').innerHTML=state.suspects.map(s=>`<label onclick="useItem(${itemId},${s.id})"><b>${s.name}</b>${s.claimedRevealed?` — ${s.suspicion}%`:' — ?'}</label>`).join('');
  openModal('itemModal');
}
function useItem(itemId,targetId){
  const item=state.inventory.find(it=>it.id===itemId);
  const s=state.suspects.find(x=>x.id===targetId);
  if(!item||item.used||!s)return;
  item.used=true;item.apply(s);closeModal('itemModal');renderAll();saveGame();
}

/* ════════════════════════════════════════════
   CARD ACTIONS
════════════════════════════════════════════ */
function locHasStorm(s){return state.stormLocation&&(s.claimedLocation.nom===state.stormLocation||s.trueLocation.nom===state.stormLocation);}

function doEvidence(s){
  const storm=locHasStorm(s),mult=storm?0.5:1;
  const crit=[
    ()=>{const twin=state.suspects.find(o=>o.id!==s.id&&initials(o.name)===initials(s.name));const amb=twin?T('msg.ev_crit_handkerchief_ambiguity',{initials:initials(s.name)}):'';return T('msg.ev_crit_handkerchief',{initials:initials(s.name),ambiguity:amb});},
    ()=>T('msg.ev_crit_silhouette',{name:s.name,time:state.case.crimeTime}),
    ()=>T('msg.ev_crit_letter',{name:s.name}),
    ()=>T('msg.ev_crit_item',{name:s.name}),
  ];
  const herring=[()=>T('msg.ev_herring_papers',{name:s.name}),()=>T('msg.ev_herring_nervous',{name:s.name,was_nervous:GV(s).nervous})];
  const innocent=[()=>T('msg.ev_innocent_witnesses',{name:s.name,was:GV(s).was}),()=>T('msg.ev_innocent_belongings',{name:s.name,his:GV(s).his}),()=>T('msg.ev_innocent_staff',{name:s.name})];
  let line;
  if(s.isCriminal){line=rand(crit)();s.evIndex++;s.suspicion=clamp(s.suspicion+Math.round(16*mult));}
  else if(s.isRedHerring){if(Math.random()<.5){line=rand(herring)();s.suspicion=clamp(s.suspicion+Math.round(9*mult));}else{line=rand(innocent)();s.suspicion=clamp(s.suspicion-Math.round(6*mult));}s.evIndex++;}
  else{line=rand(innocent)();s.evIndex++;s.suspicion=clamp(s.suspicion-Math.round(6*mult));}
  if(storm)line+=T('msg.ev_storm_suffix');
  addLog(T('msg.ev_log',{name:s.name,text:line}));tryDropItem();return{consumed:true};
}

function doInterrogate(s){
  if(s.lawyered){addLog(T('msg.int_lawyer',{name:s.name}));return{consumed:true};}
  const g=GV(s);let line;const qn=s.qIndex;
  if(qn===0){
    line=T(s.nervous?'msg.int_where_nervous':'msg.int_where_calm',{name:s.name,was:g.was,claimed_loc:s.claimedLocation.prep,claimed_time:s.claimedTime,He:g.he});
    s.claimedRevealed=true;s.behaviorRevealed=true;s.suspicion=clamp(s.suspicion+(s.nervous?6:-3));
    const cfg=DIFFICULTY[state.difficulty||'normal'];
    if(cfg.distanceHints){const d=distFromCrime(s.claimedLocation);if(d<=1){s.suspicion=clamp(s.suspicion+10);line+=T('msg.int_near_crime',{loc:s.claimedLocation.nom,name:s.name});}else if(d>=3){s.suspicion=clamp(s.suspicion-8);line+=T('msg.int_far_crime',{loc:s.claimedLocation.nom});}}
  }else if(qn===1){
    line=T('msg.int_relation',{name:s.name,relation:s.relation});s.relationRevealed=true;
    const extra=applyRelationshipOnInterrogate(s);
    if(extra)line+=extra;
  }else if(qn===2){
    if(s.hasMotive){line=T('msg.int_motive_yes',{name:s.name,motive:s.motive});s.suspicion=clamp(s.suspicion+8);}
    else{line=T('msg.int_motive_no',{name:s.name});s.suspicion=clamp(s.suspicion-4);}
    s.motiveRevealed=true;
  }else{line=T('msg.int_tired',{name:s.name,suffix:fem(s)?T('msg.int_tired_f_suffix'):T('msg.int_tired_m_suffix')});}
  s.qIndex++;addLog(T('msg.int_log',{name:s.name,text:line}));return{consumed:true};
}

function doAlibi(s){
  if(!s.claimedRevealed){addLog(T('msg.alibi_no_claimed',{name:s.name}));return{consumed:false};}
  if(Math.random()>0.65){addLog(T('msg.alibi_inconclusive',{name:s.name}));return{consumed:true};}
  if(s.isCriminal){s.suspicion=clamp(s.suspicion+14);addLog(T('msg.alibi_suspicious',{name:s.name}));}
  else{s.suspicion=clamp(s.suspicion-8);addLog(T('msg.alibi_clean',{name:s.name}));}
  return{consumed:true};
}

function doWitness(s){
  if(!s.claimedRevealed){addLog(T('msg.witness_no_claimed',{name:s.name}));return{consumed:false};}
  if(s.witnessResolved){addLog(T('msg.witness_already_done',{name:s.name}));return{consumed:true};}
  if(state.witnessPoolLeft<=0){addLog(T('msg.witness_pool_empty'));return{consumed:true};}
  const d=distFromCrime(s.claimedLocation);const chance=d<=1?0.55:(d>=3?0.25:0.4);
  if(Math.random()>chance){addLog(d>=3?T('msg.witness_confused_far'):T('msg.witness_confused'));return{consumed:true};}
  const wname=rand(getWitnessNames());state.witnessPoolLeft--;s.witnessResolved=true;
  const ok=s.trueLocation.nom===s.claimedLocation.nom&&s.trueTime===s.claimedTime;
  if(ok){s.alibiBroken=false;s.suspicion=clamp(s.suspicion-30);addLog(T('msg.witness_confirmed',{witness:wname,name:s.name,claimed_loc:s.claimedLocation.prep,claimed_time:s.claimedTime}));}
  else{s.alibiBroken=true;s.suspicion=clamp(s.suspicion+40);addLog(T('msg.witness_broken',{witness:wname,he:GV(s).he,name:s.name,true_loc:s.trueLocation.prep,true_time:s.trueTime}));}
  return{consumed:true};
}

function doConfront(s){
  if(!s.claimedRevealed){addLog(T('msg.confront_no_claimed',{name:s.name}));return{consumed:false};}
  if(s.confronted){addLog(T('msg.confront_already',{name:s.name}));return{consumed:true};}
  s.confronted=true;const g=GV(s);
  if(s.isCriminal){s.suspicion=clamp(s.suspicion+26);addLog(T('msg.confront_guilty',{name:s.name,He:g.he,pale:g.pale,confused:g.confused,his:g.his}));}
  else{s.suspicion=clamp(s.suspicion-26);state.reputation=Math.max(0,state.reputation-1);addLog(T('msg.confront_innocent',{name:s.name,his:g.his,him:g.him}));}
  return{consumed:true};
}

function playCard(handIdx){
  if(state.gameOver)return;
  const card=state.hand[handIdx];if(!card)return;
  if(state.selected===null){addLog(T('ui.no_suspect_selected'));return;}
  const s=state.suspects.find(x=>x.id===state.selected);
  let result;
  if(card.type==='evidence')result=doEvidence(s);
  if(card.type==='interrogate')result=doInterrogate(s);
  if(card.type==='alibi')result=doAlibi(s);
  if(card.type==='witness')result=doWitness(s);
  if(card.type==='confront')result=doConfront(s);
  if(result&&result.consumed){
    haptic.medium();state.hand.splice(handIdx,1);drawCard();
    state.cardsPlayed++;state.turnsLeft=Math.max(0,state.turnsLeft-1);
    maybeTriggerEvent();renderAll();saveGame();
    if(state.turnsLeft===0&&!state.gameOver){
      addLog(`<span class="event-tag">${T('msg.timeout')}</span>`);haptic.warning();
      setTimeout(()=>autoAccuse(),1200);
    }
  }else renderAll();
}

function selectSuspect(id){
  if(state.gameOver)return;haptic.light();
  state.selected=(state.selected===id)?null:id;renderSuspects();
}
function autoAccuse(){
  finalizeAccusation(state.suspects.slice().sort((a,b)=>b.suspicion-a.suspicion)[0].id,true);
}

/* ════════════════════════════════════════════
   RENDER
════════════════════════════════════════════ */
function renderAll(){
  const vt=document.getElementById('versionTag');if(vt)vt.textContent=GAME_VERSION;
  const cs=document.getElementById('caseStamp');if(cs)cs.textContent=T('ui.stamp_case',{n:state.case.caseNo});
  const brf=document.getElementById('briefing');
  if(brf)brf.innerHTML=T('msg.briefing',{difficulty:T(`difficulty.${state.difficulty||'normal'}_name`),victim:state.case.victim,location:state.case.crimeLocation.prep,time:state.case.crimeTime,weapon:state.case.weapon.nom});
  const vb=document.getElementById('victimBio');
  if(vb){const bio=getVictimBio(state.case.victimIdx||0);vb.textContent=bio;vb.style.display=bio?'':'none';}
  renderTurnPressure();renderSuspects();renderHand();renderInventoryTab();renderRepBar();renderLog();renderAllModalsText();updateItemsBadge();
  setTimeout(updateLayoutVars,60);
}

function renderTurnPressure(){
  const el=document.getElementById('turnPressure');if(!el)return;
  const left=state.turnsLeft??state.maxTurns,max=state.maxTurns||22;
  const pct=Math.round((left/max)*100);const fc=pct>50?'#4f7d4a':pct>25?'#c98a2c':'#a83232';
  const warn=left<=4?`<span class="pressure-warn">${T('pressure.warn')}</span>`:'';
  el.innerHTML=`<span class="pressure-label">${T('pressure.label')}</span><div class="pressure-track"><div class="pressure-fill" style="width:${pct}%;background:${fc}"></div></div><span class="pressure-val" style="color:${fc}">${T('pressure.val',{left,max})}</span>${warn}`;
  setTimeout(updateLayoutVars,50);
}

function renderSuspects(){
  const el=document.getElementById('suspects');if(!el)return;
  el.innerHTML=state.suspects.map((s,idx)=>{
    const sel=state.selected===s.id?'selected':'';
    const rChip=s.relationRevealed?`<span class="chip">${T('ui.chip_relation',{v:s.relation})}</span>`:`<span class="chip unknown">${T('ui.chip_relation_unknown')}</span>`;
    const mChip=s.motiveRevealed?`<span class="chip">${T('ui.chip_motive',{v:s.hasMotive?s.motive:'—'})}</span>`:`<span class="chip unknown">${T('ui.chip_motive_unknown')}</span>`;
    const aChip=s.claimedRevealed?`<span class="chip">${T('ui.chip_alibi',{loc:s.claimedLocation.nom,time:s.claimedTime})}</span>`:`<span class="chip unknown">${T('ui.chip_alibi_unknown')}</span>`;
    const behTxt=s.nervous?T('ui.behavior_nervous'):(state.lang==='ru'?(fem(s)?'спокойна':'спокоен'):state.lang==='de'?'ruhig':'calm');
    const bChip=s.behaviorRevealed?`<span class="chip">${T('ui.chip_behavior',{v:behTxt})}</span>`:`<span class="chip unknown">${T('ui.chip_behavior_unknown')}</span>`;
    const relChips=getRelChips(s);
    let badges='';
    if(s.alibiBroken===true)badges+=`<span class="badge broken">${T('ui.badge_alibi_broken')}</span>`;
    if(s.alibiBroken===false)badges+=`<span class="badge confirmed">${T('ui.badge_alibi_confirmed')}</span>`;
    if(s.lawyered)badges+=`<span class="badge lawyer">${T('ui.badge_lawyer')}</span>`;
    return `<div class="suspect-card ${sel}" onclick="selectSuspect(${s.id})">
      <div class="suspect-num">${T('ui.suspect_num',{n:idx+1})}</div>
      <div class="suspect-name">${s.name}</div>
      <div class="chips">${rChip}${mChip}${aChip}${bChip}${relChips}</div>
      <div class="badges">${badges}</div>
      <div class="dial"><div class="dial-marker" style="left:calc(${s.suspicion}% - 1.5px)"></div></div>
      <div class="dial-label">${T('ui.suspicion_label',{v:s.suspicion})}</div>
    </div>`;
  }).join('');
}

function renderHand(){
  const el=document.getElementById('hand');if(!el)return;
  const n=state.hand.length;
  el.innerHTML=state.hand.map((c,i)=>{
    const rot=(i-(n-1)/2)*5,dim=state.selected===null?'dim':'';
    return `<div class="action-card ${dim}" style="transform:rotate(${rot}deg)" onclick="playCard(${i})"><div class="ic">${cardIcon(c.type)}</div><div class="ti">${T(`cards.${c.type}_title`)}</div></div>`;
  }).join('');
  const di=document.getElementById('deckInfo');if(di)di.textContent=T('ui.deck_info',{deck:state.deck.length,hand:state.hand.length});
}

function renderInventoryTab(){
  const el=document.getElementById('inventoryFull');if(!el)return;
  const hint=document.getElementById('invHint');if(hint)hint.textContent=T('ui.inventory_hint');
  const items=state.inventory||[];
  if(!items.length){el.innerHTML='';return;}
  el.innerHTML=items.map(it=>`
    <div class="inv-item-full ${it.used?'used':''}" onclick="${it.used?'':'openItemModal('+it.id+')'}">
      <span class="inv-icon">${it.icon}</span>
      <div class="inv-item-info">
        <div class="inv-name">${T(it.nameKey)}</div>
        <div class="inv-desc">${T(it.descKey)}</div>
        ${it.used?`<div class="inv-used-label">✓ ${state.lang==='de'?'verwendet':state.lang==='en'?'used':'использован'}</div>`:''}
      </div>
    </div>`).join('');
}

function renderRepBar(){
  const stars='★'.repeat(state.reputation)+'☆'.repeat(Math.max(0,3-state.reputation));
  const rs=document.getElementById('repStars');if(rs)rs.textContent=T('ui.reputation_label',{stars});
  const st=document.getElementById('repStats');if(st)st.textContent=T('ui.stats_label',{played:state.cardsPlayed,witnesses:state.witnessPoolLeft});
  if(TG?.MainButton){state.gameOver?TG.MainButton.hide():TG.MainButton.show();}
  const db=document.getElementById('desktopAccuseBtn');
  if(db){db.textContent=T('ui.btn_accuse');db.style.display=state.gameOver?'none':'';}
}

function renderStartMenu(){
  const lang=state.lang||'ru';
  const titles={ru:'Карточный детектив',en:'Card Detective',de:'Karten-Detektiv'};
  const st=document.getElementById('startTitle');if(st)st.textContent=titles[lang]||titles.en;
  const ss=document.getElementById('startSubtitle');if(ss)ss.textContent=T('ui.menu_subtitle');
  const sb=document.getElementById('startBtnLabel');if(sb)sb.textContent=T('ui.menu_start');
  const pb=document.getElementById('profileBtnLabel');if(pb)pb.textContent=T('ui.menu_profile');
  const ab=document.getElementById('archiveBtnLabel');if(ab)ab.textContent=T('ui.menu_archive');
  const sv=document.getElementById('startVersion');if(sv)sv.textContent=GAME_VERSION;
}

function renderAllModalsText(){
  const bt=document.getElementById('brandTitle');if(bt)bt.textContent=T('ui.brand_title');
  const dh=document.getElementById('diffTitle');if(dh)dh.textContent=T('difficulty.title');
  const ds=document.getElementById('diffSubtitle');if(ds)ds.textContent=T('difficulty.subtitle');
  ['easy','normal','hard'].forEach(d=>{
    const n=document.getElementById('diff'+d[0].toUpperCase()+d.slice(1)+'Name');if(n)n.textContent=T(`difficulty.${d}_name`);
    const dd=document.getElementById('diff'+d[0].toUpperCase()+d.slice(1)+'Desc');if(dd)dd.textContent=T(`difficulty.${d}_desc`);
  });
  const rt=document.getElementById('rulesTitle');if(rt)rt.textContent=T('rules.title');
  const rl=document.getElementById('rulesList');if(rl)rl.innerHTML=['p1','p2','p3','p4','p5','p6','p7','p8'].map(k=>`<p>${T('rules.'+k)}</p>`).join('');
  const rok=document.getElementById('rulesOkBtn');if(rok)rok.textContent=T('ui.btn_ok');
  const ah=document.getElementById('accuseModalTitle');if(ah)ah.textContent=T('ui.accuse_modal_title');
  const aH=document.getElementById('accuseModalHint');if(aH)aH.textContent=T('ui.accuse_modal_hint');
  const mc=document.getElementById('mapCloseBtn');if(mc)mc.textContent=T('ui.btn_close');
  const mt=document.getElementById('mapModalTitle');if(mt)mt.textContent=T('ui.map_title');
  const sv2=document.getElementById('saveTitle');if(sv2)sv2.textContent=T('ui.save_title');
  const sb2=document.getElementById('saveBody');if(sb2)sb2.textContent=T('ui.save_body');
  const scb=document.getElementById('saveContinueBtn');if(scb)scb.textContent=T('ui.save_continue');
  const snb=document.getElementById('saveNewBtn');if(snb)snb.textContent=T('ui.save_new');
  const ptt=document.getElementById('profileTitle');if(ptt)ptt.textContent=T('ui.profile_title');
  const pnl=document.getElementById('profileNameLabel');if(pnl)pnl.textContent=T('ui.profile_name_label');
  const pni=document.getElementById('profileNameInput');if(pni)pni.placeholder=T('ui.profile_name_placeholder');
  const psb=document.getElementById('profileSaveBtn');if(psb)psb.textContent=T('ui.profile_save');
  const arT=document.getElementById('archiveTitle');if(arT)arT.textContent=T('ui.archive_title');
  if(TG?.MainButton)TG.MainButton.setText(T('ui.btn_accuse'));
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=T(el.dataset.i18n);});
}

/* ════════════════════════════════════════════
   MAP
════════════════════════════════════════════ */
function buildFloorplanSVG(){
  const locs=getLocs(),MG=20,RW=115,RH=95,CH=26;
  const cx=c=>MG+c*RW,cy=r=>r===0?MG:(MG+RH+CH),ctr=loc=>({x:cx(loc.col)+RW/2,y:cy(loc.row)+RH/2});
  let svg=`<svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" font-family="Courier New,monospace">`;
  svg+=`<rect x="8" y="8" width="484" height="244" rx="6" fill="none" stroke="#2b2316" stroke-width="3"/>`;
  svg+=`<rect x="${MG}" y="${MG+RH}" width="${RW*4}" height="${CH}" fill="#cdbb8d" stroke="#2b2316" stroke-width="1.5"/>`;
  svg+=`<text x="${MG+RW*2}" y="${MG+RH+CH/2+4}" font-size="10" text-anchor="middle" fill="#4a3d24">${T('ui.map_corridor')}</text>`;
  locs.forEach(loc=>{
    const x=cx(loc.col)+3,y=cy(loc.row)+3,w=RW-6,h=RH-6,isCrime=loc.nom===state.case.crimeLocation.nom;
    svg+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${isCrime?'#f3dcdc':'#f2e8cf'}" stroke="${isCrime?'#a83232':'#cdbb8d'}" stroke-width="${isCrime?3:2}"/>`;
    const words=loc.nom.split(' ');
    const lines=words.length>2?[words.slice(0,Math.ceil(words.length/2)).join(' '),words.slice(Math.ceil(words.length/2)).join(' ')]:[loc.nom];
    lines.forEach((ln,li)=>{svg+=`<text x="${x+w/2}" y="${y+16+li*12}" font-size="10" text-anchor="middle" fill="#2b2316">${ln}</text>`;});
    if(isCrime)svg+=`<text x="${x+w/2}" y="${y+h-12}" font-size="18" text-anchor="middle">💀</text>`;
  });
  const claimed={};
  locs.forEach(loc=>{
    const grp=state.suspects.filter(s=>s.claimedRevealed&&s.claimedLocation.nom===loc.nom);if(!grp.length)return;
    const c=ctr(loc);
    grp.forEach((s,gi)=>{const ox=(gi-(grp.length-1)/2)*22,px=c.x+ox,py=c.y+22,idx=state.suspects.indexOf(s);claimed[s.id]={x:px,y:py};svg+=`<circle cx="${px}" cy="${py}" r="10" fill="${suspicionColor(s.suspicion)}" stroke="#2b2316" stroke-width="1.5"/>`;svg+=`<text x="${px}" y="${py+3.5}" font-size="10" text-anchor="middle" fill="#fff" font-weight="bold">${idx+1}</text>`;});
  });
  state.suspects.forEach(s=>{
    if(!(s.witnessResolved&&s.alibiBroken===true))return;
    const c=ctr(s.trueLocation),gx=c.x,gy=c.y-22,idx=state.suspects.indexOf(s),cp=claimed[s.id];
    if(cp)svg+=`<line x1="${cp.x}" y1="${cp.y}" x2="${gx}" y2="${gy}" stroke="#2b2316" stroke-width="1.5" stroke-dasharray="4,3" opacity=".7"/>`;
    svg+=`<circle cx="${gx}" cy="${gy}" r="10" fill="none" stroke="#a83232" stroke-width="2" stroke-dasharray="3,2"/>`;
    svg+=`<text x="${gx}" y="${gy+3.5}" font-size="10" text-anchor="middle" fill="#a83232" font-weight="bold">${idx+1}</text>`;
  });
  return svg+'</svg>';
}
function openMapModal(){
  const svg=buildFloorplanSVG();
  const legend=`<div class="map-legend"><span class="lg-item">💀 ${T('ui.map_legend_crime')}</span><span class="lg-item"><span class="lg-dot" style="background:#4f7d4a"></span>${T('ui.map_legend_low')}</span><span class="lg-item"><span class="lg-dot" style="background:#c98a2c"></span>${T('ui.map_legend_mid')}</span><span class="lg-item"><span class="lg-dot" style="background:#a83232"></span>${T('ui.map_legend_high')}</span><span class="lg-item"><span class="lg-dot" style="border-style:dashed;background:transparent"></span>${T('ui.map_legend_witness')}</span></div>`;
  const mb=document.getElementById('mapBody');if(mb)mb.innerHTML=`<div class="map-svg-wrap">${svg}</div>${legend}`;
  openModal('mapModal');
}

/* ════════════════════════════════════════════
   ACCUSE / RESULT
════════════════════════════════════════════ */
function openAccuseModal(){
  if(state.gameOver)return;
  const listEl=document.getElementById('accuseList');if(!listEl)return;
  listEl.innerHTML=state.suspects.map(s=>`<label><input type="radio" name="accuseChoice" value="${s.id}" onchange="document.getElementById('confirmAccuseBtn').disabled=false;">${T('ui.accuse_option',{name:s.name,suspicion:s.suspicion})}</label>`).join('');
  document.getElementById('confirmAccuseBtn').disabled=true;openModal('accuseModal');
}
function confirmAccuse(){
  const ch=document.querySelector('input[name="accuseChoice"]:checked');if(!ch)return;
  finalizeAccusation(parseInt(ch.value,10),false);
}
function finalizeAccusation(id,auto){
  state.gameOver=true;clearSave();closeModal('accuseModal');
  const accused=state.suspects.find(s=>s.id===id);
  const criminal=state.suspects.find(s=>s.isCriminal);
  const g=GV(criminal);
  const reveal=T(criminal.motive?'msg.result_reveal':'msg.result_reveal_no_motive',{victim:state.case.victim,location:state.case.crimeLocation.prep,time:state.case.crimeTime,weapon:state.case.weapon.nom,criminal:criminal.name,motive:criminal.motive||''});
  const won=accused.id===criminal.id;
  // Update profile and archive
  addProfileResult(won,state.difficulty||'normal');
  addToArchive({
    caseNo:state.case.caseNo,victim:state.case.victim,criminal:criminal.name,
    won,difficulty:T(`difficulty.${state.difficulty||'normal'}_name`),
    cardsPlayed:state.cardsPlayed,
    date:new Date().toLocaleDateString(state.lang==='de'?'de-DE':state.lang==='en'?'en-GB':'ru-RU'),
  });
  let html;
  if(won){
    let grade=auto?T('msg.result_win_grade_auto'):criminal.alibiBroken?T('msg.result_win_grade_witness'):criminal.confronted?T('msg.result_win_grade_confront'):T('msg.result_win_grade_default');
    html=`<h3>${T('msg.result_win_title')}</h3><p>${T('msg.result_win_correct',{name:accused.name})}</p><p>${reveal}</p><p>${grade}</p>`;
    haptic.success();
  }else{
    const bodyKey=auto?'msg.result_lose_auto':accused.isRedHerring?'msg.result_lose_herring':'msg.result_lose_other';
    html=`<h3>${T('msg.result_lose_title')}</h3><p>${T('msg.result_lose_body',{name:accused.name})}</p><p>${reveal}</p><p>${T(bodyKey,{hidden:g.hidden})}</p>`;
    haptic.error();
  }
  const rb=document.getElementById('resultBox');if(!rb)return;
  rb.innerHTML=`<button class="modal-close" data-close="resultModal">✕</button>${html}
    <div class="modal-actions col">
      <button class="btn btn-accent" id="restartBtn2">${T('ui.result_new_game')}</button>
      <button class="btn btn-ghost" id="resultMenuBtn">🏠 ${state.lang==='de'?'Hauptmenü':state.lang==='en'?'Main Menu':'Главное меню'}</button>
    </div>`;
  document.getElementById('restartBtn2').addEventListener('click',()=>{closeModal('resultModal');if(TG?.MainButton)TG.MainButton.hide();openModal('difficultyModal');});
  document.getElementById('resultMenuBtn').addEventListener('click',()=>{closeModal('resultModal');if(TG?.MainButton)TG.MainButton.hide();goToStartMenu();});
  openModal('resultModal');
  if(TG?.MainButton)TG.MainButton.hide();
}

/* ════════════════════════════════════════════
   MODAL HELPERS
════════════════════════════════════════════ */
function openModal(id){const el=document.getElementById(id);if(el)el.classList.remove('hidden');}
function closeModal(id){const el=document.getElementById(id);if(el)el.classList.add('hidden');}

/* ════════════════════════════════════════════
   INIT
════════════════════════════════════════════ */
function bind(id,evt,fn){const el=document.getElementById(id);if(el)el.addEventListener(evt,fn);else console.warn('[detective] #'+id+' not found');}

document.addEventListener('click',e=>{
  if(e.target.matches('[data-close]'))closeModal(e.target.getAttribute('data-close'));
});

// Start menu buttons
bind('menuStartBtn','click',()=>{
  haptic.light();
  if(hasSave()){openModal('saveModal');}
  else{openModal('langModal');}
});
bind('menuProfileBtn','click',()=>{haptic.light();openProfileModal();});
bind('menuArchiveBtn','click',()=>{haptic.light();openArchiveModal();});
bind('menuLangBtn','click',()=>{haptic.light();openModal('langModal');});
bind('backToMenuBtn','click',()=>{haptic.light();goToStartMenu();});

// Game buttons
bind('rulesBtn','click',()=>{haptic.light();openModal('rulesModal');});
bind('mapBtn','click',()=>{haptic.light();openMapModal();});
bind('confirmAccuseBtn','click',confirmAccuse);

// Save modal
bind('saveContinueBtn','click',()=>{
  const ok=loadSave();
  closeModal('saveModal');
  if(ok){showScreen('game');renderAll();renderAllModalsText();}
  else{openModal('langModal');}
});
bind('saveNewBtn','click',()=>{clearSave();closeModal('saveModal');openModal('langModal');});

// Profile save
bind('profileSaveBtn','click',()=>{
  const inp=document.getElementById('profileNameInput');if(!inp)return;
  const p=loadProfile();p.name=inp.value.trim()||p.name;saveProfile(p);
  haptic.success();closeModal('profileModal');
});

// TG MainButton
if(TG?.MainButton){
  TG.MainButton.setParams({color:'#c9a227',text_color:'#1a1306'});
  TG.MainButton.onClick(()=>{haptic.medium();openAccuseModal();});
  TG.MainButton.hide();
} else {
  const dock=document.querySelector('.hand-dock');
  if(dock){
    const btn=document.createElement('button');
    btn.id='desktopAccuseBtn';btn.className='btn btn-accent desktop-accuse';
    btn.onclick=openAccuseModal;dock.parentNode.insertBefore(btn,dock);
  }
}

window.addEventListener('resize',updateLayoutVars);

/* ---- STARTUP ---- */
// Detect saved language
try{const r=localStorage.getItem(SAVE_KEY);if(r){const s=JSON.parse(r);if(s.lang)state.lang=s.lang;}}catch(_){}
renderStartMenu();
showScreen('start');
setTimeout(updateLayoutVars,200);
