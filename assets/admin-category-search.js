jQuery(function ($) {
    var placeholder = (typeof wacsCatSearch !== 'undefined') ? wacsCatSearch.placeholder : 'Kategorie suchen…';

    function initCatSearch(div) {
        var $d = $(div);
        if ($d.find('.wacs-cat-search').length) return;
        var $i = $('<input>').attr({ type: 'search', placeholder: placeholder }).addClass('wacs-cat-search');
        $d.prepend($i);
        $i.on('input', function () {
            var $a = $d.find('.tabs-panel[id$="-all"]');
            var $p = $d.find('.tabs-panel[id$="-pop"]');
            var q = $(this).val().trim().toLowerCase();
            if (!$a.length) return;
            if (q) {
                $p.hide();
                $a.show();
                $a.find('.categorychecklist li').each(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(q) >= 0);
                });
            } else {
                $d.find('.tabs-panel').each(function() {
                    var panelId = $(this).attr('id');
                    var isActive = $d.find('.category-tabs a[href="#' + panelId + '"]').parent().hasClass('tabs');
                    $(this).toggle(isActive);
                });
                $d.find('.categorychecklist li').show();
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
