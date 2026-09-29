/* 30-Second AI Writing Tool Finder — topaiwritertools.com
   ---------------------------------------------------------------
   Data sources (no invented numbers):
   - Quality scores & prices come from the homepage comparison table and
     assets/scoreboard.svg (Jasper 5.0 / Writesonic 4.0 / Copy.ai 4.0 / Rytr 3.0).
   - Rytr, Writesonic and Jasper are our own 30-day tested tools.
     Copy.ai is scored from our comparison table only (not a hands-on claim).

   Affiliate links:
   - Rytr  https://rytr.me?via=zhao-tianjun      (live affiliate param)
   - Jasper https://jasper.ai?fpr=topaiwritertools (live affiliate param)
   - TODO: Copy.ai and Writesonic affiliate IDs are still not issued by the
     networks, so those buttons currently use plain links (no commission).
     Swap in the real params once approved — do not guess them.
   --------------------------------------------------------------- */
(function () {
    'use strict';

    var mount = document.getElementById('tool-quiz');
    if (!mount) return;

    /* ---------- styles (dark theme, matches site cards #141416 / #e4e4e7 / #7c3aed) ---------- */
    var CSS = [
        '#tool-quiz{max-width:780px;margin:0 auto;}',
        '.tq-card{background:#141416;border:1px solid #1f1f23;border-radius:14px;padding:26px;}',
        '.tq-progress{height:4px;background:#1f1f23;border-radius:100px;overflow:hidden;margin-bottom:18px;}',
        '.tq-progress>i{display:block;height:100%;width:0;background:linear-gradient(135deg,#7c3aed,#6d28d9);transition:width .35s ease;}',
        '.tq-step{font-size:12px;color:#71717a;margin-bottom:8px;}',
        '.tq-q{font-size:18px;font-weight:700;color:#f4f4f5;margin:0 0 16px;line-height:1.4;}',
        '.tq-opts{display:grid;gap:10px;}',
        '.tq-opt{display:block;width:100%;text-align:left;background:#1a1a1f;border:1px solid #2a2a31;border-radius:10px;padding:14px 16px;color:#e4e4e7;font-size:14px;font-family:inherit;line-height:1.45;cursor:pointer;transition:all .18s;}',
        '.tq-opt:hover{border-color:#7c3aed;background:rgba(124,58,237,.08);transform:translateY(-1px);}',
        '.tq-opt:focus-visible{outline:2px solid #a78bfa;outline-offset:2px;}',
        '.tq-crown{font-size:12px;color:#34d399;font-weight:700;text-transform:uppercase;letter-spacing:.08em;}',
        '.tq-name{font-size:24px;font-weight:800;color:#f4f4f5;margin:6px 0 4px;}',
        '.tq-meta{font-size:13px;color:#a1a1aa;margin-bottom:10px;}',
        '.tq-stars{color:#fbbf24;margin-right:8px;}',
        '.tq-why{font-size:14px;color:#a1a1aa;line-height:1.6;margin:0 0 16px;}',
        '.tq-actions{display:flex;gap:14px;align-items:center;flex-wrap:wrap;}',
        '.tq-cta{display:inline-block;padding:10px 22px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;transition:all .2s;}',
        '.tq-cta:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(124,58,237,.3);}',
        '.tq-secondary{color:#9d7bff;font-size:13px;text-decoration:none;}',
        '.tq-secondary:hover{text-decoration:underline;}',
        '.tq-runner{margin-top:20px;padding-top:16px;border-top:1px solid #1f1f23;font-size:13px;color:#a1a1aa;line-height:1.6;}',
        '.tq-runner b{color:#e4e4e7;}',
        '.tq-foot{margin-top:18px;}',
        '.tq-restart{background:none;border:none;color:#71717a;font-size:13px;cursor:pointer;text-decoration:underline;font-family:inherit;padding:0;}',
        '.tq-restart:hover{color:#a78bfa;}',
        '.tq-note{font-size:11px;color:#71717a;margin-top:14px;line-height:1.5;}',
        '@media(max-width:600px){.tq-card{padding:20px 16px;}.tq-name{font-size:20px;}.tq-actions{flex-direction:column;align-items:stretch;}.tq-cta{text-align:center;}}'
    ].join('\n');

    if (!document.getElementById('tq-style')) {
        var st = document.createElement('style');
        st.id = 'tq-style';
        st.textContent = CSS;
        document.head.appendChild(st);
    }

    /* ---------- questions (weights nudge the recommendation) ---------- */
    var QUESTIONS = [
        {
            q: 'What do you write most?',
            opts: [
                { t: 'Long-form blog posts & SEO articles', w: { jasper: 2, writesonic: 2, rytr: 1 } },
                { t: 'Marketing copy, ads & social posts', w: { copyai: 2, jasper: 2 } },
                { t: 'E-commerce product descriptions', w: { copyai: 2, rytr: 2 } },
                { t: 'Emails & everyday business writing', w: { rytr: 2, copyai: 1 } }
            ]
        },
        {
            q: "What's your monthly budget?",
            opts: [
                { t: 'Free, if at all possible', w: { rytr: 3 } },
                { t: 'Under $10', w: { rytr: 3 } },
                { t: '$10 – $50', w: { copyai: 2, jasper: 1, rytr: 1 } },
                { t: '$50+ (budget is not the issue)', w: { jasper: 3, writesonic: 2 } }
            ]
        },
        {
            q: 'What matters most to you?',
            opts: [
                { t: 'The best possible output quality', w: { jasper: 3 } },
                { t: 'The best value for the money', w: { rytr: 3 } },
                { t: 'Team collaboration & brand voice', w: { jasper: 2, copyai: 2 } },
                { t: 'Automation & real-time web data', w: { copyai: 2, writesonic: 3 } }
            ]
        },
        {
            q: "Who's going to use it?",
            opts: [
                { t: 'Just me', w: { rytr: 2, copyai: 1 } },
                { t: 'A small team (2–5 people)', w: { copyai: 2, jasper: 1 } },
                { t: 'A company with multiple teams', w: { jasper: 3 } }
            ]
        }
    ];

    /* ---------- tool profiles (all figures taken from the site's own comparison table) ---------- */
    var TOOLS = {
        jasper: {
            name: 'Jasper', price: '$49/mo', score: 5.0, stars: '★★★★★', suited: 'Enterprise teams',
            why: 'The highest output quality in our 30-day testing (5.0/5), with excellent brand-voice controls — built for teams that need consistency at scale.',
            short: 'best quality if the budget allows',
            cta: 'https://jasper.ai?fpr=topaiwritertools', rel: 'nofollow sponsored', review: '/jasper-review'
        },
        writesonic: {
            name: 'Writesonic', price: '$79/mo', score: 4.0, stars: '★★★★☆', suited: 'Content creators',
            why: 'Strong all-round quality in our testing (4.0/5), plus Chatsonic for pulling in real-time web data.',
            short: 'strong all-rounder with live web data',
            cta: 'https://writesonic.com', rel: 'nofollow', review: '/writesonic-review'
        },
        copyai: {
            name: 'Copy.ai', price: '$29/mo', score: 4.0, stars: '★★★★☆', suited: 'SaaS & GTM teams',
            why: 'Unique workflow automation and a good fit for short-form go-to-market copy (4.0/5 on our comparison table).',
            short: 'best workflow automation',
            cta: 'https://www.copy.ai', rel: 'nofollow', review: '/copy-ai-review'
        },
        rytr: {
            name: 'Rytr', price: '$7.50/mo', score: 3.0, stars: '★★★☆☆', suited: 'Budget users',
            why: 'The cheapest solid option at $7.50/mo, with a forever-free plan to start on (3.0/5 in our testing).',
            short: 'cheapest way to get started',
            cta: 'https://rytr.me?via=zhao-tianjun', rel: 'nofollow sponsored', review: '/rytr-review'
        }
    };

    var ORDER = ['jasper', 'writesonic', 'copyai', 'rytr'];
    var NOTE = 'Scores follow our comparison table; Rytr, Writesonic and Jasper come from our own 30-day testing. ' +
               'Prices are list prices at time of writing. We may earn a commission on Rytr and Jasper links.';

    var step = 0;
    var scores = { jasper: 0, writesonic: 0, copyai: 0, rytr: 0 };

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    function renderQuestion() {
        var q = QUESTIONS[step];
        var pct = Math.round((step / QUESTIONS.length) * 100);

        mount.innerHTML =
            '<div class="tq-card">' +
                '<div class="tq-progress"><i style="width:' + pct + '%"></i></div>' +
                '<div class="tq-step">Question ' + (step + 1) + ' of ' + QUESTIONS.length + '</div>' +
                '<h3 class="tq-q">' + esc(q.q) + '</h3>' +
                '<div class="tq-opts">' +
                    q.opts.map(function (o, i) {
                        return '<button type="button" class="tq-opt" data-i="' + i + '">' + esc(o.t) + '</button>';
                    }).join('') +
                '</div>' +
            '</div>';

        var btns = mount.querySelectorAll('.tq-opt');
        Array.prototype.forEach.call(btns, function (btn) {
            btn.addEventListener('click', function () {
                var opt = q.opts[parseInt(btn.getAttribute('data-i'), 10)];
                for (var key in opt.w) {
                    if (Object.prototype.hasOwnProperty.call(opt.w, key) && scores[key] != null) {
                        scores[key] += opt.w[key];
                    }
                }
                step += 1;
                if (step < QUESTIONS.length) renderQuestion();
                else renderResult();
            });
        });
    }

    function renderResult() {
        var ranked = ORDER.slice().sort(function (a, b) { return scores[b] - scores[a]; });
        var win = ranked[0], second = ranked[1];
        var w = TOOLS[win], s = TOOLS[second];

        mount.innerHTML =
            '<div class="tq-card">' +
                '<div class="tq-progress"><i style="width:100%"></i></div>' +
                '<div class="tq-crown">🏆 Your best match</div>' +
                '<div class="tq-name">' + esc(w.name) + '</div>' +
                '<div class="tq-meta"><span class="tq-stars">' + w.stars + '</span>' +
                    w.score.toFixed(1) + '/5 · ' + esc(w.price) + ' · ' + esc(w.suited) + '</div>' +
                '<p class="tq-why">' + esc(w.why) + '</p>' +
                '<div class="tq-actions">' +
                    '<a class="tq-cta" href="' + w.cta + '" target="_blank" rel="' + w.rel + '">Try ' + esc(w.name) + ' →</a>' +
                    '<a class="tq-secondary" href="' + w.review + '">Read our full review</a>' +
                '</div>' +
                '<div class="tq-runner">Runner-up: <b>' + esc(s.name) + '</b> (' + s.score.toFixed(1) + '/5, ' +
                    esc(s.price) + ') — ' + esc(s.short) + '. <a class="tq-secondary" href="' + s.review + '">Compare them</a></div>' +
                '<div class="tq-foot"><button type="button" class="tq-restart">↺ Start over</button></div>' +
                '<div class="tq-note">' + esc(NOTE) + '</div>' +
            '</div>';

        mount.querySelector('.tq-restart').addEventListener('click', function () {
            step = 0;
            scores = { jasper: 0, writesonic: 0, copyai: 0, rytr: 0 };
            renderQuestion();
        });

        if (typeof window.gtag === 'function') {
            try { window.gtag('event', 'quiz_complete', { tool: win }); } catch (e) {}
        }
    }

    renderQuestion();
})();
