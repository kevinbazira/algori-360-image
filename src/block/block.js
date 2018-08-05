/**
 * BLOCK: algori-360-image
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
 
 
/**
 * WordPress dependencies
 */
const { 
	IconButton, 
	PanelBody,
	TextControl,  
	Toolbar, 
	withNotices } = wp.components; // import { IconButton, PanelBody, RangeControl, ToggleControl, Toolbar, withNotices } from '@wordpress/components';
const { Fragment } = wp.element; // import { Fragment } from '@wordpress/element';
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { 
	BlockControls,
	InspectorControls,
	BlockAlignmentToolbar,
	MediaPlaceholder,
	MediaUpload,
	AlignmentToolbar,
	RichText, 
} = wp.editor; // Import * from @wordpress/editor 


/**
 * Internal dependencies
 *
 * Import CSS.
 */
import './style.scss';
import './editor.scss';

const blockAttributes = {
	title: {
		type: 'array',
		source: 'children',
		selector: 'p',
	},
	url: {
		type: 'string',
	},
	align: {
		type: 'string',
	},
	width: {
		type: 'number',
	},
	height: {
		type: 'number',
	},
	contentAlign: {
		type: 'string',
		default: 'center',
	},
	id: {
		type: 'number',
	},
};

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-algori-360-image', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	
	title: __( '360° Image' ), // Block title.
	
	description: __( 'If an image is worth 1,000 words, imagine how many more words an interactive 360° image is worth!  Insert a single 360° image.' ),  // Block description that appears in the block inspector. Make it short preferably.
	
	icon: 'format-image', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	
	keywords: [ // Block search keywords
		__( 'panorama image - three sixty degree photo' ), 
		__( 'spherical photo - full-sphere 3D image' ), 
		__( 'equirectangular image - VR (Virtual Reality) photography' ), 
	],
	
	attributes: blockAttributes,  // Block attributes for editing in the block inspector.
	
	getEditWrapperProps( attributes ) {
		const { align, width } = attributes;
		if ( 'left' === align || 'center' === align || 'right' === align || 'wide' === align || 'full' === align ) {
			return { 'data-align': align, 'data-resized': !! width };
		}
	},
	

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function( { attributes, setAttributes, isSelected, className, noticeOperations, noticeUI } ) {
		
		const { url, title, align, width, height, contentAlign, id } = attributes;
		const updateWidth = ( width ) => setAttributes( { width: parseInt( width, 10 ) } );
		const updateHeight = ( height ) => setAttributes( { height: parseInt( height, 10 ) } );
		const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );
		const onSelectImage = ( media ) => {
			if ( ! media || ! media.url ) {
				setAttributes( { url: undefined, id: undefined } );
				return;
			}
			setAttributes( { url: media.url, id: media.id } );
		};
		
		const controls = ( // Set Block and Inspector Controls
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						onChange={ updateAlignment }
					/>
					<AlignmentToolbar
						value={ contentAlign }
						onChange={ ( nextAlign ) => {
							setAttributes( { contentAlign: nextAlign } );
						} }
					/>
					<Toolbar>
						<MediaUpload
							onSelect={ onSelectImage }
							type="image"
							value={ id }
							render={ ( { open } ) => (
								<IconButton
									className="components-toolbar__control"
									label={ __( 'Edit image' ) }
									icon="edit"
									onClick={ open }
								/>
							) }
						/>
					</Toolbar>
				</BlockControls>
				{ !! url && (
					<InspectorControls>
						<PanelBody title={ __( '360° Image Settings' ) }>
							<div className="core-blocks-image__dimensions">
								<p className="core-blocks-image__dimensions__row">
									{ __( 'Image Dimensions' ) }
								</p>
								<div className="core-blocks-image__dimensions__row">
									<TextControl
										type="number"
										className="core-blocks-image__dimensions__width"
										label={ __( 'Width' ) }
										value={ width !== undefined ? width : '' }
										placeholder={ 600 }
										min={ 1 }
										onChange={ updateWidth }
									/>
									<TextControl
										type="number"
										className="core-blocks-image__dimensions__height"
										label={ __( 'Height' ) }
										value={ height !== undefined ? height : '' }
										placeholder={ 300 }
										min={ 1 }
										onChange={ updateHeight }
									/>
								</div>
							</div>
						</PanelBody>
					</InspectorControls>
				) }
			</Fragment>
		);
		
		if ( ! url ) { // Upload image if it doesn't exist
			
			return ( 
				<Fragment>
					{ controls }
					<MediaPlaceholder
						icon='format-image'
						className={ className }
						labels={ {
							title: __( '360 Image' ),
							name: __( 'a 360° image' ),
						} }
						onSelect={ onSelectImage }
						accept="image/*"
						type="image"
						notices={ noticeUI }
						
					/>
				</Fragment>
			);
			
		}
		
		return ( // Return 360 image with element settings (css classes) and block controls. Get image using either { url } or { id }
			<Fragment>
				{ controls }
				<div>
					<a-scene class="wp-block-cgb-block-algori-360-image-embedded-scene" style={ { width, height } } embedded>
					  <a-sky src={ url }></a-sky>
					</a-scene>
				</div>
			</Fragment>
		);
		
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function( { attributes, className } ) {
		
		const { url, title, align, width, height, contentAlign, id } = attributes;
		
		return (
			<div>
				<a-scene className="wp-block-cgb-block-algori-360-image-embedded-scene" style={ { width, height } } embedded="">
				  <a-sky src={ url }></a-sky>
				</a-scene>
			</div>
		);
		
	},
} );
