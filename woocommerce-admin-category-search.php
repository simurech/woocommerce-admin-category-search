<?php
/**
 * Plugin Name: WooCommerce Admin Category Search
 * Description: Fügt ein Live-Suchfeld in die Produktkategorien-Metabox im WooCommerce-Produkt-Editor ein.
 * Version: 1.1.0
 * Author: Simon Urech
 * Author URI: https://urech.dev
 * License: Private
 * Text Domain: woocommerce-admin-category-search
 * Domain Path: /languages
 * Requires at least: 6.0
 * Tested up to: 6.8
 * Requires PHP: 8.0
 * Requires Plugins: woocommerce
 *
 * @package WCAdminCategorySearch
 */

if (!defined('ABSPATH')) {
    exit;
}

$wacs_data = get_file_data(__FILE__, array('Version' => 'Version'));
define('WACS_VERSION', $wacs_data['Version'] ?: '1.1.0');
define('WACS_PLUGIN_FILE', __FILE__);
define('WACS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('WACS_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once WACS_PLUGIN_DIR . 'includes/class-wc-admin-category-search.php';

$puc_file = WACS_PLUGIN_DIR . 'lib/load-v5p5.php';
if (file_exists($puc_file)) {
    require_once $puc_file;
    \YahnisElsts\PluginUpdateChecker\v5p5\PucFactory::buildUpdateChecker(
        'https://github.com/simurech/woocommerce-admin-category-search',
        WACS_PLUGIN_FILE,
        'woocommerce-admin-category-search'
    );
}
