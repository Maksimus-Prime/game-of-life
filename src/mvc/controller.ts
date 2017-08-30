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
				$(this).toggleClass('dead');
				let key:any = $(this).attr('id');
				model.editLifeState(key);
			});
			view.startButton.click( function () {
				model.stop = false;
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
					$(this).toggleClass('dead');
					let key:any = $(this).attr('id');
					model.editLifeState(key);
				});
			});
			view.restartButton.click( function () {
				clearTimeout(timer);
				model.boardInit();
				view.draw();

				$('.cell').click( function () {
					$(this).toggleClass('dead');
					let key:any = $(this).attr('id');
					model.editLifeState(key);
				});
			});
			view.widthInput.blur( function () {
				if ($(this).val()) {
					model.changeWidth(+$(this).val());
					$('#data').attr('style','width: '+(model.width * 20)+'px');
					view.draw();

					$('.cell').click( function () {
						$(this).toggleClass('dead');
						let key:any = $(this).attr('id');
						model.editLifeState(key);
					});
				}
			});
			view.heigthInput.blur( function () {
				if ($(this).val()) {
					model.changeHeight(+$(this).val());
					view.draw();

					$('.cell').click( function () {
						$(this).toggleClass('dead');
						let key:any = $(this).attr('id');
						model.editLifeState(key);
					});					
				}
			});
		});
	}
}