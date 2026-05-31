// Makej Worker — Profile

var DEMO_REVIEWS = [
  {
    id: 'demo-1',
    rating: 5,
    created_at: '2025-04-15T10:00:00Z',
    employer_name: 'Sklady Novák s.r.o.',
    job_title: 'Pomocník ve skladu',
    comment: 'Tomáš odvedl výbornou práci celou směnu. Přišel přesně, pracoval pečlivě a zvládl i fyzicky náročnější úkoly bez stížností. Rádi ho pozveme znovu!',
  },
  {
    id: 'demo-2',
    rating: 4,
    created_at: '2025-03-28T14:30:00Z',
    employer_name: 'EventPro Praha',
    job_title: 'Brigádník na festivalu',
    comment: 'Spolehlivý a ochotný, zvládl celou akci bez problémů. Malá připomínka — komunikaci s návštěvníky by mohl trochu víc rozvíjet a být proaktivnější, ale jinak výborně.',
  },
  {
    id: 'demo-3',
    rating: 3,
    created_at: '2025-02-10T09:00:00Z',
    employer_name: 'Restaurace U Tří hvězd',
    job_title: 'Výpomoc v kuchyni',
    comment: 'Základní práci zvládl, ale byl méně iniciativní, než jsme čekali. Taky přišel o deset minut pozdě a bylo potřeba mu vše vysvětlovat dvakrát. Příště doporučujeme přijít dřív a být aktivnější.',
  },
  {
    id: 'demo-4',
    rating: 5,
    created_at: '2025-01-20T08:00:00Z',
    employer_name: 'Stěhovací firma Movers',
    job_title: 'Pomocník při stěhování',
    comment: 'Absolutně top brigádník! Fyzicky zdatný, šikovný a skvělý parťák. Celé stěhování proběhlo hladce a on byl jedním z nejlepších pomocníků, co jsme kdy měli. Vřele doporučujeme!',
  },
  {
    id: 'demo-5',
    rating: 4,
    created_at: '2024-12-05T11:00:00Z',
    employer_name: 'Výstava Brno Expo',
    job_title: 'Promotér na výstavě',
    comment: 'Jako promotér odvedl solidní práci — byl přátelský a profesionální. Jen bychom příště doporučili méně koukat na telefon, zákazníci to občas vnímají negativně. Jinak spokojeni.',
  },
];

function WRatingPopup({ rating, onClose, onOpenChat }) {
  const [reviews,  setReviews]  = useStateW([]);
  const [loading,  setLoading]  = useStateW(true);

  useEffectW(() => {
    async function load() {
      try {
        const { data: { session } } = await sb.auth.getSession();
        if (!session) { setLoading(false); return; }
        const { data } = await sb.from('reviews')
          .select('*')
          .eq('reviewed_id', session.user.id)
          .order('created_at', { ascending: false });
        setReviews(data || []);
      } catch (e) {
        console.error('reviews fetch', e);
      }
      setLoading(false);
    }
    load();
  }, []);

  var isDemo = !loading && reviews.length === 0;
  var list   = isDemo ? DEMO_REVIEWS : reviews;

  var displayRating = isDemo
    ? (DEMO_REVIEWS.reduce(function(s, r) { return s + r.rating; }, 0) / DEMO_REVIEWS.length)
    : (rating || 0);

  var stars  = Math.round(displayRating);
  var filled = '★'.repeat(stars);
  var empty  = '☆'.repeat(5 - stars);

  function renderStars(n) {
    var r = Math.round(n || 0);
    return (
      <span>
        <span style={{ color: '#FFD132' }}>{'★'.repeat(r)}</span>
        <span style={{ color: 'rgba(255,210,50,0.25)' }}>{'★'.repeat(5 - r)}</span>
      </span>
    );
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}>
      <div
        onClick={function(e) { e.stopPropagation(); }}
        style={{
          width: '100%', maxWidth: 480,
          background: '#0e0e28', borderRadius: '20px 20px 0 0',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '0 0 36px',
          maxHeight: '93vh', display: 'flex', flexDirection: 'column',
          animation: 'wPop .25s cubic-bezier(.2,.8,.2,1)',
        }}>

        {/* Handle + header */}
        <div style={{ padding: '12px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', margin: '0 auto 16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: '#fff', fontFamily: T.fontHead, fontSize: 18, fontWeight: 800 }}>Moje hodnocení</div>
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 32, height: 32, color: T.muted, cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 14 }}>
              ✕
            </button>
          </div>
        </div>

        {/* Big rating summary */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ color: '#FFD132', fontFamily: T.fontHead, fontSize: 60, fontWeight: 900, lineHeight: 1 }}>
              {displayRating > 0 ? displayRating.toFixed(1) : '—'}
            </div>
            <div style={{ fontSize: 22, marginTop: 8, letterSpacing: 4 }}>
              <span style={{ color: '#FFD132' }}>{filled}</span>
              <span style={{ color: 'rgba(255,210,50,0.25)' }}>{empty}</span>
            </div>
          </div>
          <div>
            <div style={{ color: '#fff', fontFamily: T.fontUI, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              {list.length} hodnocení
            </div>
            <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 12, lineHeight: 1.5 }}>
              od zaměstnavatelů po brigádě
            </div>
            {isDemo ? (
              <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 5, background: 'rgba(255,193,50,0.1)', border: '1px solid rgba(255,193,50,0.25)' }}>
                <span style={{ color: '#FFD132', fontFamily: T.fontUI, fontSize: 10, fontWeight: 700 }}>ukázkový profil</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Review list */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '4px 20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: T.muted, fontFamily: T.fontUI, fontSize: 13 }}>
              Načítám…
            </div>
          ) : list.map(function(r, i) {
            var date = r.created_at ? new Date(r.created_at).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
            var empName   = r.employer_name || 'Zaměstnavatel';
            var jobTitle  = r.job_title || null;
            return (
              <div key={r.id || i} style={{ padding: '16px 0', borderBottom: i < list.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                {/* Top row: employer + stars */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontFamily: T.fontUI, fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{empName}</div>
                    {jobTitle ? (
                      <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 12 }}>{jobTitle}</div>
                    ) : null}
                  </div>
                  <div style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{renderStars(r.rating)}</div>
                </div>
                {/* Comment bubble */}
                {r.comment ? (
                  <div style={{
                    padding: '10px 13px', borderRadius: 10,
                    background: r.rating >= 4 ? 'rgba(91,214,138,0.06)' : r.rating === 3 ? 'rgba(255,165,0,0.06)' : 'rgba(244,63,94,0.06)',
                    border: '1px solid ' + (r.rating >= 4 ? 'rgba(91,214,138,0.14)' : r.rating === 3 ? 'rgba(255,165,0,0.14)' : 'rgba(244,63,94,0.14)'),
                    color: 'rgba(255,255,255,0.82)', fontFamily: T.fontUI, fontSize: 13.5, lineHeight: 1.7,
                    marginBottom: 6,
                  }}>
                    {r.comment}
                  </div>
                ) : null}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                  {date ? (
                    <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 10 }}>{date}</div>
                  ) : <div />}
                  {r.rating <= 3 ? (
                    <button
                      onClick={function() {
                        window._wChatOpen = {
                          threadId: r.match_id || null,
                          text: 'Dobrý den, mohu se zeptat, co přesně byla kritéria pro vaše hodnocení? Rád/a bych se dozvěděl/a více, abych mohl/a příště zapracovat. Děkuji.',
                        };
                        onClose();
                        if (onOpenChat) onOpenChat(r.match_id || null);
                      }}
                      style={{
                        padding: '5px 12px', borderRadius: 7,
                        background: 'rgba(91,107,255,0.15)',
                        border: '1px solid rgba(91,107,255,0.35)',
                        color: '#a0aaff', fontFamily: T.fontUI, fontSize: 11, fontWeight: 700,
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
                      }}>
                      <Icon name="chat-round-bold" size={11} color="#a0aaff" />
                      Reagovat
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Jobs popup ────────────────────────────────────────────────────

var DEMO_JOBS = {
  '2026-05': [
    { id: 'j1',  employer: 'Výstava Brno Expo',       job: 'Promotér na výstavě',       date: '2026-05-14', hours: 6,  pay: 1320, type: 'DPP' },
  ],
  '2026-04': [
    { id: 'j2',  employer: 'Sklady Novák s.r.o.',     job: 'Pomocník ve skladu',         date: '2026-04-03', hours: 24, pay: 4320, type: 'DPČ' },
    { id: 'j3',  employer: 'EventPro Praha',           job: 'Brigádník na festivalu',     date: '2026-04-07', hours: 8,  pay: 1760, type: 'DPP' },
    { id: 'j4',  employer: 'Restaurace U Tří hvězd',  job: 'Výpomoc v kuchyni',          date: '2026-04-10', hours: 6,  pay: 990,  type: 'DPP' },
    { id: 'j5',  employer: 'Stěhovací firma Movers',  job: 'Pomocník při stěhování',     date: '2026-04-15', hours: 10, pay: 2000, type: 'DPP' },
    { id: 'j6',  employer: 'Lidl Česká republika',    job: 'Výpomoc v prodejně',         date: '2026-04-19', hours: 16, pay: 2880, type: 'DPČ' },
    { id: 'j7',  employer: 'DHL Supply Chain',        job: 'Třídění zásilek',            date: '2026-04-23', hours: 12, pay: 2160, type: 'DPP' },
    { id: 'j8',  employer: 'Výstava Brno Expo',       job: 'Hosteska / Promotér',        date: '2026-04-27', hours: 7,  pay: 1540, type: 'DPP' },
  ],
  '2026-03': [
    { id: 'j9',  employer: 'Stěhovací firma Movers',  job: 'Pomocník při stěhování',     date: '2026-03-08', hours: 16, pay: 3200, type: 'DPP' },
    { id: 'j10', employer: 'Restaurace U Tří hvězd',  job: 'Výpomoc v kuchyni',          date: '2026-03-22', hours: 12, pay: 1980, type: 'DPP' },
  ],
  '2026-02': [
    { id: 'j11', employer: 'Sklady Novák s.r.o.',     job: 'Pomocník ve skladu',         date: '2026-02-10', hours: 40, pay: 7200, type: 'DPČ' },
  ],
  '2025-12': [
    { id: 'j12', employer: 'Výstava Brno Expo',       job: 'Promotér na veletrhu',       date: '2025-12-06', hours: 10, pay: 2200, type: 'DPP' },
    { id: 'j13', employer: 'Stěhovací firma Movers',  job: 'Pomocník při stěhování',     date: '2025-12-18', hours: 8,  pay: 1600, type: 'DPP' },
  ],
};

function WJobsPopup({ onClose }) {
  var now = new Date();
  var [selYear,  setSelYear]  = useStateW(now.getFullYear());
  var [selMonth, setSelMonth] = useStateW(now.getMonth());
  var selectedRef = useRefW(null);

  useEffectW(function() {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }, [selYear, selMonth]);

  var key      = selYear + '-' + String(selMonth + 1).padStart(2, '0');
  var entries  = DEMO_JOBS[key] || [];
  var totalPay = entries.reduce(function(s, e) { return s + e.pay; }, 0);

  function plural(n) {
    if (n === 1) return 'brigáda';
    if (n < 5)  return 'brigády';
    return 'brigád';
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div
        onClick={function(e) { e.stopPropagation(); }}
        style={{
          width: '100%', maxWidth: 480,
          background: '#0e0e28', borderRadius: '20px 20px 0 0',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '0 0 36px',
          maxHeight: '93vh', display: 'flex', flexDirection: 'column',
          animation: 'wPop .25s cubic-bezier(.2,.8,.2,1)',
        }}>

        {/* Handle + header */}
        <div style={{ padding: '12px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', margin: '0 auto 16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: '#fff', fontFamily: T.fontHead, fontSize: 18, fontWeight: 800 }}>Moje brigády</div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 32, height: 32, color: T.muted, cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 14 }}>✕</button>
          </div>
        </div>

        {/* Month pills — horizontal scroll */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          overflowX: 'auto', padding: '12px 20px',
          flexShrink: 0, scrollbarWidth: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {MONTH_ITEMS.map(function(item) {
            if (item.type === 'year') {
              return (
                <div key={'yr-' + item.label} style={{
                  flexShrink: 0, padding: '5px 11px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: T.muted, fontFamily: T.fontUI, fontSize: 11, fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>{item.label}</div>
              );
            }
            var isActive = item.year === selYear && item.month === selMonth;
            return (
              <button
                key={item.key}
                ref={isActive ? selectedRef : null}
                onClick={function() { setSelYear(item.year); setSelMonth(item.month); }}
                style={{
                  flexShrink: 0, padding: '7px 16px', borderRadius: 999,
                  background: isActive ? 'rgba(138,180,255,0.25)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid ' + (isActive ? 'rgba(138,180,255,0.6)' : 'rgba(255,255,255,0.09)'),
                  color: isActive ? '#fff' : T.muted,
                  fontFamily: T.fontUI, fontSize: 13, fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
                }}>
                {CS_MONTHS_SHORT[item.month]}
              </button>
            );
          })}
        </div>

        {/* Summary bar */}
        {entries.length > 0 ? (
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(138,180,255,0.12)', border: '1px solid rgba(138,180,255,0.22)', display: 'grid', placeItems: 'center' }}>
                <Icon name="case-round-bold" size={18} color="#8AB4FF" />
              </div>
              <div>
                <div style={{ color: '#fff', fontFamily: T.fontHead, fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{entries.length}</div>
                <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>{plural(entries.length)}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#F4A261', fontFamily: T.fontHead, fontSize: 18, fontWeight: 800 }}>{totalPay.toLocaleString('cs-CZ')} Kč</div>
              <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>vydělal/a</div>
            </div>
          </div>
        ) : null}

        {/* Entry list */}
        <div style={{ overflowY: 'auto', flex: '0 1 auto', padding: '8px 20px' }}>
          {entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>💼</div>
              <div style={{ color: '#fff', fontFamily: T.fontHead, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Žádné brigády</div>
              <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 12, lineHeight: 1.5 }}>V tomto měsíci nemáš žádné odpracované brigády.</div>
            </div>
          ) : entries.map(function(e, i) {
            var date = new Date(e.date).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' });
            var isDPC     = e.type === 'DPČ';
            var typeColor  = isDPC ? '#5BD68A' : '#8AB4FF';
            var typeBg     = isDPC ? 'rgba(91,214,138,0.12)'  : 'rgba(138,180,255,0.12)';
            var typeBorder = isDPC ? 'rgba(91,214,138,0.3)'   : 'rgba(138,180,255,0.3)';
            return (
              <div key={e.id || i} style={{ padding: '14px 0', borderBottom: i < entries.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  {/* Icon */}
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(138,180,255,0.09)', border: '1px solid rgba(138,180,255,0.18)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon name="case-round-bold" size={19} color="#8AB4FF" />
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontFamily: T.fontUI, fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{e.employer}</div>
                    <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 12, marginBottom: 7 }}>{e.job}</div>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: T.muted, fontFamily: T.fontUI, fontSize: 11 }}>
                        <Icon name="calendar-bold" size={11} color={T.muted} />
                        {date}
                      </div>
                      <span style={{ color: T.muted, fontSize: 9 }}>·</span>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: T.muted, fontFamily: T.fontUI, fontSize: 11 }}>
                        <Icon name="clock-circle-bold" size={11} color={T.muted} />
                        {e.hours} h
                      </div>
                      {e.type ? (
                        <span style={{ padding: '2px 8px', borderRadius: 5, background: typeBg, border: '1px solid ' + typeBorder, color: typeColor, fontFamily: T.fontUI, fontSize: 10, fontWeight: 700 }}>{e.type}</span>
                      ) : null}
                    </div>
                  </div>
                  {/* Pay + status */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ color: '#F4A261', fontFamily: T.fontHead, fontSize: 15, fontWeight: 800, marginBottom: 5 }}>{e.pay.toLocaleString('cs-CZ')} Kč</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 5, background: 'rgba(91,214,138,0.09)', border: '1px solid rgba(91,214,138,0.22)' }}>
                      <Icon name="verified-check-bold" size={10} color="#5BD68A" />
                      <span style={{ color: '#5BD68A', fontFamily: T.fontUI, fontSize: 10, fontWeight: 700 }}>Dokončena</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Hours popup ───────────────────────────────────────────────────

var DEMO_HOURS = {
  '2026-05': { entries: [
    { employer: 'Výstava Brno Expo',      job: 'Promotér na výstavě',       hours: 6,  pay: 1320 },
  ]},
  '2026-04': { entries: [
    { employer: 'Sklady Novák s.r.o.',    job: 'Pomocník ve skladu',         hours: 24, pay: 4320 },
    { employer: 'EventPro Praha',         job: 'Brigádník na festivalu',     hours: 8,  pay: 1760 },
    { employer: 'Restaurace U Tří hvězd',job: 'Výpomoc v kuchyni',          hours: 6,  pay: 990  },
    { employer: 'Stěhovací firma Movers', job: 'Pomocník při stěhování',     hours: 10, pay: 2000 },
    { employer: 'Lidl Česká republika',   job: 'Výpomoc v prodejně',         hours: 16, pay: 2880 },
    { employer: 'DHL Supply Chain',       job: 'Třídění zásilek',            hours: 12, pay: 2160 },
    { employer: 'Výstava Brno Expo',      job: 'Hosteska / Promotér',        hours: 7,  pay: 1540 },
  ]},
  '2026-03': { entries: [
    { employer: 'Stěhovací firma Movers', job: 'Pomocník při stěhování',     hours: 16, pay: 3200 },
    { employer: 'Restaurace U Tří hvězd',job: 'Výpomoc v kuchyni',          hours: 12, pay: 1980 },
  ]},
  '2026-02': { entries: [
    { employer: 'Sklady Novák s.r.o.',    job: 'Pomocník ve skladu',         hours: 40, pay: 7200 },
  ]},
  '2025-12': { entries: [
    { employer: 'Výstava Brno Expo',      job: 'Promotér na veletrhu',       hours: 10, pay: 2200 },
    { employer: 'Stěhovací firma Movers', job: 'Pomocník při stěhování',     hours: 8,  pay: 1600 },
  ]},
};

var CS_MONTHS      = ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'];
var CS_MONTHS_SHORT = ['Led','Úno','Bře','Dub','Kvě','Čvn','Čvc','Srp','Zář','Říj','Lis','Pro'];

// Build 24-month pill list newest→oldest, inserting year chips when year changes
var MONTH_ITEMS = (function() {
  var now = new Date();
  var items = [];
  var prevYear = null;
  for (var i = 0; i < 24; i++) {
    var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    var y = d.getFullYear(), m = d.getMonth();
    if (prevYear !== null && y !== prevYear) {
      items.push({ type: 'year', label: String(prevYear) });
    }
    items.push({ type: 'month', year: y, month: m, key: y + '-' + String(m + 1).padStart(2, '0') });
    prevYear = y;
  }
  return items;
}());

function WHoursPopup({ onClose }) {
  var now = new Date();
  var [selYear,  setSelYear]  = useStateW(now.getFullYear());
  var [selMonth, setSelMonth] = useStateW(now.getMonth());
  var selectedRef = useRefW(null);

  useEffectW(function() {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }, [selYear, selMonth]);

  var key        = selYear + '-' + String(selMonth + 1).padStart(2, '0');
  var monthData  = DEMO_HOURS[key] || { entries: [] };
  var entries    = monthData.entries;
  var totalHours = entries.reduce(function(s, e) { return s + e.hours; }, 0);
  var totalPay   = entries.reduce(function(s, e) { return s + e.pay; }, 0);

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div
        onClick={function(e) { e.stopPropagation(); }}
        style={{
          width: '100%', maxWidth: 480,
          background: '#0e0e28', borderRadius: '20px 20px 0 0',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '0 0 36px',
          maxHeight: '93vh', display: 'flex', flexDirection: 'column',
          animation: 'wPop .25s cubic-bezier(.2,.8,.2,1)',
        }}>

        {/* Handle + header */}
        <div style={{ padding: '12px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', margin: '0 auto 16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: '#fff', fontFamily: T.fontHead, fontSize: 18, fontWeight: 800 }}>Přehled hodin</div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 32, height: 32, color: T.muted, cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 14 }}>✕</button>
          </div>
        </div>

        {/* Month pills — horizontal scroll */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          overflowX: 'auto', padding: '12px 20px',
          flexShrink: 0, scrollbarWidth: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {MONTH_ITEMS.map(function(item, idx) {
            if (item.type === 'year') {
              return (
                <div key={'yr-' + item.label} style={{
                  flexShrink: 0, padding: '5px 11px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: T.muted, fontFamily: T.fontUI, fontSize: 11, fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>{item.label}</div>
              );
            }
            var isActive = item.year === selYear && item.month === selMonth;
            return (
              <button
                key={item.key}
                ref={isActive ? selectedRef : null}
                onClick={function() { setSelYear(item.year); setSelMonth(item.month); }}
                style={{
                  flexShrink: 0, padding: '7px 16px', borderRadius: 999,
                  background: isActive ? 'rgba(91,107,255,0.3)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid ' + (isActive ? 'rgba(91,107,255,0.65)' : 'rgba(255,255,255,0.09)'),
                  color: isActive ? '#fff' : T.muted,
                  fontFamily: T.fontUI, fontSize: 13, fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
                }}>
                {CS_MONTHS_SHORT[item.month]}
              </button>
            );
          })}
        </div>

        {/* Summary */}
        {totalHours > 0 ? (
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, flexShrink: 0 }}>
            <div style={{ flex: 1, padding: '16px', borderRadius: 14, background: 'rgba(91,214,138,0.07)', border: '1px solid rgba(91,214,138,0.18)', textAlign: 'center' }}>
              <div style={{ color: '#5BD68A', fontFamily: T.fontHead, fontSize: 36, fontWeight: 900, lineHeight: 1 }}>{totalHours}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: T.fontUI, fontSize: 11, marginTop: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>Hodin</div>
            </div>
            <div style={{ flex: 1, padding: '16px', borderRadius: 14, background: 'rgba(244,162,97,0.07)', border: '1px solid rgba(244,162,97,0.18)', textAlign: 'center' }}>
              <div style={{ color: '#F4A261', fontFamily: T.fontHead, fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{totalPay.toLocaleString('cs-CZ')}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: T.fontUI, fontSize: 11, marginTop: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>Kč celkem</div>
            </div>
          </div>
        ) : null}

        {/* Entry list — grows with content, scrolls only when capped by maxHeight */}
        <div style={{ overflowY: 'auto', flex: '0 1 auto', padding: '8px 20px' }}>
          {entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🗓️</div>
              <div style={{ color: '#fff', fontFamily: T.fontHead, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Žádné brigády</div>
              <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 12, lineHeight: 1.5 }}>V tomto měsíci nemáš žádné odpracované hodiny.</div>
            </div>
          ) : entries.map(function(e, i) {
            var pct = Math.round((e.hours / totalHours) * 100);
            return (
              <div key={i} style={{ padding: '14px 0', borderBottom: i < entries.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontFamily: T.fontUI, fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{e.employer}</div>
                    <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 12 }}>{e.job}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ color: '#5BD68A', fontFamily: T.fontHead, fontSize: 16, fontWeight: 800 }}>{e.hours} h</div>
                    <div style={{ color: '#F4A261', fontFamily: T.fontUI, fontSize: 12, fontWeight: 600, marginTop: 1 }}>{e.pay.toLocaleString('cs-CZ')} Kč</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: pct + '%', borderRadius: 999, background: 'linear-gradient(90deg, #5BD68A, #3ab066)', transition: 'width .4s ease' }} />
                </div>
                <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 10, marginTop: 4 }}>{pct} % z celkových hodin tohoto měsíce</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WProfile({ tick, onSignOut, onOpenChat }) {
  const [editing,    setEditing]    = useStateW(false);
  const [saving,     setSaving]     = useStateW(false);
  const [form,       setForm]       = useStateW({ name: '', bio: '', age: '', gender: '', education: '', license: [] });
  const [userId,     setUserId]     = useStateW(null);
  const [ratingOpen, setRatingOpen] = useStateW(false);
  const [hoursOpen,  setHoursOpen]  = useStateW(false);
  const [jobsOpen,   setJobsOpen]   = useStateW(false);

  useEffectW(() => {
    sb.auth.getSession().then(function(res) {
      setUserId(res.data.session ? res.data.session.user.id : null);
    });
  }, []);

  useEffectW(() => {
    setForm({
      name:      W_PROFILE.name      || W_PROFILE.full_name || '',
      bio:       W_PROFILE.bio       || '',
      age:       W_PROFILE.age       != null ? String(W_PROFILE.age) : '',
      gender:    W_PROFILE.gender    || '',
      education: W_PROFILE.education || '',
      license:   Array.isArray(W_PROFILE.license) ? W_PROFILE.license : [],
    });
  }, [tick]);

  async function handleSave() {
    if (!userId || saving) return;
    setSaving(true);
    await updateProfileW(userId, {
      name:      form.name,
      bio:       form.bio,
      age:       form.age ? parseInt(form.age) : null,
      gender:    form.gender    || null,
      education: form.education || null,
      license:   form.license.length > 0 ? form.license : null,
    });
    setSaving(false);
    setEditing(false);
  }

  const name     = W_PROFILE.name || W_PROFILE.full_name || 'Brigádník';
  const email    = W_PROFILE.email || '';
  const bio      = W_PROFILE.bio   || '';
  const initials = name.split(/\s+/).map(function(w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase() || '?';

  const skills  = Array.isArray(W_PROFILE.skills) ? W_PROFILE.skills : [];
  const rating  = W_PROFILE.rating  || 0;
  const jobs    = W_PROFILE.jobs_done || 0;
  const hours   = W_PROFILE.hours_total || 0;
  const earned  = W_PROFILE.earned_total || 0;

  const STATS = [
    { label: 'Hodnocení', value: rating > 0 ? rating.toFixed(1) + ' ★' : '—', icon: 'star-bold',         color: T.super,   clickable: true,  onTap: function() { setRatingOpen(true); } },
    { label: 'Brigády',   value: jobs   != null ? jobs   : '—',                icon: 'case-round-bold',   color: '#8AB4FF', clickable: true,  onTap: function() { setJobsOpen(true); } },
    { label: 'Odprac. h', value: hours  != null ? hours  : '—',                icon: 'clock-circle-bold', color: '#5BD68A', clickable: true,  onTap: function() { setHoursOpen(true); } },
    { label: 'Vydělal/a', value: earned > 0 ? Math.round(earned / 1000) + ' tis Kč' : '—', icon: 'dollar-bold', color: '#F4A261', clickable: false },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 24px' }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ color: '#fff', fontFamily: T.fontHead, fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Profil</div>
        <button
          onClick={() => setEditing(function(e) { return !e; })}
          style={{
            padding: '7px 14px', borderRadius: 8,
            background: editing ? 'rgba(244,63,94,0.1)' : 'rgba(91,107,255,0.18)',
            border: '1px solid ' + (editing ? 'rgba(244,63,94,0.3)' : 'rgba(91,107,255,0.35)'),
            color: editing ? '#f43f5e' : '#fff',
            fontFamily: T.fontUI, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
          <Icon name={editing ? 'close-circle-bold' : 'pen-2-bold'} size={13} color={editing ? '#f43f5e' : '#fff'} />
          {editing ? 'Zrušit' : 'Upravit'}
        </button>
      </div>

      {/* Avatar + name */}
      <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 999,
          background: 'linear-gradient(135deg, #0020F6, #5B6BFF)',
          display: 'grid', placeItems: 'center',
          color: '#fff', fontFamily: T.fontHead, fontWeight: 800, fontSize: 26,
          boxShadow: '0 8px 24px rgba(0,32,246,0.35)',
          flexShrink: 0,
        }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <input
              value={form.name}
              onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { name: e.target.value }); }); }}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 8,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(91,107,255,0.4)',
                color: '#fff', fontFamily: T.fontHead, fontWeight: 800, fontSize: 18,
                outline: 'none', marginBottom: 6,
              }}
            />
          ) : (
            <div style={{ color: '#fff', fontFamily: T.fontHead, fontSize: 20, fontWeight: 800, letterSpacing: -0.3, marginBottom: 3 }}>{name}</div>
          )}
          <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 12 }}>{email}</div>
          <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 6, background: 'rgba(91,107,255,0.14)', border: '1px solid rgba(91,107,255,0.25)' }}>
            <Icon name="verified-check-bold" size={11} color="#5B6BFF" />
            <span style={{ color: T.light, fontFamily: T.fontUI, fontSize: 10, fontWeight: 700 }}>Brigádník</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {STATS.map(function(s) {
            return (
              <div
                key={s.label}
                onClick={s.clickable ? s.onTap : undefined}
                style={{
                  padding: '14px 16px', borderRadius: 14,
                  background: s.label === 'Hodnocení' ? 'rgba(255,210,50,0.06)' : s.label === 'Odprac. h' ? 'rgba(91,214,138,0.06)' : s.label === 'Brigády' ? 'rgba(138,180,255,0.06)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid ' + (s.label === 'Hodnocení' ? 'rgba(255,210,50,0.22)' : s.label === 'Odprac. h' ? 'rgba(91,214,138,0.22)' : s.label === 'Brigády' ? 'rgba(138,180,255,0.22)' : T.border),
                  display: 'flex', alignItems: 'center', gap: 10,
                  cursor: s.clickable ? 'pointer' : 'default',
                }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: s.color + '1a', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name={s.icon} size={16} color={s.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontFamily: T.fontHead, fontWeight: 800, fontSize: 16, letterSpacing: -0.3 }}>{s.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontFamily: T.fontUI, fontSize: 10, marginTop: 1 }}>{s.label}</div>
                </div>
                {s.clickable ? <Icon name="arrow-right-bold" size={14} color={T.muted} /> : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bio */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>O mně</div>
        {editing ? (
          <textarea
            value={form.bio}
            onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { bio: e.target.value }); }); }}
            placeholder="Napiš pár vět o sobě, zkušenostech nebo dostupnosti…"
            rows={3}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 10,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(91,107,255,0.4)',
              color: '#fff', fontFamily: T.fontUI, fontSize: 13, outline: 'none', resize: 'vertical',
              lineHeight: 1.5,
            }}
          />
        ) : (
          <div style={{
            padding: '12px 14px', borderRadius: 10,
            background: 'rgba(255,255,255,0.03)', border: '1px solid ' + T.border,
            color: bio ? '#fff' : T.mutedSoft,
            fontFamily: T.fontUI, fontSize: 13, lineHeight: 1.6,
          }}>
            {bio || 'Zatím žádný popis. Klikni „Upravit" a přidej ho.'}
          </div>
        )}
      </div>

      {/* Extra info */}
      <div style={{ padding: '0 20px 16px' }}>
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Věk */}
            <div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontFamily: T.fontUI, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 }}>Věk</div>
              <input
                type="number" min="15" max="99"
                value={form.age}
                onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { age: e.target.value }); }); }}
                placeholder="Tvůj věk"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(91,107,255,0.4)', color: '#fff', fontFamily: T.fontUI, fontSize: 13, outline: 'none' }}
              />
            </div>
            {/* Pohlaví */}
            <div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontFamily: T.fontUI, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 }}>Pohlaví</div>
              <select
                value={form.gender}
                onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { gender: e.target.value }); }); }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#1a1a3e', border: '1px solid rgba(91,107,255,0.4)', color: form.gender ? '#fff' : '#6e6ea8', fontFamily: T.fontUI, fontSize: 13, outline: 'none' }}>
                <option value="">Vybrat…</option>
                <option value="muz">Muž</option>
                <option value="zena">Žena</option>
                <option value="neuvedeno">Nechci uvádět</option>
              </select>
            </div>
            {/* Vzdělání */}
            <div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontFamily: T.fontUI, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 }}>Nejvyšší dosažené vzdělání</div>
              <select
                value={form.education}
                onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { education: e.target.value }); }); }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#1a1a3e', border: '1px solid rgba(91,107,255,0.4)', color: form.education ? '#fff' : '#6e6ea8', fontFamily: T.fontUI, fontSize: 13, outline: 'none' }}>
                <option value="">Vybrat…</option>
                <option value="zakladni">Základní</option>
                <option value="stredni">Střední bez maturity</option>
                <option value="maturita">Střední s maturitou</option>
                <option value="vos">Vyšší odborné (VOŠ)</option>
                <option value="vs">Vysokoškolské</option>
              </select>
            </div>
          </div>
        ) : (
          (W_PROFILE.age || W_PROFILE.gender || W_PROFILE.education) ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {W_PROFILE.age ? (
                <div style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontFamily: T.fontUI, fontSize: 12 }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', marginRight: 4 }}>Věk</span>{W_PROFILE.age}
                </div>
              ) : null}
              {W_PROFILE.gender ? (
                <div style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontFamily: T.fontUI, fontSize: 12 }}>
                  {{ muz: 'Muž', zena: 'Žena', neuvedeno: 'Nechci uvádět' }[W_PROFILE.gender] || W_PROFILE.gender}
                </div>
              ) : null}
              {W_PROFILE.education ? (
                <div style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontFamily: T.fontUI, fontSize: 12 }}>
                  {{ zakladni: 'ZŠ', stredni: 'SŠ bez maturity', maturita: 'Maturita', vos: 'VOŠ', vs: 'VŠ' }[W_PROFILE.education] || W_PROFILE.education}
                </div>
              ) : null}
            </div>
          ) : null
        )}
      </div>

      {/* Řidičské oprávnění */}
      {editing ? (
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontFamily: T.fontUI, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Řidičské oprávnění</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['AM','A1','A2','A','B','BE','C1','C','C+E','D','T','Nemám'].map(function(cat) {
              var isNemam = cat === 'Nemám';
              var checked = form.license.indexOf(cat) !== -1;
              function toggle() {
                setForm(function(f) {
                  var prev = f.license;
                  if (isNemam) {
                    return Object.assign({}, f, { license: checked ? [] : ['Nemám'] });
                  }
                  var without = prev.filter(function(x) { return x !== 'Nemám'; });
                  if (checked) {
                    return Object.assign({}, f, { license: without.filter(function(x) { return x !== cat; }) });
                  }
                  return Object.assign({}, f, { license: without.concat([cat]) });
                });
              }
              return (
                <button
                  key={cat}
                  onClick={toggle}
                  style={{
                    padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                    fontFamily: T.fontUI, fontSize: 13, fontWeight: 700,
                    background: checked ? (isNemam ? 'rgba(244,63,94,0.15)' : 'rgba(91,107,255,0.25)') : 'rgba(255,255,255,0.05)',
                    border: '1px solid ' + (checked ? (isNemam ? 'rgba(244,63,94,0.5)' : 'rgba(91,107,255,0.5)') : 'rgba(255,255,255,0.1)'),
                    color: checked ? '#fff' : 'rgba(255,255,255,0.5)',
                    transition: 'all .15s',
                  }}>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        Array.isArray(W_PROFILE.license) && W_PROFILE.license.length > 0 ? (
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontFamily: T.fontUI, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Řidičské oprávnění</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {W_PROFILE.license.map(function(cat) {
                return (
                  <span key={cat} style={{
                    padding: '5px 12px', borderRadius: 8,
                    background: cat === 'Nemám' ? 'rgba(244,63,94,0.1)' : 'rgba(91,107,255,0.15)',
                    border: '1px solid ' + (cat === 'Nemám' ? 'rgba(244,63,94,0.3)' : 'rgba(91,107,255,0.3)'),
                    color: '#fff', fontFamily: T.fontUI, fontSize: 12, fontWeight: 700,
                  }}>{cat}</span>
                );
              })}
            </div>
          </div>
        ) : null
      )}

      {/* Skills */}
      {(skills.length > 0 || editing) ? (
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Dovednosti</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.map(function(sk, i) {
              return (
                <span key={i} style={{
                  padding: '5px 11px', borderRadius: 999,
                  background: 'rgba(91,107,255,0.12)', border: '1px solid rgba(91,107,255,0.25)',
                  color: T.light, fontFamily: T.fontUI, fontSize: 11, fontWeight: 600,
                }}>{sk}</span>
              );
            })}
            {skills.length === 0 ? (
              <span style={{ color: T.mutedSoft, fontFamily: T.fontUI, fontSize: 12 }}>Žádné dovednosti zatím</span>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Save button */}
      {editing ? (
        <div style={{ padding: '4px 20px 16px' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%', padding: '13px', borderRadius: 12,
              background: 'linear-gradient(135deg, #0020F6, #3a3a99)',
              border: 'none', color: '#fff',
              fontFamily: T.fontHead, fontSize: 15, fontWeight: 800,
              cursor: 'pointer', opacity: saving ? 0.6 : 1,
            }}>
            {saving ? 'Ukládám…' : 'Uložit profil'}
          </button>
        </div>
      ) : null}

      {/* Sign out */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ height: 1, background: T.border, marginBottom: 16 }} />
        <button
          onClick={onSignOut}
          style={{
            width: '100%', padding: '12px', borderRadius: 12,
            background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)',
            color: '#f43f5e', fontFamily: T.fontUI, fontSize: 14, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
          <Icon name="logout-2-bold" size={16} color="#f43f5e" />
          Odhlásit se
        </button>
      </div>

      {/* Rating popup */}
      {ratingOpen ? <WRatingPopup rating={rating} onClose={function() { setRatingOpen(false); }} onOpenChat={onOpenChat} /> : null}
      {hoursOpen  ? <WHoursPopup  onClose={function() { setHoursOpen(false); }} /> : null}
      {jobsOpen   ? <WJobsPopup   onClose={function() { setJobsOpen(false); }} /> : null}
    </div>
  );
}
