jQuery(function ($) {
    var cfg = (typeof wacsCatSearch !== 'undefined') ? wacsCatSearch : {};
    var placeholder = cfg.placeholder || 'Kategorie suchen…';
    var noResultsText = cfg.noResults || 'Keine Kategorien gefunden';
    var ariaLabel = cfg.ariaLabel || placeholder;

    var canNormalize = (typeof ''.normalize === 'function');

    // Vergleichsform: Kleinbuchstaben und – falls verfügbar – ohne
    // Akzente/Umlaute (NFD-Zerlegung, kombinierende Zeichen entfernt),
    // damit "musli" auch "Müsli" und "creme" auch "Crème" findet.
    function fold(str) {
        var f = str.toLowerCase();
        if (canNormalize) {
            f = f.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
        return f;
    }

    // Wie fold(), liefert aber zusätzlich eine Zuordnung jeder Position in
    // der gefalteten Zeichenkette zum Index im Originaltext. Nötig, um die
    // Hervorhebung trotz möglicher Längenänderung korrekt zu platzieren.
    function foldWithMap(str) {
        var folded = '';
        var map = [];
        for (var i = 0; i < str.length; i++) {
            var ch = str.charAt(i).toLowerCase();
            if (canNormalize) {
                ch = ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            }
            for (var j = 0; j < ch.length; j++) {
                folded += ch.charAt(j);
                map.push(i);
            }
        }
        return { folded: folded, map: map };
    }

    // Kategoriename eines <li> einmalig in ein <span> packen, damit
    // die Trefferhervorhebung die Checkbox unangetastet lässt.
    function wrapLabel($li) {
        var $label = $li.children('label').first();
        if (!$label.length || $label.find('.wacs-cat-label').length) {
            return;
        }
        var textNode = null;
        $label.contents().each(function () {
            if (this.nodeType === 3 && $.trim(this.nodeValue) !== '') {
                textNode = this;
            }
        });
        if (!textNode) {
            return;
        }
        var raw = textNode.nodeValue;
        var $span = $('<span class="wacs-cat-label"></span>').text(raw).attr('data-wacs-text', raw);
        $(textNode).replaceWith($span);
    }

    // Setzt bzw. entfernt die Hervorhebung – ausschliesslich über
    // Textknoten, daher kein HTML-Injection-Risiko. q ist bereits gefaltet.
    function setHighlight($span, raw, q) {
        if (!q) {
            $span.text(raw);
            return;
        }
        var fm = foldWithMap(raw);
        var idx = fm.folded.indexOf(q);
        if (idx < 0) {
            $span.text(raw);
            return;
        }
        var start = fm.map[idx];
        var end = (idx + q.length < fm.map.length) ? fm.map[idx + q.length] : raw.length;
        $span.empty();
        $span[0].appendChild(document.createTextNode(raw.slice(0, start)));
        $('<span class="wacs-cat-search-hl"></span>').text(raw.slice(start, end)).appendTo($span);
        $span[0].appendChild(document.createTextNode(raw.slice(end)));
    }

    function toggleNoResults($d, show) {
        var $a = $d.find('.tabs-panel[id$="-all"]');
        var $msg = $a.find('.wacs-cat-noresults');
        if (show) {
            if (!$msg.length) {
                $msg = $('<p class="wacs-cat-noresults"></p>').text(noResultsText);
                $a.append($msg);
            }
            $msg.show();
        } else if ($msg.length) {
            $msg.hide();
        }
    }

    // q ist bereits gefaltet (Kleinbuchstaben, ohne Akzente).
    function applyFilter($d, q) {
        var $a = $d.find('.tabs-panel[id$="-all"]');
        var $p = $d.find('.tabs-panel[id$="-pop"]');
        if (!$a.length) {
            return;
        }

        if (q) {
            $p.hide();
            $a.show();
            var matches = 0;
            $a.find('.categorychecklist li').each(function () {
                var $li = $(this);
                var $label = $li.children('label').first();
                var $span = $label.find('.wacs-cat-label');
                var ownRaw = $span.length ? ($span.attr('data-wacs-text') || $span.text()) : $label.text();
                // Sichtbarkeit anhand des gesamten Teilbaums (inkl. Text der
                // Unterkategorien), damit ein Treffer in einer Unterkategorie
                // die Oberkategorie sichtbar lässt, auch wenn deren Name selbst
                // nicht passt.
                var visible = fold($li.text()).indexOf(q) >= 0;
                $li.toggle(visible);
                if (visible) {
                    matches++;
                }
                // Hervorhebung nur auf dem eigenen Kategorienamen.
                if ($span.length) {
                    var ownHit = fold(ownRaw).indexOf(q) >= 0;
                    setHighlight($span, ownRaw, ownHit ? q : '');
                }
            });
            toggleNoResults($d, matches === 0);
        } else {
            $d.find('.tabs-panel').each(function () {
                var panelId = $(this).attr('id');
                var isActive = $d.find('.category-tabs a[href="#' + panelId + '"]').parent().hasClass('tabs');
                $(this).toggle(isActive);
            });
            $d.find('.categorychecklist li').show();
            $a.find('.wacs-cat-label').each(function () {
                var $s = $(this);
                $s.text($s.attr('data-wacs-text') || $s.text());
            });
            toggleNoResults($d, false);
        }
    }

    function initCatSearch(div) {
        var $d = $(div);
        if ($d.find('.wacs-cat-search').length) {
            return;
        }
        var $i = $('<input>')
            .attr({ type: 'search', placeholder: placeholder, 'aria-label': ariaLabel })
            .addClass('wacs-cat-search');
        $d.prepend($i);

        // Labels einmalig für die Hervorhebung vorbereiten.
        $d.find('.tabs-panel[id$="-all"] .categorychecklist li').each(function () {
            wrapLabel($(this));
        });

        var $a = $d.find('.tabs-panel[id$="-all"]');
        var activeIdx = -1;
        var timer = null;

        function navigable() {
            return $a.find('.categorychecklist li:visible');
        }
        function clearActive() {
            $a.find('.wacs-cat-active').removeClass('wacs-cat-active');
        }
        function setActive(idx) {
            clearActive();
            var $items = navigable();
            if (!$items.length) {
                activeIdx = -1;
                return;
            }
            if (idx < 0) {
                idx = 0;
            }
            if (idx >= $items.length) {
                idx = $items.length - 1;
            }
            activeIdx = idx;
            var $el = $items.eq(idx);
            $el.children('label').first().addClass('wacs-cat-active');
            if ($el[0] && $el[0].scrollIntoView) {
                $el[0].scrollIntoView({ block: 'nearest' });
            }
        }
        function run() {
            activeIdx = -1;
            clearActive();
            applyFilter($d, fold($.trim($i.val())));
        }

        $i.on('input', function () {
            clearTimeout(timer);
            timer = setTimeout(run, 120);
        });
        $i.on('keydown', function (e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                $i.val('');
                clearTimeout(timer);
                run();
                return;
            }
            if (e.key === 'ArrowDown' || e.keyCode === 40) {
                e.preventDefault();
                setActive(activeIdx + 1);
                return;
            }
            if (e.key === 'ArrowUp' || e.keyCode === 38) {
                e.preventDefault();
                setActive(activeIdx - 1);
                return;
            }
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                var $items = navigable();
                if (!$items.length) {
                    return;
                }
                var idx = activeIdx >= 0 ? activeIdx : 0;
                var $cb = $items.eq(idx).children('label').first().find('input[type="checkbox"]').first();
                if ($cb.length) {
                    $cb.prop('checked', !$cb.prop('checked')).trigger('change');
                }
            }
        });
    }

    function tryInit() {
        $('.categorydiv').each(function () { initCatSearch(this); });
    }

    tryInit();

    if (window.MutationObserver) {
        var obs = new MutationObserver(function () { tryInit(); });
        obs.observe(document.body, { childList: true, subtree: true });
        setTimeout(function () { obs.disconnect(); }, 20000);
    }
});
