/**
 * Seed.gs: one-time starter word lists for the Night Autopilot.
 * Run seedWordLists() once. It appends to AP_FeaturedQueue (189 high-value words for the
 * homepage's 5 words a day) and AP_Queue (663 words for the nightly vault), skipping words already
 * there. Add your own words to those tabs any time; this list is only a starting point.
 */
const SEED_FEATURED = ['abate','aberrant','abstain','abstruse','acerbic','acquiesce','admonish','adulation','aesthetic','alacrity','alleviate','ambivalent','ameliorate','amenable','anomaly','antipathy','apathy','appease','arbitrary','arcane','arduous','articulate','ascetic','assuage','audacious','austere','banal','belie','benevolent','bolster','bombastic','burgeon','cacophony','capricious','castigate','caustic','censure','chicanery','circumspect','cogent','complacent','conciliatory','condone','conundrum','convoluted','corroborate','credulous','cursory','dearth','deference','deleterious','denigrate','deride','desultory','diatribe','didactic','diffident','digress','diligent','disparage','disparate','dissemble','dogmatic','dubious','eclectic','efficacy','egregious','elicit','eloquent','emulate','enervate','engender','enigmatic','equivocal','erudite','exacerbate','exculpate','exemplary','exonerate','expedient','extol','facetious','fastidious','fervent','flout','foster','frugal','garrulous','gregarious','hackneyed','hegemony','heterogeneous','hyperbole','iconoclast','idiosyncratic','impetuous','implacable','incisive','incongruous','indolent','ineffable','inexorable','ingenuous','inimical','innocuous','insipid','intransigent','inundate','irascible','laconic','laud','lethargic','loquacious','magnanimous','malleable','maverick','mendacious','meticulous','mitigate','mollify','mundane','naive','nebulous','negate','obdurate','obsequious','obstinate','obviate','officious','onerous','opaque','opulent','ostentatious','paradigm','paradox','paucity','pedantic','penchant','perfunctory','pernicious','placate','plausible','plethora','precarious','precipitate','prevaricate','pristine','prodigal','profound','proliferate','propensity','prosaic','quiescent','rancor','recalcitrant','reconcile','redundant','refute','relegate','replete','reprehensible','repudiate','rescind','resilient','reticent','reverent','sanction','scrutinize','soporific','sporadic','stigma','stoic','superfluous','surreptitious','tenacious','tenuous','torpor','tractable','transient','trite','undermine','unprecedented','venerate','verbose','vex','vindicate','volatile','wary','zealous'];
const SEED_VAULT = ['abdicate','aberration','abhor','abjure','abrasive','abscond','absolve','abstemious','abysmal','accolade','accrue','acquit','acrimony','acumen','adamant','adept','adhere','admonition','adroit','adulterate','adversary','adverse','advocate','affable','affinity','affluent','aggrandize','aggregate','agile','agitate','alienate','allay','allege','allude','aloof','altruism','amalgamate','ambiguous','amiable','amorphous','anachronism','analogous','anarchy','anathema','anecdote','animosity','annex','annul','antagonism','antecedent','antiquated','apex','aplomb','apocryphal','apprehensive','approbation','appropriate','arbiter','archaic','ardent','aristocracy','arrogate','ascendancy','ascertain','aspersion','assiduous','astute','asylum','atrophy','attenuate','augment','auspicious','autonomy','avarice','aver','aversion','avid','axiom','baleful','bane','bastion','beguile','behemoth','belligerent','benign','berate','bereft','beseech','bigot','blandishment','blatant','bliss','blithe','boisterous','bourgeois','brazen','brevity','bucolic','bureaucracy','burnish','buttress','cajole','callous','camaraderie','candor','canon','capitulate','captivate','cartography','catalyst','catharsis','cavil','censor','cerebral','chagrin','charlatan','chastise','chronic','circuitous','clandestine','clemency','coalesce','coerce','cognizant','coherent','collaborate','colloquial','collusion','commensurate','compelling','compendium','complement','compliant','comprehensive','compunction','concede','concise','concomitant','concur','condescend','conduit','confound','congenial','conjecture','connoisseur','consensus','consolidate','conspicuous','construe','contemporary','contend','contentious','contingent','contrite','conventional','converge','conviction','copious','cordial','corpulent','cosmopolitan','countenance','covert','covet','credence','criterion','culminate','culpable','cumbersome','cynical','daunt','debacle','debilitate','decorum','decry','deduce','defer','deft','defunct','delineate','delude','demagogue','demeanor','demur','denounce','deplete','deplore','deprecate','derivative','despondent','destitute','deter','detrimental','deviate','dexterous','diaphanous','dichotomy','diffuse','dilatory','dilemma','diminutive','discern','discord','discredit','discreet','discrepancy','discrete','disdain','disinterested','dismal','dispassionate','disseminate','dissent','dissonance','distend','divergent','divulge','docile','doctrine','dormant','dour','duplicity','duress','ebullient','eccentric','eclipse','edify','efface','effervescent','effrontery','effusive','elated','elucidate','elusive','emanate','embellish','embroil','empathy','empirical','encumber','endemic','endorse','enhance','enmity','ensue','entice','entrenched','enumerate','epitome','equanimity','equitable','eradicate','errant','erratic','erroneous','espouse','estrange','euphemism','evanescent','evasive','evince','exalt','exasperate','excavate','exhaustive','exhort','exigent','exorbitant','expedite','explicit','exploit','expound','extant','extemporaneous','extraneous','extrapolate','exuberant','fabricate','facile','fallacy','fallible','fanatic','fatuous','feasible','feckless','fecund','feign','felicitous','ferment','fervor','fickle','fidelity','finesse','flagrant','fledgling','flippant','florid','fluctuate','forbearance','forestall','formidable','forthright','fortuitous','fractious','fragile','fraught','frivolous','furtive','futile','gainsay','galvanize','genial','germane','gratuitous','grievous','guile','gullible','hamper','haphazard','harangue','harbinger','haughty','heresy','hiatus','hierarchy','homogeneous','hubris','hypocrisy','hypothesis','immutable','impair','impartial','impasse','impeccable','impede','imperative','imperious','impertinent','impervious','implicate','implicit','impromptu','improvise','impudent','impunity','inadvertent','inane','incessant','inchoate','incipient','incite','inclination','incoherent','incorrigible','indifferent','indigenous','indignant','indiscriminate','indispensable','induce','indulgent','inept','inert','inevitable','infamous','infer','influx','infringe','ingenious','inherent','inhibit','innate','innovate','inquisitive','insatiable','insinuate','insolent','instigate','insular','insurgent','integral','integrity','intermittent','intractable','intrepid','intricate','intrinsic','intuitive','invective','inveterate','invoke','irreverent','itinerant','jargon','jeopardize','jovial','judicious','juxtapose','kindle','labyrinth','lament','languid','largesse','latent','lavish','legitimate','lenient','levity','liability','lofty','lucrative','ludicrous','lugubrious','luminous','magnate','malevolent','malign','mandate','manifest','marginal','meager','mediocre','melancholy','mercenary','mercurial','merit','metamorphosis','minute','misanthrope','miser','modicum','momentous','monotonous','morose','mutable','myriad','nascent','nefarious','negligent','nemesis','neophyte','nominal','nonchalant','notorious','novice','noxious','nuance','nullify','obscure','obsolete','obstruct','obtuse','ominous','omnipotent','onus','opportunist','ornate','orthodox','oscillate','ostracize','overt','pacify','palatable','palliate','palpable','panacea','paragon','paramount','parity','parochial','parody','partisan','patronize','peculiar','penitent','pensive','perceptive','peripheral','permeate','perpetual','perplex','persevere','pertinent','pervasive','petulant','philanthropy','pious','pithy','pivotal','placid','platitude','plight','poignant','polarize','ponderous','portent','potent','preclude','precocious','predecessor','predicament','predominant','preeminent','premise','premonition','prerequisite','prescient','presumptuous','pretentious','prevalent','probity','proclivity','procrastinate','prodigious','proficient','profuse','prohibit','prolific','prominent','propagate','propitious','proponent','prosperity','protract','provocative','prudent','pugnacious','punctilious','pungent','quandary','quell','querulous','quixotic','rampant','ramification','rapport','rational','raucous','rebuke','recant','reciprocal','reclusive','recondite','rectify','redress','refurbish','regress','reiterate','relinquish','remedial','remorse','renounce','repercussion','replenish','reprieve','reproach','repugnant','requisite','resolute','respite','restive','retract','revere','rhetoric','rigorous','robust','rudimentary','ruminate','sagacious','salient','sanguine','sardonic','scant','scathing','scrupulous','sedentary','semblance','serene','servile','skeptic','solace','solicitous','sordid','sparse','spontaneous','spurious','squander','stagnant','staunch','steadfast','stringent','stymie','subjugate','subordinate','subsequent','subside','subtle','succinct','succumb','supplant','suppress','susceptible','sycophant','synthesis','tacit','taciturn','tangential','tangible','tedious','temerity','temperate','tentative','terse','thwart','tirade','tolerant','toxic','tranquil','transgress','trepidation','trivial','truculent','turbulent','tyranny','unanimous','underscore','unequivocal','uniform','unilateral','unscrupulous','untenable','upbraid','usurp','utilitarian','vacillate','vacuous','validate','vapid','variegated','venal','venerable','veracity','verbatim','vestige','viable','vicarious','vigilant','vilify','vindictive','virtuoso','virulent','viscous','vitriolic','vivacious','volition','voracious','vulnerable','waver','whimsical','wily','wistful','yield','zenith'];

function seedWordLists() {
  const add = (name, words) => {
    const sh = ensureSheet_(name, ['word']);
    const have = new Set(sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().map(r => String(r[0]).toLowerCase()) : []);
    const fresh = words.filter(w => !have.has(w));
    if (fresh.length) sh.getRange(sh.getLastRow() + 1, 1, fresh.length, 1).setValues(fresh.map(w => [w]));
    return fresh.length;
  };
  const f = add(CONFIG.SHEETS.FEATURED_QUEUE, SEED_FEATURED);
  const v = add(CONFIG.SHEETS.QUEUE, SEED_VAULT);
  Logger.log('Added ' + f + ' featured words and ' + v + ' vault words.');
  return [f, v];
}

/**
 * Shuffles both word queues so each day's words come from different letters.
 * Safe to run any time (for example after pasting in a long alphabetical list).
 */
function shuffleQueues() {
  const out = [];
  [CONFIG.SHEETS.FEATURED_QUEUE, CONFIG.SHEETS.QUEUE].forEach(name => {
    const sh = sheet_(name);
    const n = sh.getLastRow() - 1;
    if (n < 2) return;
    const vals = sh.getRange(2, 1, n, 1).getValues();
    for (let i = vals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = vals[i]; vals[i] = vals[j]; vals[j] = t;
    }
    sh.getRange(2, 1, n, 1).setValues(vals);
    out.push(name + ': ' + n + ' words shuffled');
  });
  Logger.log(out.join(' · '));
  return out;
}

/**
 * Ranks every word in AP_Queue by how useful it is for GRE, GMAT, IELTS, TOEFL, SAT and PTE,
 * then re-sorts the queue: high → medium → low (shuffled within each group).
 * Words that aren't worth a page (proper nouns, typos, archaic or offensive words) move to AP_Skipped.
 * Needs GEMINI_API_KEY. Run it until the log says "Ranking complete" (each run handles ~5 minutes of work).
 */
function rankQueue() {
  const t0 = Date.now();
  const sh = sheet_(CONFIG.SHEETS.QUEUE);
  sh.getRange(1, 1, 1, 2).setValues([['word', 'priority']]);
  const n = sh.getLastRow() - 1;
  if (n < 1) return 'Queue is empty.';
  const vals = sh.getRange(2, 1, n, 2).getValues();
  const todo = [];
  vals.forEach((r, i) => { if (String(r[0]).trim() && !r[1]) todo.push(i); });
  const BATCH = 150;
  let ranked = 0;
  for (let b = 0; b < todo.length && Date.now() - t0 < 300000; b += BATCH) {
    const idx = todo.slice(b, b + BATCH);
    const words = idx.map(i => String(vals[i][0]).trim().toLowerCase());
    const r = gemini_(`Rate each word for students preparing for GRE, GMAT, IELTS, TOEFL, SAT and PTE.
"high": appears often in these exams or in academic reading/writing and is worth learning early.
"medium": useful academic vocabulary, less frequent in tests.
"low": real but rare or very specialised.
"skip": not worth a vocabulary page: proper noun, misspelling, not an English word, archaic, slang, or offensive.
Words: ${JSON.stringify(words)}
Return JSON {"ranks": {"<word>": "high" | "medium" | "low" | "skip"}} with every word.`, 0);
    const ranks = r.ranks || {};
    idx.forEach((i, k) => { vals[i][1] = ['high', 'medium', 'low', 'skip'].indexOf(ranks[words[k]]) >= 0 ? ranks[words[k]] : 'medium'; });
    sh.getRange(2, 1, n, 2).setValues(vals); // save progress after every batch
    ranked += idx.length;
  }
  const left = vals.filter(r => String(r[0]).trim() && !r[1]).length;
  if (left) { Logger.log('Ranked ' + ranked + ' this run; ' + left + ' left. Run rankQueue again.'); return left; }

  // All ranked: move skips out, then sort high → medium → low, shuffled within each group.
  const keep = { high: [], medium: [], low: [] }, skipped = [];
  const seen = new Set();
  vals.forEach(r => {
    const w = String(r[0]).trim().toLowerCase();
    if (!w || seen.has(w)) return;
    seen.add(w);
    if (r[1] === 'skip') skipped.push([w]); else (keep[r[1]] || keep.medium).push([w, r[1]]);
  });
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  const sorted = shuffle(keep.high).concat(shuffle(keep.medium), shuffle(keep.low));
  sh.getRange(2, 1, n, 2).clearContent();
  if (sorted.length) sh.getRange(2, 1, sorted.length, 2).setValues(sorted);
  if (skipped.length) {
    const sk = ensureSheet_('AP_Skipped', ['word']);
    sk.getRange(sk.getLastRow() + 1, 1, skipped.length, 1).setValues(skipped);
  }
  const msg = `Ranking complete: ${keep.high.length} high, ${keep.medium.length} medium, ${keep.low.length} low; ${skipped.length} moved to AP_Skipped; ${vals.length - seen.size} duplicates removed.`;
  Logger.log(msg);
  return msg;
}
