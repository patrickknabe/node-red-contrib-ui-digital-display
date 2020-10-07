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
					<div style="border-bottom: 1px solid #000000; font-size: 16px; font-weight: bold; margin: 0 0 10px;">Hurz der Habicht</div>
					<div style="display: flex; height: 100%; justify-content: flex-end; margin: 0 0 10px;">
						<svg ng-repeat="x in [].constructor( 2 ) track by $index" style="height: 100%;" version="1.1" viewBox="0 0 660 1000" xmlns="http://www.w3.org/2000/svg">
							<path d="m581.06 885.86h51.994l26.941 58.193-34.923 55.952h-51.994l-25.991-56.215z" />
							<path d="m73.685 963.97 83.764-78.112h233.35l72.84 78.112-38.641 36.033h-317.71z" />
							<path d="m525.64 542.51 27.085 29.045-23.14 330.91-27.204 25.368-79.153-84.881 15.331-219.24z" />
							<path d="m68.05 539.75 62.822 67.368-17.266 246.91-76.188 71.046-37.419-40.127 21.076-301.4z" />
							<path d="m171.1 443.65h262.35l55.921 59.968-58.717 54.612h-272.94l-50.926-54.612z" />
							<path d="m454.96 389.16 15.725-224.88 95.964-89.488 19.36 20.761-23.784 340.13-34.168 31.863z" />
							<path d="m87.115 72.249 75.498 80.961-16.917 241.93-74.915 69.86-38.525-41.313 22.462-321.23z" />
							<path d="m164.59 7.6241e-5h332.31l33.735 36.176-84.078 78.404h-247.65l-73.113-78.404z" />
						</svg>
					</div>
				`,
				width: config.width,
				height: +config.height || RED.nodes.getNode( config.group ).config.width,
				group: config.group,
				order: config.order,
				initController: $scope => $scope.$watch( 'msg.payload', payload => {
					const date = new Date( +payload || 0 );

					$( `#ui_clock_${ $scope.$id }_s` ).attr( 'transform', `rotate( ${ date.getSeconds() * 6 }, 500, 500 )` );
					$( `#ui_clock_${ $scope.$id }_m` ).attr( 'transform', `rotate( ${ ( date.getMinutes() + date.getSeconds() / 60 ) * 6 }, 500, 500 )` );
					$( `#ui_clock_${ $scope.$id }_h` ).attr( 'transform', `rotate( ${ ( date.getHours() + date.getMinutes() / 60 ) * 30 }, 500, 500 )` );
				} )
			} ) );
		}
	} );
};