<?php
if (!defined('ABSPATH')) {
    exit;
}

class WC_Admin_Category_Search {

    public function __construct() {
        add_action('admin_enqueue_scripts', array($this, 'enqueue_assets'));
    }

    public function enqueue_assets() {
        $screen = get_current_screen();
        if (!$screen || !in_array($screen->id, array('product', 'post'), true)) {
            return;
        }
        wp_enqueue_script(
            'wacs-category-search',
            WACS_PLUGIN_URL . 'assets/admin-category-search.js',
            array('jquery'),
            WACS_VERSION,
            true
        );
        wp_localize_script('wacs-category-search', 'wacsCatSearch', array(
            'placeholder' => __('Kategorie suchen…', 'woocommerce-admin-category-search'),
        ));
        wp_add_inline_style('admin-menu', '.wacs-cat-search{width:100%;box-sizing:border-box;margin:6px 0 4px;padding:4px 6px;border:1px solid #ddd;border-radius:3px;font-size:13px;}');
    }
}

new WC_Admin_Category_Search();
