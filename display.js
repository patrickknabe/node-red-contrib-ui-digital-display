module.exports = RED => {
	let ui;

	RED.nodes.registerType( 'ui_digital_display', function( config ) {
		RED.nodes.createNode( this, config );

		if( !ui ) {
			try {
				ui = RED.require( 'node-red-dashboard' )( RED );
			} catch {}
		}

		if( ui && RED.nodes.getNode( config.group ) ) {
			this.on( 'close', ui.addWidget( {
				node: this,
				format: `
					<div id="ui_digital_display_{{ $id }}" style="display: flex; height: 100%; justify-content: flex-end" ng-init="digits = ${ +config.digits || 0 }; decimals = ${ +config.decimals || 0 }">
						<svg version="1.1" viewBox="0 0 660 990" xmlns="http://www.w3.org/2000/svg" style="height: -webkit-fill-available" ng-repeat="x in [].constructor( ${ +config.digits || 0 } ) track by $index">
							<path d="m164.59 7.6241e-5h332.31l33.735 36.176-84.078 78.404h-247.65l-73.113-78.404z" />
							<path d="m87.115 72.249 75.498 80.961-16.917 241.93-74.915 69.86-38.525-41.313 22.462-321.23z" />
							<path d="m454.96 389.16 15.725-224.88 95.964-89.488 19.36 20.761-23.784 340.13-34.168 31.863z" />
							<path d="m171.1 443.65h262.35l55.921 59.968-58.717 54.612h-272.94l-50.926-54.612z" />
							<path d="m68.05 539.75 62.822 67.368-17.266 246.91-76.188 71.046-37.419-40.127 21.076-301.4z" />
							<path d="m525.64 542.51 27.085 29.045-23.14 330.91-27.204 25.368-79.153-84.881 15.331-219.24z" />
							<path d="m73.685 963.97 83.764-78.112h233.35l72.84 78.112-38.641 36.033h-317.71z" />
							<path d="m581.06 885.86h51.994l26.941 58.193-34.923 55.952h-51.994l-25.991-56.215z" />
						</svg>
					</div>
				`,
				width: +config.width || RED.nodes.getNode( config.group ).config.width,
				height: +config.height || 1,
				group: config.group,
				order: config.order,
				beforeEmit: msg => ( { msg } ),
				initController: $scope => {
					$( () => $scope.msg = $scope.msg || { payload: 0 } );

					$scope.$watch( 'msg', msg => {
						const pattern = {
							' ': [ false, false, false, false, false, false, false ],
							'-': [ false, false, false, true, false, false, false ],
							'0': [ true, true, true, false, true, true, true ],
							'1': [ false, false, true, false, false, true, false ],
							'2': [ true, false, true, true, true, false, true ],
							'3': [ true, false, true, true, false, true, true ],
							'4': [ false, true, true, true, false, true, false ],
							'5': [ true, true, false, true, false, true, true ],
							'6': [ true, true, false, true, true, true, true ],
							'7': [ true, false, true, false, false, true, false ],
							'8': [ true, true, true, true, true, true, true ],
							'9': [ true, true, true, true, false, true, true ]
						};

						let value = '---';

						if( msg ) {
							switch( typeof msg.payload ) {

								case 'number':
									value = msg.payload.toFixed( $scope.decimals );
									break;

								case 'string':
									if( msg.payload.match( /^[+-]?\d+[.,]?\d*$/ ) ) {
										value = parseFloat( msg.payload.replace( ',', '.' ) ).toFixed( $scope.decimals );
									}

									break;

							}
						}

						value = value.replace( '.', '' );
						
						if( value.length > $scope.digits ) {
							value = value.substr( -$scope.digits );
						} else {
							value = value.padStart( $scope.digits );
						}

						$( `#ui_digital_display_${ $scope.$id } > svg` ).each( ( idx, digit ) => {
							pattern[ value.charAt( idx ) ].forEach( ( val, idx ) => {
								if( val ) {
									$( $( digit ).find( 'path' ).get( idx ) ).css( 'fill', 'var( --nr-dashboard-pageTitlebarBackgroundColor )' );
								} else {
									$( $( digit ).find( 'path' ).get( idx ) ).css( 'fill', 'var( --nr-dashboard-groupBackgroundColor )' );
								}
							} );

							if( $scope.decimals > 0 && value.charAt( idx ) !== '-' && idx === $scope.digits - $scope.decimals - 1 ) {
								$( digit ).find( 'path:last-child' ).css( 'fill', 'var( --nr-dashboard-pageTitlebarBackgroundColor )' );
							} else {
								$( digit ).find( 'path:last-child' ).css( 'fill', 'var( --nr-dashboard-groupBackgroundColor )' );
							}
						} );
					} );
				}
			} ) );
		}
	} );
};