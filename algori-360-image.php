<?php
/**
 * Plugin Name: Algori 360 Image
 * Plugin URI: https://github.com/kevinbazira/algori-360-image/
 * Description: <strong>Algori 360 Image</strong> is a Gutenberg Block Plugin that enables you add interactive 360° images to your website. Adding immersive panorama images, spherical images, equirectangular photos, full-sphere 3D images and VR (Virtual Reality) photography <strong>will boost user engagement and increase revenue for your site</strong>.
 * Author: Kevin Bazira
 * Author URI: http://kevinbazira.com/
 * Version: 1.0.4
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package Algori_360_Image
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
