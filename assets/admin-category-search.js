jQuery(function ($) {
    var cfg = (typeof wacsCatSearch !== 'undefined') ? wacsCatSearch : {};
    var placeholder = cfg.placeholder || 'Kategorie suchen…';
    var noResultsText = cfg.noResults || 'Keine Kategorien gefunden';
    var ariaLabel = cfg.ariaLabel || placeholder;

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
    // Textknoten, daher kein HTML-Injection-Risiko.
    function setHighlight($span, raw, q) {
        if (!q) {
            $span.text(raw);
            return;
        }
        var idx = raw.toLowerCase().indexOf(q);
        if (idx < 0) {
            $span.text(raw);
            return;
        }
        $span.empty();
        $span[0].appendChild(document.createTextNode(raw.slice(0, idx)));
        $('<span class="wacs-cat-search-hl"></span>').text(raw.slice(idx, idx + q.length)).appendTo($span);
        $span[0].appendChild(document.createTextNode(raw.slice(idx + q.length)));
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
                var $span = $li.children('label').first().find('.wacs-cat-label');
                var raw = $span.length ? ($span.attr('data-wacs-text') || $span.text()) : $li.children('label').first().text();
                var hit = raw.toLowerCase().indexOf(q) >= 0;
                $li.toggle(hit);
                if (hit) {
                    matches++;
                }
                if ($span.length) {
                    setHighlight($span, raw, hit ? q : '');
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

        var timer = null;
        function run() {
            applyFilter($d, $.trim($i.val()).toLowerCase());
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
