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
	Spinner,
	withNotices,
	Notice	} = wp.components; // import { IconButton, PanelBody, RangeControl, ToggleControl, Toolbar, withNotices } from '@wordpress/components';
const { Fragment } = wp.element; // import { Fragment } from '@wordpress/element';
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { 
	BlockControls,
	InspectorControls,
	BlockAlignmentToolbar,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	AlignmentToolbar,
	RichText, 
} = wp.editor; // Import * from @wordpress/editor 
const { isBlobURL } = wp.blob;

/**
 * Internal dependencies
 *
 * Import CSS.
 */
import './style.scss';
import './editor.scss';


/**
 * Module Constants
 */
const ALLOWED_MEDIA_TYPES = [ 'image' ];


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
	widthBeforeWideFullAlignments: {
		type: 'number',
		default: 600,
	},
	width: {
		type: 'number',
		default: 600,
	},
	height: {
		type: 'number',
		default: 300,
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
		__( 'algori panorama image - three sixty degree photo' ), 
		__( 'spherical photo - full-sphere 3D image' ), 
		__( 'equirectangular image - VR (Virtual Reality) photography' ), 
	],
	
	attributes: blockAttributes,  // Block attributes for editing in the block inspector.
	
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: withNotices( ( { attributes, setAttributes, isSelected, className, noticeOperations, noticeUI } ) => {
		
		const { url, title, align, widthBeforeWideFullAlignments, width, height, contentAlign, id } = attributes;
		const updateWidth = ( width ) => setAttributes( { width: parseInt( width, 10 ), widthBeforeWideFullAlignments: parseInt( width, 10 ) } );
		const updateHeight = ( height ) => setAttributes( { height: parseInt( height, 10 ) } );
		
		const onSelectImage = ( media ) => {
			if ( ! media || ! media.url ) {
				setAttributes( { url: undefined, id: undefined } );
				return;
			}
			setAttributes( { url: media.url, id: media.id } );
		};
		
		const onSelectURL = ( newURL ) => {

			if ( newURL !== url ) {
				setAttributes( { url: newURL, id: undefined } );
			}
			
		}
		
		const updateAlignment = ( nextAlign ) => {

			const extraUpdatedAttributes = [ 'wide', 'full' ].indexOf( nextAlign ) !== -1 ?
				{ width: undefined } :
				{ width: widthBeforeWideFullAlignments };

			setAttributes( { ...extraUpdatedAttributes, align: nextAlign } );

		} 
		
		const controls = ( // Set Block and Inspector Controls
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						onChange={ updateAlignment }
					/>
					<Toolbar>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectImage }
								allowedTypes={ ALLOWED_MEDIA_TYPES }
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
						</MediaUploadCheck>
					</Toolbar>
				</BlockControls>
				{ !! url && (
					<InspectorControls>
						<PanelBody title={ __( '360° Image Settings' ) }>
							<div>
								<p>
									{ __( 'Image Dimensions' ) }
								</p>
								<div>
									{
										[ 'wide', 'full' ].indexOf( align ) !== -1 ?
										<Notice status="informational" isDismissible="false" >
											{__( 'The' ) } &nbsp; 
											<strong>{__( 'Width' ) }</strong> &nbsp;  
											{__( 'setting has been disabled because you have chosen either' ) } &nbsp;  
											<strong>{__( 'Full' ) }</strong> &nbsp; 
											{__( 'or' ) } &nbsp; 
											<strong>{__( 'Wide' ) }</strong> &nbsp; 
											{__( 'width alignment from the block toolbar.' ) } 
										</Notice> :
										<TextControl
											type="number"
											label={ __( 'Width' ) }
											value={ width !== undefined ? width : '' }
											placeholder={ 600 }
											min={ 1 }
											onChange={ updateWidth }
										/>
									}
									<TextControl
										type="number"
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
							instructions: __( 'Drag a 360° image, upload a new one, insert from URL or select a file from your library.' ),
						} }
						onSelect={ onSelectImage }
						onSelectURL={ onSelectURL }
						accept="image/*"
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						notices={ noticeUI }
						onError={ noticeOperations.createErrorNotice }
					/>
				</Fragment>
			);
			
		}
		
		return ( // Return 360 image with element settings (css classes) and block controls. Get image using either { url } or { id }
			<Fragment>
				{ controls }
				{ isBlobURL( url ) && <Spinner /> }
				<figure 
					style={ [ 'wide', 'full' ].indexOf( align ) !== -1 ? { height } : { width, height } } // Remove width from style on wide alignments i.e delegate it to theme
					className={ `wp-block-cgb-block-algori-360-image align${align}` } 
				>
					<a-scene loading-screen="enabled: false;" embedded>
					  <a-entity camera="" look-controls="reverseMouseDrag: true"></a-entity>
					  <a-sky src={ url }></a-sky>
					</a-scene>
				</figure>
			</Fragment>
		);
		
	} ),

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	 
	save: ( { attributes, className } ) => {
		
		const { url, title, align, width, height, contentAlign, id } = attributes;
		
		return (
			<figure 
				style={ [ 'wide', 'full' ].indexOf( align ) !== -1 ? { height } : { width, height } } 
				className={ `align${align}` } 
			>
				<a-scene loading-screen="enabled: false;" embedded="">
				  <a-entity camera="" look-controls="reverseMouseDrag: true"></a-entity>
				  <a-sky src={ url }></a-sky>
				</a-scene>
			</figure>
		);
		
	},
	
	/**
	 * Array of deprecated forms of this block.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/deprecated-blocks/
	 */
	deprecated: [ 
		{
			attributes: {
				...blockAttributes,
			},
			
			save: ( { attributes, className } ) => {
		
				const { url, title, align, width, height, contentAlign, id } = attributes;
				
				return (
					<figure 
						style={ [ 'wide', 'full' ].indexOf( align ) !== -1 ? { height } : { width, height } } 
						className={ `align${align}` } 
					>
						<a-scene embedded="">
						  <a-sky src={ url }></a-sky>
						</a-scene>
					</figure>
				);
				
			},
		},
		{
			attributes: {
				...blockAttributes,
			},
			
			save: ( { attributes, className } ) => {
		
				const { url, title, align, width, height, contentAlign, id } = attributes;
				
				return (
					<figure style={ { width, height } } >
						<a-scene embedded="">
						  <a-sky src={ url }></a-sky>
						</a-scene>
					</figure>
				);
				
			},
		},
		{
			attributes: {
				...blockAttributes,
			},
			
			save: ( { attributes, className } ) => {
		
				const { url, title, align, width, height, contentAlign, id } = attributes;
				
				return (
					<div>
						<a-scene className="wp-block-cgb-block-algori-360-image-embedded-scene" style={ { width, height } } embedded="">
						  <a-sky src={ url }></a-sky>
						</a-scene>
					</div>
				);
				
			},
		}
	],
	
} );
