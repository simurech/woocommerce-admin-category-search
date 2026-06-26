# WooCommerce Admin Category Search

Fügt ein Live-Suchfeld in die **Produktkategorien-Metabox** des WooCommerce-Produkt-Editors ein. Statt bei vielen Kategorien endlos zu scrollen, tippst du einfach los und die Liste filtert sich in Echtzeit.

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![WordPress](https://img.shields.io/badge/WordPress-6.0%2B-blue)
![PHP](https://img.shields.io/badge/PHP-8.0%2B-blue)

## Funktionen

- 🔍 **Live-Suche** direkt in der Kategorien-Metabox – filtert die Checkbox-Liste während des Tippens
- ✨ **Trefferhervorhebung** des Suchbegriffs in den Kategorienamen
- 🔤 **Umlaut-/Akzent-tolerant** – „musli" findet „Müsli", „creme" findet „Crème"
- ⬆️⬇️ **Tastatur-Navigation** – mit `↑`/`↓` durch die Treffer, `Enter` setzt das Häkchen
- 🚫 **„Keine Treffer"-Hinweis**, wenn nichts passt
- ⌨️ **`Esc`** leert das Suchfeld, **Debounce** hält die Liste auch bei vielen Kategorien flüssig
- ♿ Barrierefrei dank `aria-label` am Suchfeld
- ⚡ Rein clientseitig (JavaScript), keine zusätzlichen AJAX-Anfragen oder Datenbankabfragen
- 🧩 Funktioniert mit der Standard-Kategorienliste des Produkt-Editors (`categorychecklist`)
- 🔄 Erkennt nachträglich geladene Metaboxen per `MutationObserver`
- 🆙 Automatische Updates über GitHub-Releases (Plugin Update Checker)
- 🌐 Übersetzbar (Text Domain: `woocommerce-admin-category-search`)

## Voraussetzungen

| Anforderung      | Version       |
|------------------|---------------|
| WordPress        | 6.0 oder höher |
| PHP              | 8.0 oder höher |
| WooCommerce      | aktiv erforderlich |

Getestet bis WordPress 6.8.

## Installation

1. Lade die neueste Version unter [Releases](https://github.com/simurech/woocommerce-admin-category-search/releases) als ZIP herunter.
2. Gehe im WordPress-Backend zu **Plugins → Installieren → Plugin hochladen** und wähle die ZIP-Datei aus.
3. Aktiviere das Plugin.

Alternativ den Ordner `woocommerce-admin-category-search` nach `wp-content/plugins/` kopieren und im Backend aktivieren.

## Verwendung

Nach der Aktivierung erscheint im Produkt-Editor (**Produkte → Neu / Bearbeiten**) oberhalb der Produktkategorien-Liste ein Suchfeld mit dem Platzhalter „Kategorie suchen…“.

- Beim Tippen werden nur passende Kategorien im Tab **„Alle”** angezeigt, der Treffer wird hervorgehoben.
- Die Suche ignoriert Gross-/Kleinschreibung sowie Umlaute und Akzente.
- Mit **`↑`/`↓`** navigierst du durch die Treffer, **`Enter`** setzt bzw. entfernt das Häkchen der aktiven Kategorie.
- Mit **`Esc`** oder durch Leeren des Felds kehrt die Liste in den Ausgangszustand mit aktiven Tabs zurück.

> **Hinweis:** Das Plugin erweitert die klassische Kategorien-Metabox (`.categorydiv`). Der neue, React-basierte WooCommerce-Produkt-Editor verwendet diese Metabox nicht – dort steht die Suche derzeit nicht zur Verfügung.

## Updates

Das Plugin nutzt den [Plugin Update Checker](https://github.com/YahnisElsts/plugin-update-checker) und bezieht Updates direkt aus den GitHub-Releases dieses Repositories. Neue Versionen erscheinen automatisch in der WordPress-Update-Übersicht.

Releases werden bei jedem Push auf `main` automatisch anhand der Versionsnummer im Plugin-Header (`woocommerce-admin-category-search.php`) erstellt (siehe `.github/workflows/release.yml`).

## Entwicklung

```
woocommerce-admin-category-search.php   # Plugin-Header, Konstanten, Update-Checker
includes/
  └── class-wc-admin-category-search.php # Lädt Assets im Produkt-/Post-Editor
assets/
  └── admin-category-search.js           # Live-Such-Logik (jQuery)
lib/                                     # Plugin Update Checker (Bibliothek)
```

Eine neue Version veröffentlichst du, indem du die `Version` im Plugin-Header **und** die Konstante `WACS_VERSION` erhöhst und nach `main` pushst.

## Lizenz

Privat – © [Simon Urech](https://urech.dev). Alle Rechte vorbehalten.
