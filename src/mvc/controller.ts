import * as $ from 'jquery';

export default class Controller {
	model: any;
	view: any;
	constructor (model: any, view: any) {
		this.model = model;
		this.view = view;
		
		model.boardInit();

		$(window).ready( function () {
			view.draw();

			let timer: any;

			$('.cell').click( function () {
				view.toggleCellClass($(this));
			});
			view.startButton.click( function () {
				timer = setInterval( function () {
					if (!model.stop) {
						model.nextBoardState();
						view.draw();
					} else {
						alert('Game is over!');
						clearTimeout(timer);
						model.boardStates = [];
					}
				}, 1000);
			});
			view.pauseButton.click(function () {
				clearTimeout(timer);
				view.draw();
				$('.cell').click( function () {
					view.toggleCellClass($(this));
				});
			});
			view.restartButton.click( function () {
				clearTimeout(timer);
				model.boardInit();
				model.stop = false;
				view.draw();
				$('.cell').click( function () {
					view.toggleCellClass($(this));
				});
				
			});
			view.widthInput.blur( function () {
				if ($(this).val()) {
					model.changeWidth(+$(this).val());
					view.draw();

					$('.cell').click( function () {
						view.toggleCellClass($(this));
					});
				}
			});
			view.heigthInput.blur( function () {
				if ($(this).val()) {
					model.changeHeight(+$(this).val());
					view.draw();

					$('.cell').click( function () {
						view.toggleCellClass($(this));
					});	
				}
			});
		});
	}
}