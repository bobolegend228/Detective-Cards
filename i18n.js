/* ================================================================
   КАРТОЧНЫЙ ДЕТЕКТИВ — i18n.js
   Все строки, данные и шаблоны сообщений для трёх языков.
   Шаблоны используют {placeholder} — заменяются через t(key, vars).
   Гендерные местоимения: {he} {his} {him} {was} {heshe_nervous}
   ================================================================ */

/* ---------- ГЕНДЕРНЫЕ ТАБЛИЦЫ ---------- */
const GENDER_VARS = {
  ru: {
    м: { he:'он', she:'он', his:'его', him:'него', was:'был', said:'сказал', nervous:'нервничал', hidden:'скрылся', called:'назвал', answered:'ответил', refused:'отказался', pale:'побледнел', confused:'путается' },
    ж: { he:'она', she:'она', his:'её', him:'неё', was:'была', said:'сказала', nervous:'нервничала', hidden:'скрылась', called:'назвала', answered:'ответила', refused:'отказалась', pale:'побледнела', confused:'путается' },
  },
  en: {
    м: { he:'he', she:'he', his:'his', him:'him', was:'was', said:'said', nervous:'nervous', hidden:'fled', called:'named', answered:'answered', refused:'refused', pale:'turned pale', confused:'is confused' },
    ж: { he:'she', she:'she', his:'her', him:'her', was:'was', said:'said', nervous:'nervous', hidden:'fled', called:'named', answered:'answered', refused:'refused', pale:'turned pale', confused:'is confused' },
  },
  de: {
    м: { he:'er', she:'er', his:'sein', him:'ihn', was:'war', said:'sagte', nervous:'nervös', hidden:'floh', called:'nannte', answered:'antwortete', refused:'weigerte sich', pale:'wurde blass', confused:'ist verwirrt' },
    ж: { he:'sie', she:'sie', his:'ihr', him:'sie', was:'war', said:'sagte', nervous:'nervös', hidden:'floh', called:'nannte', answered:'antwortete', refused:'weigerte sich', pale:'wurde blass', confused:'ist verwirrt' },
  },
};

/* ---------- ВСЕ ПЕРЕВОДЫ ---------- */
const I18N = {

/* ════════════════════════════════════════════════════════════════
   РУССКИЙ
════════════════════════════════════════════════════════════════ */
ru: {
  ui: {
    brand_title: 'Карточный детектив',
    brand_subtitle: 'бюро тайных расследований',
    btn_map: '🗺️',
    btn_rules: '📖',
    btn_new_game: '🗂️',
    btn_accuse: '⚖️ Предъявить обвинение',
    btn_confirm_accuse: 'Обвинить',
    btn_cancel: 'Отмена',
    btn_close: 'Закрыть',
    btn_ok: 'Понятно',
    panel_hand: 'Ваша рука',
    panel_inventory: 'Найденные предметы',
    panel_log: 'Журнал расследования',
    inventory_empty: '— пусто —',
    inventory_hint: 'Предметы попадаются с уликами. Нажмите, чтобы применить.',
    deck_info: 'В колоде: {deck} карт · В руке: {hand}',
    reputation_label: 'Репутация: {stars}',
    stats_label: 'Ходов: {played} · Свидетелей: {witnesses}',
    stamp_case: 'ДЕЛО № {n}',
    no_suspect_selected: 'Сначала выберите подозреваемого, затем сыграйте карту.',
    suspect_num: 'Подозреваемый №{n}',
    chip_relation: 'Связь: {v}',
    chip_relation_unknown: 'Связь: ?',
    chip_motive: 'Мотив: {v}',
    chip_motive_unknown: 'Мотив: ?',
    chip_alibi: 'Алиби: {loc}, {time}',
    chip_alibi_unknown: 'Алиби: ?',
    chip_behavior: 'Поведение: {v}',
    chip_behavior_unknown: 'Поведение: ?',
    behavior_nervous: 'нервозность',
    badge_alibi_confirmed: 'Алиби подтверждено (точно)',
    badge_alibi_broken: 'Алиби разрушено (точно)',
    badge_lawyer: 'Адвокат',
    suspicion_label: 'подозрение: {v}%',
    accuse_modal_title: 'Кто преступник?',
    accuse_modal_hint: 'Это решение завершит дело. Выбирайте обдуманно.',
    accuse_option: '{name} — подозрение: {suspicion}%',
    map_title: '🗺️ Карта усадьбы',
    map_legend_crime: '💀 — место преступления',
    map_legend_low: 'заявленное алиби (низкое подозрение)',
    map_legend_mid: 'заявленное алиби (среднее)',
    map_legend_high: 'заявленное алиби (высокое)',
    map_legend_witness: 'где видел свидетель (алиби разрушено)',
    map_legend_number: 'цифра = номер подозреваемого',
    map_corridor: 'главный коридор',
    item_modal_target: 'Выберите, на кого применить:',
    lang_modal_title: '🌐 Выберите язык',
    result_new_game: 'Новое дело',
  },

  difficulty: {
    title: '🕵️ Новое дело',
    subtitle: 'Выберите сложность расследования:',
    easy_name: 'Стажёр',
    easy_desc: '30 ходов · 4 свидетеля · Подсказки включены',
    normal_name: 'Детектив',
    normal_desc: '22 хода · 3 свидетеля · Стандарт',
    hard_name: 'Инспектор',
    hard_desc: '16 ходов · 2 свидетеля · Подсказки отключены',
  },

  cards: {
    evidence_title: 'Улика',
    evidence_desc: 'Найти физическую улику.',
    interrogate_title: 'Допрос',
    interrogate_desc: 'Задать вопрос подозреваемому.',
    alibi_title: 'Алиби',
    alibi_desc: 'Быстрый, но ненадёжный намёк.',
    witness_title: 'Свидетель',
    witness_desc: 'Точная проверка — но свидетелей мало.',
    confront_title: 'Ложь',
    confront_desc: 'Прямое обвинение. Риск.',
  },

  pressure: {
    label: '⏳ Ходов осталось:',
    warn: '⚠ ОСТАЛОСЬ МАЛО!',
    val: '{left} / {max}',
  },

  rules: {
    title: 'Как играть',
    p1: 'Каждая партия — новое преступление. Один из шести подозреваемых — преступник. Среди невиновных есть подсадные «красные селёдки». Пары с одинаковыми инициалами специально запутывают улики.',
    p2: '🔍 <b>Улика</b> — физическая улика. Иногда даёт предмет в инвентарь.',
    p3: '🗣️ <b>Допрос</b> — узнать алиби, связь, мотив.',
    p4: '🕰️ <b>Алиби</b> — ненадёжная беглая проверка.',
    p5: '👁️ <b>Свидетель</b> — единственный способ точно подтвердить или разрушить алиби.',
    p6: '⚖️ <b>Ложь</b> — прямое обвинение. Риск.',
    p7: '🎒 <b>Инвентарь</b> — найденные предметы применяются в любой момент.',
    p8: '⏳ <b>Лимит ходов</b> — когда ходы кончаются, дело закрывается автоматически.',
  },

  /* ---------- ДАННЫЕ ИГРЫ ---------- */
  data: {
    locations: [
      {nom:'библиотека',       prep:'библиотеке',        col:0,row:0},
      {nom:'кабинет',          prep:'кабинете',           col:1,row:0},
      {nom:'музыкальный салон',prep:'музыкальном салоне', col:2,row:0},
      {nom:'гостевая спальня', prep:'гостевой спальне',   col:3,row:0},
      {nom:'оранжерея',        prep:'оранжерее',          col:0,row:1},
      {nom:'винный погреб',    prep:'винном погребе',     col:1,row:1},
      {nom:'бильярдная',       prep:'бильярдной',         col:2,row:1},
      {nom:'розовый сад',      prep:'розовом саду',       col:3,row:1},
    ],
    motives: ['ревность','крупный долг','тайное наследство','давняя месть','страх разоблачения афёры','шантаж','оскорблённая гордость'],
    relations: ['деловой партнёр жертвы','дальний родственник жертвы','личный секретарь жертвы','садовник усадьбы','доверенное лицо жертвы','давний соперник жертвы','наследник состояния жертвы','доверенный дворецкий дома'],
    victims: ['лорд Уильям Эштон-Кэрр','миллионер Чарльз Уитмор','примадонна Бьянка Россетти','коллекционер Артур Пембрук','мадам Элоиза Деверо','профессор Йоганн Бергман','банкир Себастьян Кросс','актриса Камилла Лавэлль'],
    weapons: [
      {nom:'нож для писем',         instr:'ножом для писем'},
      {nom:'редкий яд',             instr:'редким ядом'},
      {nom:'бронзовый подсвечник',  instr:'бронзовым подсвечником'},
      {nom:'шёлковый шнур',         instr:'шёлковым шнуром'},
      {nom:'старинный револьвер',   instr:'старинным револьвером'},
    ],
    witnessNames: ['дворецкий Альфред','горничная Бетти','садовник Джозеф','кучер Томас','кухарка Маргарет','лакей Симон','компаньонка миссис Хадсон','старший конюх Патрик'],
  },

  /* ---------- ШАБЛОНЫ СООБЩЕНИЙ ---------- */
  msg: {
    game_start: '<b>[{difficulty}]</b> Около <b>{time}</b> в {location} обнаружено тело. Жертва — <b>{victim}</b>. Орудие — <b>{weapon}</b>. У вас <b>{turns} ходов</b>. Действуйте.',
    briefing:   '<b>[{difficulty}]</b> Жертва — <b>{victim}</b>. Место: <b>{location}</b>, время — <b>{time}</b>, орудие — <b>{weapon}</b>.',

    // УЛИКИ
    ev_crit_handkerchief: 'Найден платок с инициалами «{initials}» в нескольких шагах от места преступления.{ambiguity}',
    ev_crit_handkerchief_ambiguity: ' К сожалению, в доме сразу двое с инициалами «{initials}» — это ничего не доказывает само по себе.',
    ev_crit_silhouette: 'Свидетель вспоминает силуэт, похожий на {name}, у места преступления незадолго до {time}.',
    ev_crit_letter: 'Почерк на обгоревшем письме поразительно похож на почерк {name}.',
    ev_crit_item: 'В вещах {name} обнаружен предмет, который, по описанию, принадлежал жертве.',
    ev_herring_papers: 'В личных бумагах {name} нашли резкие слова о жертве — выглядит подозрительно, но прямой связи с преступлением нет.',
    ev_herring_nervous: 'Прислуга говорит, что {name} в последнее время сильно {was_nervous} — впрочем, причина может быть и другой.',
    ev_innocent_witnesses: 'Несколько свидетелей подтверждают: в момент преступления {name} {was} совсем в другом месте по своим делам.',
    ev_innocent_belongings: 'Личные вещи {name} найдены именно там, где, по {his} словам, они и должны быть.',
    ev_innocent_staff: 'Прислуга подтверждает рассказ {name} — никаких несоответствий.',
    ev_storm_suffix: ' <i>(буря мешает осмотру — след слабый)</i>',
    ev_log: '🔍 <b>Улика — {name}:</b> {text}',

    // ДОПРОС
    int_lawyer: '🗣️ <b>Допрос — {name}:</b> «По совету адвоката я отказываюсь отвечать», — холодно произносит {name}.',
    int_where_nervous: 'На вопрос «Где вы были?» {name} отвечает: «Я {was} в {claimed_loc} примерно в {claimed_time}.» Голос слегка дрожит.',
    int_where_calm: 'На вопрос «Где вы были?» {name} отвечает: «Я {was} в {claimed_loc} примерно в {claimed_time}.» Отвечает спокойно и уверенно.',
    int_relation: 'На вопрос о связи с жертвой {name} признаётся: «Я — {relation}».',
    int_motive_yes: '{name} отводит взгляд при упоминании жертвы. Возможный мотив: <b>{motive}</b>.',
    int_motive_no: '{name} пожимает плечами: «Мы почти не пересекались.» Видимых мотивов не обнаружено.',
    int_tired: '{name} раздражённо отвечает: «Я уже всё рассказал{suffix} следствию.»',
    int_tired_f_suffix: 'а',
    int_tired_m_suffix: '',
    int_near_crime: ' Судя по карте дома, {loc} совсем рядом с местом преступления — была возможность успеть туда и обратно.',
    int_far_crime: ' Судя по карте дома, {loc} в другом конце усадьбы — добраться до места преступления незамеченным было бы непросто.',
    int_log: '🗣️ <b>Допрос — {name}:</b> {text}',

    // АЛИБИ
    alibi_no_claimed: '🕰️ Сначала допросите {name} — иначе нечего проверять.',
    alibi_inconclusive: '🕰️ <b>Беглая проверка — {name}:</b> показания противоречивы, но точно сказать нельзя.',
    alibi_suspicious: '🕰️ <b>Беглая проверка — {name}:</b> что-то не сходится в показаниях... возможно, лжёт. Но это лишь догадка.',
    alibi_clean: '🕰️ <b>Беглая проверка — {name}:</b> алиби выглядит правдоподобно. Впрочем, это не точно.',

    // СВИДЕТЕЛЬ
    witness_no_claimed: '👁️ Сначала допросите {name} — нужно знать, что именно проверять.',
    witness_already_done: '👁️ По {name} уже всё установлено — свидетель сказал своё слово.',
    witness_pool_empty: '👁️ Все свидетели уже опрошены — больше никто ничего не помнит.',
    witness_confused: '👁️ Свидетель кое-что видел в ту ночь, но путается в показаниях — толку никакого.',
    witness_confused_far: '👁️ Свидетель кое-что видел в ту ночь, но путается в показаниях — толку никакого. Комната слишком далека от шума.',
    witness_confirmed: '👁️ <b>{witness}</b> подтверждает: видел(а) {name} именно в {claimed_loc} в {claimed_time}. Алиби <b>точно подтверждено</b>.',
    witness_broken: '👁️ <b>{witness}</b> утверждает, что видел(а) {name} в {true_loc} около {true_time} — это не совпадает с показаниями! Алиби <b>точно разрушено</b>.',

    // ЛОЖЬ
    confront_no_claimed: '⚖️ Вам пока не в чём обвинять {name} — сначала допросите.',
    confront_already: '⚖️ Вы уже предъявляли это обвинение {name}.',
    confront_guilty: '⚖️ Вы прямо обвиняете {name} во лжи. {He} {pale} и {confused} в показаниях — явный признак вины!',
    confront_innocent: '⚖️ Вы обвиняете {name} во лжи, но обвинение разваливается — свидетели подтверждают {his} слова. Ваша репутация детектива страдает.',

    // СОБЫТИЯ
    event_storm: 'Внезапная буря отрезала {location} от остального дома. Улики оттуда теперь искать труднее.',
    event_lawyer: '{name} нанял{suffix} адвоката. Дальнейшие допросы будут наталкиваться на молчание.',
    event_lawyer_f_suffix: 'а',
    event_lawyer_m_suffix: '',
    event_rumors: 'По дому пошли слухи и сплетни — подозрения у всех смешались.',
    event_press: 'Газетчики пронюхали о деле. Начальство недовольно вашей медлительностью.',
    event_new_witness: 'Неожиданно объявился ещё один человек, готовый рассказать, что видел в ту ночь.',
    event_chaos: 'В доме поднялась суматоха — одна из ваших карт оказалась бесполезной и была утрачена.',
    event_prefix: '‼️ ПРОИСШЕСТВИЕ:',

    // ITEMS
    item_found: '🎒 <b>Найден предмет:</b> {icon} <b>{name}</b> — теперь он в инвентаре.',
    item_letter_name: 'Старое письмо',
    item_letter_desc: 'Мятое письмо с разоблачительным текстом. Немедленно вскрывает мотив выбранного подозреваемого.',
    item_letter_motive_yes: '📜 <b>Старое письмо:</b> в тексте явно виден мотив — <b>{motive}</b>. {Name} замолкает.',
    item_letter_motive_no: '📜 <b>Старое письмо:</b> адресовано {name}, но носит личный характер и не связано с преступлением. Подозрений меньше.',
    item_key_name: 'Старинный ключ',
    item_key_desc: 'Ключ от комнаты. Снимает блокировку бурей — или вскрывает потайной сейф.',
    item_key_storm: '🗝️ <b>Старинный ключ:</b> открывает доступ в {location} — буря больше не мешает работе там.',
    item_key_guilty: '🗝️ <b>Старинный ключ:</b> потайной сейф в комнате {name} открыт. Внутри — документы, которые ставят алиби под сомнение.',
    item_key_innocent: '🗝️ <b>Старинный ключ:</b> в сейфе {name} только личные бумаги — ничего криминального.',
    item_glove_name: 'Окровавленная перчатка',
    item_glove_desc: 'Перчатка со следами. Резко поднимает подозрение к выбранному и снижает ко всем остальным.',
    item_glove_log: '🧤 <b>Окровавленная перчатка:</b> найдена рядом с вещами {name}. Все взгляды обращаются на {him}.',
    item_photo_name: 'Фотография с вечера',
    item_photo_desc: 'Снимок ночи преступления. Работает как бесплатный вызов свидетеля.',
    item_photo_no_claimed: '📸 <b>Фотография:</b> сначала узнайте алиби {name} — не с чем сравнивать.',
    item_photo_already: '📸 <b>Фотография:</b> алиби {name} уже проверено другим способом.',
    item_photo_confirmed: '📸 <b>Фотография:</b> {name} отчётливо виден(а) в {claimed_loc} в {claimed_time}. Алиби <b>подтверждено фотографией</b>.',
    item_photo_broken: '📸 <b>Фотография:</b> {name} на снимке в {true_loc} около {true_time} — это противоречит показаниям! Алиби <b>разрушено</b>.',

    // ТАЙМ-АУТ
    timeout: '⏳ ВРЕМЯ ВЫШЛО! Дело закрывается по совокупности подозрений...',

    // РЕЗУЛЬТАТ
    result_win_title: '🎉 Дело закрыто',
    result_win_correct: 'Вы обвинили <b>{name}</b> — и не ошиблись!',
    result_win_grade_witness: 'Безупречно! Свидетель уличил преступника — железные доказательства.',
    result_win_grade_confront: 'Дело раскрыто на нерве — прямое обвинение сработало.',
    result_win_grade_auto: 'Время вышло — дело закрылось автоматически. Повезло, что угадали!',
    result_win_grade_default: 'Раскрыто по совокупности подозрений — чутьё не подвело.',
    result_lose_title: '❌ Ошибка следствия',
    result_lose_body: 'Вы обвинили <b>{name}</b> — это не преступник.',
    result_lose_herring: 'Настоящий виновник {hidden}, пока вы шли по ложному следу, попавшись на отвлекающий манёвр.',
    result_lose_other: 'Настоящий виновник {hidden}, пока вы шли по ложному следу.',
    result_lose_auto: 'Время вышло — выбор пал на самого подозрительного, но это был не тот человек.',
    result_reveal: 'Жертва — <b>{victim}</b>. Место: {location}, {time}; орудие — {weapon}. Настоящий преступник — <b>{criminal}</b> (мотив: {motive}).',
    result_reveal_no_motive: 'Жертва — <b>{victim}</b>. Место: {location}, {time}; орудие — {weapon}. Настоящий преступник — <b>{criminal}</b>.',
  },
},

/* ════════════════════════════════════════════════════════════════
   ENGLISH
════════════════════════════════════════════════════════════════ */
en: {
  ui: {
    brand_title: 'Card Detective',
    brand_subtitle: 'bureau of secret investigations',
    btn_map: '🗺️',
    btn_rules: '📖',
    btn_new_game: '🗂️',
    btn_accuse: '⚖️ Make Accusation',
    btn_confirm_accuse: 'Accuse',
    btn_cancel: 'Cancel',
    btn_close: 'Close',
    btn_ok: 'Got it',
    panel_hand: 'Your Hand',
    panel_inventory: 'Found Items',
    panel_log: 'Investigation Log',
    inventory_empty: '— empty —',
    inventory_hint: 'Items are found with clues. Tap to use.',
    deck_info: 'Deck: {deck} cards · Hand: {hand}',
    reputation_label: 'Reputation: {stars}',
    stats_label: 'Turns: {played} · Witnesses: {witnesses}',
    stamp_case: 'CASE № {n}',
    no_suspect_selected: 'First select a suspect, then play a card.',
    suspect_num: 'Suspect #{n}',
    chip_relation: 'Role: {v}',
    chip_relation_unknown: 'Role: ?',
    chip_motive: 'Motive: {v}',
    chip_motive_unknown: 'Motive: ?',
    chip_alibi: 'Alibi: {loc}, {time}',
    chip_alibi_unknown: 'Alibi: ?',
    chip_behavior: 'Behavior: {v}',
    chip_behavior_unknown: 'Behavior: ?',
    behavior_nervous: 'nervous',
    badge_alibi_confirmed: 'Alibi confirmed (verified)',
    badge_alibi_broken: 'Alibi broken (verified)',
    badge_lawyer: 'Lawyer',
    suspicion_label: 'suspicion: {v}%',
    accuse_modal_title: 'Who is the murderer?',
    accuse_modal_hint: 'This decision will close the case. Choose carefully.',
    accuse_option: '{name} — suspicion: {suspicion}%',
    map_title: '🗺️ Mansion Floor Plan',
    map_legend_crime: '💀 — crime scene',
    map_legend_low: 'claimed alibi (low suspicion)',
    map_legend_mid: 'claimed alibi (medium)',
    map_legend_high: 'claimed alibi (high)',
    map_legend_witness: 'where witness saw them (alibi broken)',
    map_legend_number: 'number = suspect card number',
    map_corridor: 'main corridor',
    item_modal_target: 'Choose whom to use it on:',
    lang_modal_title: '🌐 Select Language',
    result_new_game: 'New Case',
  },

  difficulty: {
    title: '🕵️ New Case',
    subtitle: 'Choose difficulty:',
    easy_name: 'Rookie',
    easy_desc: '30 turns · 4 witnesses · Hints on',
    normal_name: 'Detective',
    normal_desc: '22 turns · 3 witnesses · Standard',
    hard_name: 'Inspector',
    hard_desc: '16 turns · 2 witnesses · No hints',
  },

  cards: {
    evidence_title: 'Clue',
    evidence_desc: 'Search for physical evidence.',
    interrogate_title: 'Interrogate',
    interrogate_desc: 'Question the suspect.',
    alibi_title: 'Alibi',
    alibi_desc: 'Quick but unreliable check.',
    witness_title: 'Witness',
    witness_desc: 'Verify alibi precisely — limited supply.',
    confront_title: 'Bluff',
    confront_desc: 'Direct accusation. High risk.',
  },

  pressure: {
    label: '⏳ Turns left:',
    warn: '⚠ RUNNING OUT!',
    val: '{left} / {max}',
  },

  rules: {
    title: 'How to Play',
    p1: 'Each game is a new crime. One of six suspects is the murderer. Among the innocent are deliberate "red herrings". Pairs with matching initials are designed to mislead.',
    p2: '🔍 <b>Clue</b> — physical evidence. Sometimes yields an item.',
    p3: '🗣️ <b>Interrogate</b> — learn alibi, connection, motive.',
    p4: '🕰️ <b>Alibi</b> — quick but unreliable check.',
    p5: '👁️ <b>Witness</b> — the only way to truly verify an alibi.',
    p6: '⚖️ <b>Bluff</b> — direct accusation. Risky.',
    p7: '🎒 <b>Inventory</b> — found items can be used at any time.',
    p8: '⏳ <b>Turn limit</b> — when turns run out, the case auto-resolves.',
  },

  data: {
    locations: [
      {nom:'library',       prep:'the library',       col:0,row:0},
      {nom:'study',         prep:'the study',         col:1,row:0},
      {nom:'music room',    prep:'the music room',    col:2,row:0},
      {nom:'guest bedroom', prep:'the guest bedroom', col:3,row:0},
      {nom:'orangery',      prep:'the orangery',      col:0,row:1},
      {nom:'wine cellar',   prep:'the wine cellar',   col:1,row:1},
      {nom:'billiard room', prep:'the billiard room', col:2,row:1},
      {nom:'rose garden',   prep:'the rose garden',   col:3,row:1},
    ],
    motives: ['jealousy','heavy debt','secret inheritance','old revenge','fear of exposure','blackmail','wounded pride'],
    relations: ['business partner of the victim','distant relative of the victim','personal secretary of the victim','estate gardener','confidant of the victim','long-time rival of the victim','heir to the estate','trusted butler'],
    victims: ['Lord William Ashton-Carr','millionaire Charles Whitmore','prima donna Bianca Rossetti','collector Arthur Pembrook','Madame Eloise Devereaux','Professor Johann Bergmann','banker Sebastian Cross','actress Camilla Lavelle'],
    weapons: [
      {nom:'letter knife',     instr:'with a letter knife'},
      {nom:'rare poison',      instr:'with a rare poison'},
      {nom:'bronze candlestick',instr:'with a bronze candlestick'},
      {nom:'silk cord',        instr:'with a silk cord'},
      {nom:'antique revolver', instr:'with an antique revolver'},
    ],
    witnessNames: ['the butler Alfred','the maid Betty','the gardener Joseph','the coachman Thomas','the cook Margaret','the footman Simon','the companion Mrs. Hudson','the head groom Patrick'],
  },

  msg: {
    game_start: '<b>[{difficulty}]</b> At <b>{time}</b>, a body was found in {location}. Victim — <b>{victim}</b>. Weapon — <b>{weapon}</b>. You have <b>{turns} turns</b>. Proceed.',
    briefing:   '<b>[{difficulty}]</b> Victim — <b>{victim}</b>. Location: <b>{location}</b>, time — <b>{time}</b>, weapon — <b>{weapon}</b>.',

    ev_crit_handkerchief: 'A handkerchief with the initials "{initials}" was found steps from the crime scene.{ambiguity}',
    ev_crit_handkerchief_ambiguity: ' Unfortunately, two people in the house share those initials — this alone proves nothing.',
    ev_crit_silhouette: 'A witness recalls a silhouette resembling {name} near the crime scene shortly before {time}.',
    ev_crit_letter: 'The handwriting on a burnt letter is strikingly similar to {name}\'s.',
    ev_crit_item: 'An item described as belonging to the victim was found among {name}\'s belongings.',
    ev_herring_papers: 'Harsh words about the victim were found in {name}\'s papers — suspicious, but no direct link to the crime.',
    ev_herring_nervous: 'Staff report that {name} has been very {was_nervous} lately — though the reason may be unrelated.',
    ev_innocent_witnesses: 'Several witnesses confirm {name} {was} elsewhere entirely at the time of the crime.',
    ev_innocent_belongings: '{name}\'s belongings were found exactly where {he} claimed they would be.',
    ev_innocent_staff: 'The staff corroborate {name}\'s account — no inconsistencies.',
    ev_storm_suffix: ' <i>(the storm hampers the search — faint trail)</i>',
    ev_log: '🔍 <b>Clue — {name}:</b> {text}',

    int_lawyer: '🗣️ <b>Interrogation — {name}:</b> "On my lawyer\'s advice, I decline to answer," {name} says coldly.',
    int_where_nervous: 'When asked "Where were you?", {name} replies: "I {was} in {claimed_loc} around {claimed_time}." {He} sounds slightly tense.',
    int_where_calm: 'When asked "Where were you?", {name} replies: "I {was} in {claimed_loc} around {claimed_time}." Calm and confident.',
    int_relation: 'When asked about their connection to the victim, {name} admits: "I am {relation}."',
    int_motive_yes: '{name} looks away when the victim is mentioned. Possible motive: <b>{motive}</b>.',
    int_motive_no: '{name} shrugs: "We barely crossed paths." No obvious motive.',
    int_tired: '{name} snaps: "I\'ve already told the investigation everything."',
    int_tired_f_suffix: '',
    int_tired_m_suffix: '',
    int_near_crime: ' According to the floor plan, {loc} is close to the crime scene — {name} could have slipped there and back.',
    int_far_crime: ' According to the floor plan, {loc} is far from the crime scene — getting there unnoticed would have been difficult.',
    int_log: '🗣️ <b>Interrogation — {name}:</b> {text}',

    alibi_no_claimed: '🕰️ Interrogate {name} first — nothing to check yet.',
    alibi_inconclusive: '🕰️ <b>Quick check — {name}:</b> contradictory accounts, but nothing conclusive.',
    alibi_suspicious: '🕰️ <b>Quick check — {name}:</b> something doesn\'t add up... possibly lying. Just a hunch.',
    alibi_clean: '🕰️ <b>Quick check — {name}:</b> alibi seems plausible. Though it\'s not certain.',

    witness_no_claimed: '👁️ Interrogate {name} first — you need to know what to verify.',
    witness_already_done: '👁️ {name}\'s alibi has already been verified.',
    witness_pool_empty: '👁️ All witnesses have been questioned — no one remembers anything more.',
    witness_confused: '👁️ The witness saw something that night but can\'t recall details — useless.',
    witness_confused_far: '👁️ The witness saw something but can\'t recall details. That room was far from the commotion.',
    witness_confirmed: '👁️ <b>{witness}</b> confirms seeing {name} in {claimed_loc} at {claimed_time}. Alibi <b>conclusively confirmed</b>.',
    witness_broken: '👁️ <b>{witness}</b> insists {he} saw {name} in {true_loc} around {true_time} — contradicting the claim! Alibi <b>conclusively broken</b>.',

    confront_no_claimed: '⚖️ You have nothing to confront {name} with yet — interrogate first.',
    confront_already: '⚖️ You have already confronted {name} with this accusation.',
    confront_guilty: '⚖️ You directly accuse {name} of lying. {He} {pale} and {confused} in {his} statement — a clear sign of guilt!',
    confront_innocent: '⚖️ You accuse {name} of lying, but the accusation falls apart — witnesses back {him} up. Your reputation suffers.',

    event_storm: 'A sudden storm has cut off {location} from the rest of the house. Evidence there is harder to find.',
    event_lawyer: '{name} has hired a lawyer. Further interrogations will be met with silence.',
    event_lawyer_f_suffix: '',
    event_lawyer_m_suffix: '',
    event_rumors: 'Rumours and gossip sweep the house — suspicion levels are all over the place.',
    event_press: 'Journalists have caught wind of the case. Your superiors are unhappy with the pace.',
    event_new_witness: 'Another person has come forward, willing to share what they saw that night.',
    event_chaos: 'A commotion in the house — one of your cards was rendered useless and lost.',
    event_prefix: '‼️ EVENT:',

    item_found: '🎒 <b>Item found:</b> {icon} <b>{name}</b> — added to inventory.',
    item_letter_name: 'Old Letter',
    item_letter_desc: 'A crumpled letter with damning content. Instantly reveals the motive of the chosen suspect.',
    item_letter_motive_yes: '📜 <b>Old Letter:</b> the text clearly reveals a motive — <b>{motive}</b>. {Name} falls silent.',
    item_letter_motive_no: '📜 <b>Old Letter:</b> addressed to {name}, but of personal nature — unrelated to the crime. Suspicion drops.',
    item_key_name: 'Antique Key',
    item_key_desc: 'A key to a room. Removes a storm blockade — or opens a hidden safe.',
    item_key_storm: '🗝️ <b>Antique Key:</b> grants access to {location} — the storm no longer blocks it.',
    item_key_guilty: '🗝️ <b>Antique Key:</b> a hidden safe in {name}\'s room is opened. Inside — documents that cast doubt on the alibi.',
    item_key_innocent: '🗝️ <b>Antique Key:</b> the safe holds only personal papers — nothing criminal.',
    item_glove_name: 'Bloodied Glove',
    item_glove_desc: 'A glove with traces. Sharply raises suspicion on the target, slightly lowers it on all others.',
    item_glove_log: '🧤 <b>Bloodied Glove:</b> found near {name}\'s belongings. All eyes turn to {him}.',
    item_photo_name: 'Evening Photograph',
    item_photo_desc: 'A photo from the night of the crime. Acts as a free witness call.',
    item_photo_no_claimed: '📸 <b>Photograph:</b> learn {name}\'s alibi first — nothing to compare against.',
    item_photo_already: '📸 <b>Photograph:</b> {name}\'s alibi has already been verified another way.',
    item_photo_confirmed: '📸 <b>Photograph:</b> {name} is clearly visible in {claimed_loc} at {claimed_time}. Alibi <b>confirmed by photograph</b>.',
    item_photo_broken: '📸 <b>Photograph:</b> {name} appears in {true_loc} around {true_time} — contradicting the claim! Alibi <b>broken</b>.',

    timeout: '⏳ TIME\'S UP! The case is resolved by current suspicion levels...',

    result_win_title: '🎉 Case Closed',
    result_win_correct: 'You accused <b>{name}</b> — correct!',
    result_win_grade_witness: 'Flawless! A witness caught the culprit in a lie — ironclad evidence.',
    result_win_grade_confront: 'Case cracked under pressure — the direct accusation worked.',
    result_win_grade_auto: 'Time ran out — the case closed on the most suspicious person. Lucky guess!',
    result_win_grade_default: 'Solved on accumulated suspicion — good instincts.',
    result_lose_title: '❌ Wrong Accusation',
    result_lose_body: 'You accused <b>{name}</b> — the wrong person.',
    result_lose_herring: 'The real culprit {hidden} while you chased a red herring.',
    result_lose_other: 'The real culprit {hidden} while you followed the wrong lead.',
    result_lose_auto: 'Time ran out — the most suspicious person was chosen automatically, but that wasn\'t the killer.',
    result_reveal: 'Victim — <b>{victim}</b>. Location: {location}, {time}; weapon — {weapon}. The real murderer was <b>{criminal}</b> (motive: {motive}).',
    result_reveal_no_motive: 'Victim — <b>{victim}</b>. Location: {location}, {time}; weapon — {weapon}. The real murderer was <b>{criminal}</b>.',
  },
},

/* ════════════════════════════════════════════════════════════════
   DEUTSCH
════════════════════════════════════════════════════════════════ */
de: {
  ui: {
    brand_title: 'Karten-Detektiv',
    brand_subtitle: 'büro für geheime ermittlungen',
    btn_map: '🗺️',
    btn_rules: '📖',
    btn_new_game: '🗂️',
    btn_accuse: '⚖️ Anklage erheben',
    btn_confirm_accuse: 'Anklagen',
    btn_cancel: 'Abbrechen',
    btn_close: 'Schließen',
    btn_ok: 'Verstanden',
    panel_hand: 'Ihre Hand',
    panel_inventory: 'Gefundene Gegenstände',
    panel_log: 'Ermittlungsprotokoll',
    inventory_empty: '— leer —',
    inventory_hint: 'Gegenstände werden mit Hinweisen gefunden. Tippen zum Verwenden.',
    deck_info: 'Stapel: {deck} Karten · Hand: {hand}',
    reputation_label: 'Ruf: {stars}',
    stats_label: 'Züge: {played} · Zeugen: {witnesses}',
    stamp_case: 'FALL № {n}',
    no_suspect_selected: 'Wählen Sie zuerst einen Verdächtigen, dann spielen Sie eine Karte.',
    suspect_num: 'Verdächtiger #{n}',
    chip_relation: 'Rolle: {v}',
    chip_relation_unknown: 'Rolle: ?',
    chip_motive: 'Motiv: {v}',
    chip_motive_unknown: 'Motiv: ?',
    chip_alibi: 'Alibi: {loc}, {time}',
    chip_alibi_unknown: 'Alibi: ?',
    chip_behavior: 'Verhalten: {v}',
    chip_behavior_unknown: 'Verhalten: ?',
    behavior_nervous: 'nervös',
    badge_alibi_confirmed: 'Alibi bestätigt (verifiziert)',
    badge_alibi_broken: 'Alibi widerlegt (verifiziert)',
    badge_lawyer: 'Anwalt',
    suspicion_label: 'Verdacht: {v}%',
    accuse_modal_title: 'Wer ist der Mörder?',
    accuse_modal_hint: 'Diese Entscheidung schließt den Fall. Wählen Sie sorgfältig.',
    accuse_option: '{name} — Verdacht: {suspicion}%',
    map_title: '🗺️ Grundriss des Herrenhauses',
    map_legend_crime: '💀 — Tatort',
    map_legend_low: 'behauptetes Alibi (geringer Verdacht)',
    map_legend_mid: 'behauptetes Alibi (mittel)',
    map_legend_high: 'behauptetes Alibi (hoch)',
    map_legend_witness: 'wo Zeuge sie sah (Alibi widerlegt)',
    map_legend_number: 'Zahl = Verdächtigen-Nummer',
    map_corridor: 'Hauptkorridor',
    item_modal_target: 'Auf wen anwenden:',
    lang_modal_title: '🌐 Sprache wählen',
    result_new_game: 'Neuer Fall',
  },

  difficulty: {
    title: '🕵️ Neuer Fall',
    subtitle: 'Schwierigkeitsgrad wählen:',
    easy_name: 'Anfänger',
    easy_desc: '30 Züge · 4 Zeugen · Hinweise aktiv',
    normal_name: 'Detektiv',
    normal_desc: '22 Züge · 3 Zeugen · Standard',
    hard_name: 'Inspektor',
    hard_desc: '16 Züge · 2 Zeugen · Keine Hinweise',
  },

  cards: {
    evidence_title: 'Hinweis',
    evidence_desc: 'Physische Beweise suchen.',
    interrogate_title: 'Verhör',
    interrogate_desc: 'Den Verdächtigen befragen.',
    alibi_title: 'Alibi',
    alibi_desc: 'Schnelle, unsichere Prüfung.',
    witness_title: 'Zeuge',
    witness_desc: 'Präzise Überprüfung — begrenzt verfügbar.',
    confront_title: 'Lüge',
    confront_desc: 'Direkte Konfrontation. Riskant.',
  },

  pressure: {
    label: '⏳ Verbleibende Züge:',
    warn: '⚠ FAST AM ENDE!',
    val: '{left} / {max}',
  },

  rules: {
    title: 'Spielanleitung',
    p1: 'Jedes Spiel ist ein neues Verbrechen. Einer von sechs Verdächtigen ist der Mörder. Unter den Unschuldigen gibt es absichtliche "Heringe". Paare mit gleichen Initialen sollen verwirren.',
    p2: '🔍 <b>Hinweis</b> — physische Beweise. Manchmal mit Gegenstand.',
    p3: '🗣️ <b>Verhör</b> — Alibi, Verbindung, Motiv ermitteln.',
    p4: '🕰️ <b>Alibi</b> — schnelle, unsichere Prüfung.',
    p5: '👁️ <b>Zeuge</b> — einzige Möglichkeit zur genauen Überprüfung.',
    p6: '⚖️ <b>Lüge</b> — direkte Konfrontation. Riskant.',
    p7: '🎒 <b>Inventar</b> — gefundene Gegenstände jederzeit verwenden.',
    p8: '⏳ <b>Zugbegrenzung</b> — bei Ablauf wird der Fall automatisch gelöst.',
  },

  data: {
    locations: [
      {nom:'Bibliothek',       prep:'der Bibliothek',       col:0,row:0},
      {nom:'Arbeitszimmer',    prep:'dem Arbeitszimmer',    col:1,row:0},
      {nom:'Musiksalon',       prep:'dem Musiksalon',       col:2,row:0},
      {nom:'Gästezimmer',      prep:'dem Gästezimmer',      col:3,row:0},
      {nom:'Orangerie',        prep:'der Orangerie',        col:0,row:1},
      {nom:'Weinkeller',       prep:'dem Weinkeller',       col:1,row:1},
      {nom:'Billardzimmer',    prep:'dem Billardzimmer',    col:2,row:1},
      {nom:'Rosengarten',      prep:'dem Rosengarten',      col:3,row:1},
    ],
    motives: ['Eifersucht','hohe Schulden','geheimes Erbe','alte Rache','Angst vor Enthüllung','Erpressung','verletzte Ehre'],
    relations: ['Geschäftspartner des Opfers','entfernter Verwandter des Opfers','persönlicher Sekretär des Opfers','Gärtner des Anwesens','Vertrauter des Opfers','langjähriger Rivale des Opfers','Erbe des Vermögens','Vertrauensbutler'],
    victims: ['Lord William Ashton-Carr','Millionär Charles Whitmore','Primadonna Bianca Rossetti','Sammler Arthur Pembrook','Madame Eloise Devereaux','Professor Johann Bergmann','Bankier Sebastian Cross','Schauspielerin Camilla Lavelle'],
    weapons: [
      {nom:'Briefmesser',        instr:'mit einem Briefmesser'},
      {nom:'seltenes Gift',      instr:'mit einem seltenen Gift'},
      {nom:'bronzener Leuchter', instr:'mit einem bronzenen Leuchter'},
      {nom:'Seidenschnur',       instr:'mit einer Seidenschnur'},
      {nom:'antiker Revolver',   instr:'mit einem antiken Revolver'},
    ],
    witnessNames: ['Butler Alfred','Dienstmädchen Betty','Gärtner Joseph','Kutscher Thomas','Köchin Margaret','Lakai Simon','Gesellschafterin Mrs. Hudson','Chefstallmeister Patrick'],
  },

  msg: {
    game_start: '<b>[{difficulty}]</b> Um <b>{time}</b> wurde eine Leiche in {location} gefunden. Opfer — <b>{victim}</b>. Tatwaffe — <b>{weapon}</b>. Sie haben <b>{turns} Züge</b>. Vorgehen.',
    briefing:   '<b>[{difficulty}]</b> Opfer — <b>{victim}</b>. Ort: <b>{location}</b>, Zeit — <b>{time}</b>, Waffe — <b>{weapon}</b>.',

    ev_crit_handkerchief: 'Ein Taschentuch mit den Initialen „{initials}" wurde nahe dem Tatort gefunden.{ambiguity}',
    ev_crit_handkerchief_ambiguity: ' Leider teilen zwei Personen im Haus diese Initialen — das beweist allein nichts.',
    ev_crit_silhouette: 'Ein Zeuge erinnert sich an eine Silhouette, die {name} ähnelt, kurz vor {time} am Tatort.',
    ev_crit_letter: 'Die Handschrift auf einem verbrannten Brief ähnelt auffallend der von {name}.',
    ev_crit_item: 'Ein Gegenstand, der dem Opfer gehörte, wurde unter {name}s Sachen gefunden.',
    ev_herring_papers: 'Harte Worte über das Opfer wurden in {name}s Papieren gefunden — verdächtig, aber kein direkter Bezug.',
    ev_herring_nervous: 'Das Personal berichtet, {name} sei in letzter Zeit sehr {was_nervous} — der Grund könnte unrelated sein.',
    ev_innocent_witnesses: 'Mehrere Zeugen bestätigen, {name} {was} zur Tatzeit woanders.',
    ev_innocent_belongings: '{name}s Sachen wurden genau dort gefunden, wo {he} sie angegeben hatte.',
    ev_innocent_staff: 'Das Personal bestätigt {name}s Aussage — keine Unstimmigkeiten.',
    ev_storm_suffix: ' <i>(das Unwetter erschwert die Suche — schwache Spur)</i>',
    ev_log: '🔍 <b>Hinweis — {name}:</b> {text}',

    int_lawyer: '🗣️ <b>Verhör — {name}:</b> „Auf Anraten meines Anwalts verweigere ich die Aussage", sagt {name} kalt.',
    int_where_nervous: 'Auf die Frage „Wo waren Sie?" antwortet {name}: „Ich {was} um {claimed_time} in {claimed_loc}." Die Stimme zittert leicht.',
    int_where_calm: 'Auf die Frage „Wo waren Sie?" antwortet {name}: „Ich {was} um {claimed_time} in {claimed_loc}." Ruhig und sicher.',
    int_relation: 'Auf die Frage nach der Beziehung zum Opfer gibt {name} zu: „Ich bin {relation}."',
    int_motive_yes: '{name} blickt weg, wenn das Opfer erwähnt wird. Mögliches Motiv: <b>{motive}</b>.',
    int_motive_no: '{name} zuckt die Schultern: „Wir hatten kaum Kontakt." Kein offensichtliches Motiv.',
    int_tired: '{name} antwortet gereizt: „Ich habe der Ermittlung bereits alles gesagt."',
    int_tired_f_suffix: '',
    int_tired_m_suffix: '',
    int_near_crime: ' Laut Grundriss liegt {loc} nahe am Tatort — {name} hätte es schnell erreichen können.',
    int_far_crime: ' Laut Grundriss liegt {loc} weit vom Tatort — unbemerkt dorthin zu gelangen wäre schwer gewesen.',
    int_log: '🗣️ <b>Verhör — {name}:</b> {text}',

    alibi_no_claimed: '🕰️ Verhören Sie {name} zuerst — noch nichts zu prüfen.',
    alibi_inconclusive: '🕰️ <b>Schnellprüfung — {name}:</b> widersprüchliche Aussagen, nichts Eindeutiges.',
    alibi_suspicious: '🕰️ <b>Schnellprüfung — {name}:</b> etwas stimmt nicht... möglicherweise lügend. Nur eine Ahnung.',
    alibi_clean: '🕰️ <b>Schnellprüfung — {name}:</b> Alibi wirkt glaubwürdig. Nicht sicher.',

    witness_no_claimed: '👁️ Verhören Sie {name} zuerst — Sie müssen wissen, was zu prüfen ist.',
    witness_already_done: '👁️ {name}s Alibi wurde bereits verifiziert.',
    witness_pool_empty: '👁️ Alle Zeugen wurden befragt — niemand erinnert sich an mehr.',
    witness_confused: '👁️ Der Zeuge hat etwas gesehen, erinnert sich aber nicht genau — nutzlos.',
    witness_confused_far: '👁️ Der Zeuge erinnert sich nicht genau. Dieses Zimmer lag weit vom Geschehen.',
    witness_confirmed: '👁️ <b>{witness}</b> bestätigt, {name} um {claimed_time} in {claimed_loc} gesehen zu haben. Alibi <b>eindeutig bestätigt</b>.',
    witness_broken: '👁️ <b>{witness}</b> besteht darauf, {name} um {true_time} in {true_loc} gesehen zu haben — widerspricht der Aussage! Alibi <b>eindeutig widerlegt</b>.',

    confront_no_claimed: '⚖️ Sie haben noch nichts, womit Sie {name} konfrontieren könnten — verhören Sie zuerst.',
    confront_already: '⚖️ Sie haben {name} bereits konfrontiert.',
    confront_guilty: '⚖️ Sie beschuldigen {name} direkt der Lüge. {He} {pale} und {confused} in der Aussage — ein klares Schuldzeichen!',
    confront_innocent: '⚖️ Sie beschuldigen {name} der Lüge, aber die Anklage bricht zusammen — Zeugen stützen {his} Aussage. Ihr Ruf leidet.',

    event_storm: 'Ein plötzlicher Sturm hat {location} vom Rest des Hauses abgeschnitten. Beweise sind dort schwerer zu finden.',
    event_lawyer: '{name} hat einen Anwalt engagiert. Weitere Verhöre werden auf Schweigen stoßen.',
    event_lawyer_f_suffix: '',
    event_lawyer_m_suffix: '',
    event_rumors: 'Gerüchte und Klatsch verbreiten sich — das Verdachtsniveau ist durcheinandergebracht.',
    event_press: 'Journalisten haben vom Fall Wind bekommen. Ihre Vorgesetzten sind mit dem Tempo unzufrieden.',
    event_new_witness: 'Eine weitere Person ist bereit, zu berichten, was sie in jener Nacht gesehen hat.',
    event_chaos: 'Im Haus bricht Tumult aus — eine Ihrer Karten wurde unbrauchbar und ging verloren.',
    event_prefix: '‼️ EREIGNIS:',

    item_found: '🎒 <b>Gegenstand gefunden:</b> {icon} <b>{name}</b> — ins Inventar gelegt.',
    item_letter_name: 'Alter Brief',
    item_letter_desc: 'Ein zerknitterter Brief mit belastendem Inhalt. Enthüllt sofort das Motiv des gewählten Verdächtigen.',
    item_letter_motive_yes: '📜 <b>Alter Brief:</b> der Text zeigt deutlich ein Motiv — <b>{motive}</b>. {Name} verstummt.',
    item_letter_motive_no: '📜 <b>Alter Brief:</b> an {name} adressiert, aber persönlicher Natur — kein Bezug zum Verbrechen. Weniger Verdacht.',
    item_key_name: 'Antiker Schlüssel',
    item_key_desc: 'Ein Zimmerschlüssel. Hebt eine Sturmblockade auf — oder öffnet einen versteckten Safe.',
    item_key_storm: '🗝️ <b>Antiker Schlüssel:</b> Zugang zu {location} freigegeben — der Sturm blockiert es nicht mehr.',
    item_key_guilty: '🗝️ <b>Antiker Schlüssel:</b> ein versteckter Safe in {name}s Zimmer wurde geöffnet. Darin — Dokumente, die das Alibi in Frage stellen.',
    item_key_innocent: '🗝️ <b>Antiker Schlüssel:</b> im Safe befinden sich nur persönliche Papiere — nichts Kriminelles.',
    item_glove_name: 'Blutiger Handschuh',
    item_glove_desc: 'Ein Handschuh mit Spuren. Erhöht den Verdacht auf das Ziel stark, senkt ihn bei allen anderen.',
    item_glove_log: '🧤 <b>Blutiger Handschuh:</b> nahe {name}s Sachen gefunden. Alle Blicke richten sich auf {him}.',
    item_photo_name: 'Abendphotographie',
    item_photo_desc: 'Ein Foto vom Tatortabend. Wirkt wie ein kostenloser Zeugeneinsatz.',
    item_photo_no_claimed: '📸 <b>Photographie:</b> erfahren Sie zuerst {name}s Alibi — nichts zu vergleichen.',
    item_photo_already: '📸 <b>Photographie:</b> {name}s Alibi wurde bereits auf anderem Wege geprüft.',
    item_photo_confirmed: '📸 <b>Photographie:</b> {name} ist deutlich in {claimed_loc} um {claimed_time} zu sehen. Alibi <b>durch Foto bestätigt</b>.',
    item_photo_broken: '📸 <b>Photographie:</b> {name} erscheint in {true_loc} um {true_time} — widerspricht der Aussage! Alibi <b>widerlegt</b>.',

    timeout: '⏳ ZEIT ABGELAUFEN! Der Fall wird nach aktuellem Verdachtsstand gelöst...',

    result_win_title: '🎉 Fall gelöst',
    result_win_correct: 'Sie haben <b>{name}</b> beschuldigt — korrekt!',
    result_win_grade_witness: 'Makellos! Ein Zeuge überführte den Täter der Lüge — wasserdichte Beweise.',
    result_win_grade_confront: 'Fall unter Druck gelöst — die direkte Konfrontation funktionierte.',
    result_win_grade_auto: 'Zeit abgelaufen — der Fall schloss sich automatisch. Glück gehabt!',
    result_win_grade_default: 'Auf Basis kumulierter Verdachtsmomente gelöst — guter Instinkt.',
    result_lose_title: '❌ Falsche Beschuldigung',
    result_lose_body: 'Sie haben <b>{name}</b> beschuldigt — die falsche Person.',
    result_lose_herring: 'Der wahre Täter {hidden}, während Sie einer falschen Spur folgten.',
    result_lose_other: 'Der wahre Täter {hidden}, während Sie den falschen Weg gingen.',
    result_lose_auto: 'Zeit abgelaufen — der Verdächtigste wurde automatisch gewählt, war aber nicht der Mörder.',
    result_reveal: 'Opfer — <b>{victim}</b>. Ort: {location}, {time}; Waffe — {weapon}. Der wahre Mörder war <b>{criminal}</b> (Motiv: {motive}).',
    result_reveal_no_motive: 'Opfer — <b>{victim}</b>. Ort: {location}, {time}; Waffe — {weapon}. Der wahre Mörder war <b>{criminal}</b>.',
  },
},

}; // end I18N

/* ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---------- */
function t(lang, key, vars){
  const parts = key.split('.');
  let node = I18N[lang];
  for(const p of parts){
    if(!node) return key;
    node = node[p];
  }
  if(typeof node !== 'string') return key;
  if(!vars) return node;
  return node.replace(/\{(\w+)\}/g, (_,k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));
}

function gv(lang, suspect){
  return GENDER_VARS[lang]?.[suspect.g] || GENDER_VARS.en.м;
}

/* ---------- beta 5.0 additions ---------- */
I18N.ru.ui.save_continue='Продолжить дело';I18N.ru.ui.save_new='Новое дело';I18N.ru.ui.save_title='📂 Найдено незакрытое дело';I18N.ru.ui.save_body='Хотите продолжить расследование или начать новое?';I18N.ru.ui.tab_suspects='Подозреваемые';I18N.ru.ui.tab_log='Журнал';I18N.ru.ui.tab_items='Предметы';I18N.ru.ui.inventory_hint='Предметы попадаются с уликами. Нажмите, чтобы применить.';
I18N.en.ui.save_continue='Continue Case';I18N.en.ui.save_new='New Case';I18N.en.ui.save_title='📂 Unsolved Case Found';I18N.en.ui.save_body='Continue the investigation or start a new case?';I18N.en.ui.tab_suspects='Suspects';I18N.en.ui.tab_log='Log';I18N.en.ui.tab_items='Items';I18N.en.ui.inventory_hint='Items appear when searching for clues. Tap to use.';
I18N.de.ui.save_continue='Fall fortsetzen';I18N.de.ui.save_new='Neuer Fall';I18N.de.ui.save_title='📂 Offener Fall gefunden';I18N.de.ui.save_body='Ermittlung fortsetzen oder neuen Fall beginnen?';I18N.de.ui.tab_suspects='Verdächtige';I18N.de.ui.tab_log='Protokoll';I18N.de.ui.tab_items='Gegenstände';I18N.de.ui.inventory_hint='Gegenstände erscheinen beim Suchen nach Hinweisen. Tippen zum Verwenden.';

/* ================================================================
   beta 6.0 — новые строки
   ================================================================ */

// ---- РУССКИЙ ----
Object.assign(I18N.ru.ui, {
  // Стартовое меню
  menu_start:      'Начать расследование',
  menu_profile:    'Профиль детектива',
  menu_archive:    'Архив дел',
  menu_subtitle:   'Бюро тайных расследований',
  // Профиль
  profile_title:   'Профиль детектива',
  profile_name_label: 'Имя детектива',
  profile_name_placeholder: 'Введите имя...',
  profile_save:    'Сохранить',
  profile_rank:    'Звание',
  profile_points:  'Очки',
  profile_solved:  'Дел раскрыто',
  profile_failed:  'Дел провалено',
  profile_streak:  'Лучшая серия',
  // Архив
  archive_title:   'Архив дел',
  archive_empty:   'Архив пуст — раскройте первое дело.',
  archive_solved:  'Раскрыто',
  archive_failed:  'Провалено',
  archive_cards:   'карт сыграно',
  // Связи
  rel_loves:       '{a} тайно влюблён(а) в {b}',
  rel_debt:        '{a} задолжал(а) крупную сумму жертве',
  rel_rivals:      '{a} и {b} — давние соперники',
  rel_friends:     '{a} и {b} — близкие друзья',
  rel_secret:      '{a} знает компрометирующий секрет {b}',
  rel_chip_loves:  '❤️ влюблён(а) в {b}',
  rel_chip_debt:   '💰 должник жертвы',
  rel_chip_rivals: '⚔️ соперник(ца) {b}',
  rel_chip_friends:'🤝 друг {b}',
  rel_chip_secret: '🤫 знает секрет {b}',
  // Ранги
  rank_0: 'Стажёр', rank_1: 'Детектив', rank_2: 'Инспектор', rank_3: 'Комиссар', rank_4: 'Легенда',
});
// предыстории жертв (ru) — индекс соответствует VICTIMS массиву
I18N.ru.victimBios = [
  'Лорд Эштон-Кэрр слыл человеком холодным и расчётливым — его состояние нажито на сомнительных сделках. Многие в доме его боялись, немногие — уважали.',
  'Чарльз Уитмор сделал своё состояние на банковских спекуляциях. Говорят, за каждым его успехом стоит чья-то разрушенная жизнь.',
  'Бьянка Россетти блистала на сценах всей Европы. За улыбкой примадонны скрывались жёсткие требования и острый язык.',
  'Артур Пембрук собирал редкости со всего света — и людей, и предметы. Его коллекция стоила целое состояние, а методы приобретения вызывали споры.',
  'Мадам Деверо была вдовой трижды — и каждый раз выходила из трагедии богаче. Её обаянию мало кто мог противостоять.',
  'Профессор Бергман знал слишком много о слишком многих. Его исследования задевали интересы людей влиятельных и беспощадных.',
  'Себастьян Кросс держал в руках долги половины города. Он улыбался всем одинаково — и должникам, и кредиторам.',
  'Камилла Лавэлль играла роли на сцене и за её пределами. Никто не знал, где заканчивался образ и начиналась она сама.',
];

// ---- ENGLISH ----
Object.assign(I18N.en.ui, {
  menu_start:      'Begin Investigation',
  menu_profile:    'Detective Profile',
  menu_archive:    'Case Archive',
  menu_subtitle:   'Bureau of Secret Investigations',
  profile_title:   'Detective Profile',
  profile_name_label: 'Detective Name',
  profile_name_placeholder: 'Enter name...',
  profile_save:    'Save',
  profile_rank:    'Rank',
  profile_points:  'Points',
  profile_solved:  'Cases Solved',
  profile_failed:  'Cases Failed',
  profile_streak:  'Best Streak',
  archive_title:   'Case Archive',
  archive_empty:   'Archive is empty — solve your first case.',
  archive_solved:  'Solved',
  archive_failed:  'Failed',
  archive_cards:   'cards played',
  rel_loves:       '{a} is secretly in love with {b}',
  rel_debt:        '{a} owed a large sum to the victim',
  rel_rivals:      '{a} and {b} are long-time rivals',
  rel_friends:     '{a} and {b} are close friends',
  rel_secret:      '{a} knows a compromising secret about {b}',
  rel_chip_loves:  '❤️ in love with {b}',
  rel_chip_debt:   '💰 debtor of victim',
  rel_chip_rivals: '⚔️ rivals with {b}',
  rel_chip_friends:'🤝 friends with {b}',
  rel_chip_secret: '🤫 knows {b}\'s secret',
  rank_0: 'Trainee', rank_1: 'Detective', rank_2: 'Inspector', rank_3: 'Commissioner', rank_4: 'Legend',
});
I18N.en.victimBios = [
  'Lord Ashton-Carr was known as a cold and calculating man — his fortune built on questionable dealings. Many in the house feared him; few respected him.',
  'Charles Whitmore made his fortune through banking speculation. They say every success of his came at the cost of someone else\'s ruin.',
  'Bianca Rossetti dazzled on stages across Europe. Behind the prima donna\'s smile lay exacting demands and a razor-sharp tongue.',
  'Arthur Pembrook collected rarities from around the world — people and objects alike. His collection was worth a fortune; his methods of acquisition were disputed.',
  'Madame Devereaux had been widowed three times — and each time emerged from tragedy wealthier. Few could resist her charm.',
  'Professor Bergmann knew too much about too many people. His research touched the interests of powerful and merciless individuals.',
  'Sebastian Cross held the debts of half the city in his hands. He smiled equally at debtors and creditors alike.',
  'Camilla Lavelle played roles on stage and off it. No one knew where the character ended and she began.',
];

// ---- DEUTSCH ----
Object.assign(I18N.de.ui, {
  menu_start:      'Ermittlung beginnen',
  menu_profile:    'Detektivprofil',
  menu_archive:    'Fallarchiv',
  menu_subtitle:   'Büro für geheime Ermittlungen',
  profile_title:   'Detektivprofil',
  profile_name_label: 'Name des Detektivs',
  profile_name_placeholder: 'Name eingeben...',
  profile_save:    'Speichern',
  profile_rank:    'Rang',
  profile_points:  'Punkte',
  profile_solved:  'Gelöste Fälle',
  profile_failed:  'Gescheiterte Fälle',
  profile_streak:  'Beste Serie',
  archive_title:   'Fallarchiv',
  archive_empty:   'Archiv leer — lösen Sie Ihren ersten Fall.',
  archive_solved:  'Gelöst',
  archive_failed:  'Gescheitert',
  archive_cards:   'Karten gespielt',
  rel_loves:       '{a} ist heimlich in {b} verliebt',
  rel_debt:        '{a} schuldete dem Opfer eine große Summe',
  rel_rivals:      '{a} und {b} sind langjährige Rivalen',
  rel_friends:     '{a} und {b} sind enge Freunde',
  rel_secret:      '{a} kennt ein kompromittierendes Geheimnis über {b}',
  rel_chip_loves:  '❤️ verliebt in {b}',
  rel_chip_debt:   '💰 Schuldner des Opfers',
  rel_chip_rivals: '⚔️ Rivale von {b}',
  rel_chip_friends:'🤝 Freund von {b}',
  rel_chip_secret: '🤫 kennt {b}s Geheimnis',
  rank_0: 'Anwärter', rank_1: 'Detektiv', rank_2: 'Inspektor', rank_3: 'Kommissar', rank_4: 'Legende',
});
I18N.de.victimBios = [
  'Lord Ashton-Carr galt als kalt und berechnend — sein Vermögen durch fragwürdige Geschäfte erworben. Viele im Haus fürchteten ihn; wenige respektierten ihn.',
  'Charles Whitmore machte sein Vermögen durch Bankspekulationen. Man sagt, hinter jedem Erfolg stand jemandes Ruin.',
  'Bianca Rossetti begeisterte Bühnen ganz Europas. Hinter dem Lächeln der Primadonna verbargen sich harte Forderungen und eine scharfe Zunge.',
  'Arthur Pembrook sammelte Raritäten aus aller Welt — Menschen und Gegenstände gleichermaßen. Seine Sammlung war ein Vermögen wert; seine Methoden umstritten.',
  'Madame Devereaux war dreimal Witwe — und jedes Mal kam sie reicher aus der Tragödie hervor. Ihrem Charme konnten nur wenige widerstehen.',
  'Professor Bergmann wusste zu viel über zu viele Menschen. Seine Forschungen berührten die Interessen mächtiger und gnadenloser Personen.',
  'Sebastian Cross hielt die Schulden halber Stadt in seinen Händen. Er lächelte Schuldner und Gläubiger gleich an.',
  'Camilla Lavelle spielte Rollen auf der Bühne und dahinter. Niemand wusste, wo die Figur endete und sie selbst begann.',
];

/* beta 6.0 — settings strings */
I18N.ru.ui.menu_settings   = 'Настройки';
I18N.ru.ui.settings_title  = 'Настройки';
I18N.ru.ui.settings_wip    = '🔧 Этот раздел находится в разработке.\nСледите за обновлениями!';
I18N.ru.ui.settings_close  = 'Понятно';
I18N.ru.ui.lang_change     = 'Сменить язык';

I18N.en.ui.menu_settings   = 'Settings';
I18N.en.ui.settings_title  = 'Settings';
I18N.en.ui.settings_wip    = '🔧 This section is under development.\nStay tuned for updates!';
I18N.en.ui.settings_close  = 'Got it';
I18N.en.ui.lang_change     = 'Change Language';

I18N.de.ui.menu_settings   = 'Einstellungen';
I18N.de.ui.settings_title  = 'Einstellungen';
I18N.de.ui.settings_wip    = '🔧 Dieser Bereich ist in Entwicklung.\nBleiben Sie dran!';
I18N.de.ui.settings_close  = 'Verstanden';
I18N.de.ui.lang_change     = 'Sprache ändern';
