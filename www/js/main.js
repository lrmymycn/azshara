var language = window.localStorage['language'];
if(language == null || language == ''){
	language = 'en';
}

head.js("js/jquery.js", "js/jquery-ui.min.js", "js/jquery.mobile.js", "js/jquery.validate.min.js", "js/date.js", "js/slider.min.js","js/fullcalendar.js", 'js/lang.js', function() {
   Main.init();
});

var Main = {
	unit:'',
	password:'',
	test:false,
	apiRoot:'http://ibutler.webility.com.au/',
	serviceDateTime:null,
	currentService:'',
	currentEvent:null,
	loading:false,
	init:function(){
		$(document).ready(function(){
			Main.loadConfig();
			Main.getLoginStatus();
			Home.init();
			DryClean.init();
			CarWash.init();
			Cleaner.init();
			CarServices.init();
			BabySitting.init();
			Massage.init();
			Settings.init();
		});
	},
	loadConfig:function(){
		$.support.cors = true;
		$.mobile.allowCrossDomainPages = true;
		$.mobile.defaultPageTransition = 'slide';
		$.ajaxSetup({
			headers: { "cache-control": "no-cache" }
		});		
	},
	getLoginStatus:function(){
		Main.unit = window.localStorage['unit'];
		Main.password = window.localStorage['password'];
		
		if(Main.test == true){
			Main.unit = 'A101';
			Main.password = '123456';
		}
		
		if(Main.unit == null || Main.password == null){
			Login.init();
			$.mobile.changePage('login.html', {transition:'none'});
		}else{
			$.mobile.changePage('home.html', {transition:'none'});
		}
	}
}

var Home = {
	init:function(){
		$('#page-home').live('pageshow', function(){
			Main.currentService = 'Home';
			
			Home.slider();	
			Tools.initCalendar();
			
			$('#menu-grocery').text(_('Grocery'));
			$('#menu-takeaway').text(_('Takeaway'));
			$('#menu-taxi').text(_('Taxi'));
			$('#menu-dry-clean').text(_('Dry Clean'));
			$('#menu-car-wash').text(_('Car Wash'));
			$('#menu-home-clean').text(_('Home Clean'));
			$('#menu-car-services').text(_('Car Services'));
			$('#menu-baby-sitting').text(_('Baby Sitting'));
			$('#menu-massage').text(_('Massage'));
		});
	},
	slider:function(){
		var slider = new Slider($('#ads')).fetchJson('json/ads.json').setTheme('no-control').setSize(738, 300).setTransitionFunction(SliderTransitionFunctions['squares']);
	}
}

var CarWash = {
	price:0,
	init:function(){
		$('#page-carwash').live('pagecreate', function(){
			Tools.initDate(true);
			
			//TODO fetch from ajax			
			var services = [{id:1, name:"Exterior", price:30.00},
							{id:2, name:"Exterior + Interior", price:60.00}];
			
			//TODO generate service list
			CarWash.price = services[0].price;
			$('.total').text(CarWash.price.toFixed(2));
			
			$('input[name="services"]').change(function(){
				var index = $(this).val();
				CarWash.price = services[index].price;
				$('.total').text(CarWash.price.toFixed(2));
			});
			
			$('a.btn-pay').click(function(){
				//TODO Validate
				$.mobile.changePage('home.html', {reverse: true});
			});
		});
	}
}

var Cleaner = {
	init:function(){
		$('#page-cleaner').live('pagecreate', function(){
			
			Tools.initDate();
			Tools.initPasscode();
			
			$('a.btn-pay').click(function(){
				//TODO Validate
				$.mobile.changePage('home.html', {reverse: true});
			});
		});
	}
}

var DryClean = {
	currentCategory:'',
	currentCategoryId:0,
	items:null,
	init:function(){
		DryClean.items = [];
		
		$('#page-dryclean').live('pagecreate', function(){
			Tools.initDate(true);
			
			$('a.btn-pay').click(function(){
				//TODO Validate
				$.mobile.changePage('home.html', {reverse: true});
			});
			
			for(var i = 0; i < DryClean.items.length; i++){
				$li = $('<li ><a href="#" data-theme="c" data-index="' + i + '">' + DryClean.items[i].category + ' - ' + DryClean.items[i].service + '<span class="ui-li-count">' + DryClean.items[i].num + '</span><p class="ui-li-aside">$' + DryClean.items[i].price.toFixed(2) + '</p></a></li>');
				$li.find('a').click(function(){
					var index = $(this).data('index');
					DryClean.items.splice(index, 1);
					$(this).parents('li').remove();
					
					$('#list-items').listview('refresh');
					
					DryClean.updateTotal();
				});
				$('#list-items').append($li);
			}
			
			DryClean.updateTotal();
		});
		
		DryClean.initCategories();
		DryClean.initServices();
	},
	initCategories:function(){
		$('#page-categories').live('pagecreate', function(){
			var categories = [{id:1, category:'Suit'},
								{id:2, category:'Shirt'},
								{id:3, category:'Blouse'},
								{id:4, category:'Pants / Trousers / Jeans'},
								{id:5, category:'Skirt'},
								{id:6, category:'Dress'},
								{id:7, category:'Jacket / Vest'},
								{id:8, category:'Jumper / Cardigan'},
								{id:9, category:'Coat'},
								{id:10, category:'Tie / Scarf'},
								{id:11, category:'Shorts'}
							];
			for(var i = 0; i < categories.length; i++){
				var $li = $('<li><a href="services.html" data-id="' + categories[i].id + '">'+ categories[i].category + '</a></li>');
				$li.find('a').click(function(){
					DryClean.currentCategory = $(this).text();
					DryClean.currentCategoryId = $(this).data('id');
				});
				$('#list-categories').append($li);
			}
		});
	},
	initServices:function(){
		$('#page-services').live('pagecreate', function(){
			$('#text-service').text(DryClean.currentCategory);
			var services = []
			var currentService = '';
			var currentServiceId = 0;
			var currentUnitPrice = 0;
			
			//TODO read from ajax
			var list = [{services:[{id:1, service:'2 Piece Suit(Plain)', price:17.00},
							{id:2, service:'2 Piece Suit (Linen / Silk)', price:20.00}]},
						{services:[{id:1, service:'Business Shirt (Mens)', price:3.50},
							{id:2, service:'Business Shirt (Ladies)', price:4.00},
							{id:3, service:'Polo T-Shirt (Short sleeve)', price:3.00},
							{id:4, service:'Polo T-Shirt (Long sleeve)', price:4.40}]},
						{services:[{id:1, service:'Blouse', price:6.00},
							{id:2, service:'Blouse (Designer / Silk)', price:9.00}]},
						{services:[{id:1, service:'Pants / Trousers / Jeans (Plain)', price:8.30},
							{id:2, service:'Pants / Trousers / Jeans (Linen / Silk)', price:10.00}]},
						{services:[{id:1, service:'Skirt Short (Plain)', price:8.00},
							{id:2, service:'Skirt Medium (Plain)', price:10.00},
							{id:3, service:'Skirt Long (Plain)', price:12.00}]},
						{services:[{id:1, service:'Short Dress', price:14.00},
							{id:2, service:'Medium Dress', price:18.00},
							{id:3, service:'Long Dress', price:22.00},
							{id:4, service:'Dress (Silk - Beaded/Sequence)', price:30.00},
							{id:5, service:'Evening Dress', price:30.00},
							{id:6, service:'Expensive Designer Dress', price:55.00}]},
						{services:[{id:1, service:'Jacket', price:8.30},
							{id:2, service:'Vest', price:7.50}]},
						{services:[{id:1, service:'Jumper / Cardigan (Light)', price:8.30},
							{id:2, service:'Jumper / Cardigan (Heavy)', price:14.00}]},
						{services:[{id:1, service:'Short Coat', price:13.00},
							{id:2, service:'Mid Coat', price:19.00},
							{id:3, service:'Long Coat', price:27.00}]},
						{services:[{id:1, service:'Scarf', price:7.00},
							{id:2, service:'Tie', price:4.50}]},
						{services:[{id:1, service:'Shorts', price:6.00},
							{id:2, service:'Cargo / Long Shorts', price:8.00}]},
						];
			
			services = list[DryClean.currentCategoryId - 1].services;

			for(var i = 0; i < services.length; i++){
				var $li = $('<li data-icon="add"><a href="#popup-quantity" data-id="' + services[i].id + '" data-name="' + services[i].service + '" data-price="' + services[i].price + '" data-position-to="window" data-rel="popup">'+ services[i].service + '<p class="ui-li-aside">$' + services[i].price.toFixed(2) + '</p></a></li>');
				$li.find('a').click(function(){
					currentService = $(this).data('name');
					currentServiceId = $(this).data('id');
					currentUnitPrice = $(this).data('price');
				});
				$('#list-services').append($li);
			}
			
			$('.btn-quantity').click(function(){
				var num = $('#popup-quantity input[name="quantity"]').val();
				var price = currentUnitPrice * num;
				var item = {categoryId:DryClean.currentCategoryId, category:DryClean.currentCategory, serviceId:currentServiceId, service:currentService, price:price, num:num};
				DryClean.items.push(item);
				$.mobile.changePage('../dry_clean.html', {reverse: true});
			});
		});
	},
	updateTotal:function(){
		var total = 0;
		for(var i = 0; i < DryClean.items.length; i++){
			total += DryClean.items[i].price;
		}
		$('.total').text(total.toFixed(2));
	}
}

var CarServices = {
	init:function(){
		$('#page-carservices').live('pagecreate', function(){
			Tools.initDate(true);
			
			$('.btn-contactname').click(function(){
				var name = $('#popup-contactname input[name="name"]').val();
				$('#text-contactname').text(name);
				$('#text-contactname').parents('li').removeClass('ui-btn-active');
			});
			
			$('.btn-contactnumber').click(function(){
				var number = $('#popup-contactnumber input[name="number"]').val();
				$('#text-contactnumber').text(number);
				$('#text-contactnumber').parents('li').removeClass('ui-btn-active');
			});
			
			$('a.btn-book').click(function(){
				//TODO Validate
				$.mobile.changePage('home.html', {reverse: true});
			});
		});
	}
}

var BabySitting = {
	price:0,
	init:function(){
		$('#page-babysitting').live('pagecreate', function(){
			Tools.initDate();
			Tools.initPasscode();
			
			//TODO fetch from ajax			
			var services = [{id:1, name:"1 Hour Service", price:30.00},
							{id:2, name:"2 Hour Service", price:60.00}];
			
			//TODO generate service list
			BabySitting.price = services[0].price;
			$('.total').text(BabySitting.price.toFixed(2));
			
			$('input[name="services"]').change(function(){
				var index = $(this).val();
				BabySitting.price = services[index].price;
				$('.total').text(BabySitting.price.toFixed(2));
			});
			
			$('a.btn-pay').click(function(){
				//TODO Validate
				$.mobile.changePage('home.html', {reverse: true});
			});
		});
	}
}

var Massage = {
	price:0,
	init:function(){		
		$('#page-massage').live('pageshow', function(){
			Main.currentService = 'Massage';
			
			$('#selected-date').text(Main.serviceDateTime.toString('dddd, d MMMM yyyy'));
									
			var services = null;
			$.mobile.loading('show');
			Main.loading = true;
			$.ajax({
				type: 'GET',
				url: Main.apiRoot + 'massage/services',
				dataType: "json",
				success: function (json) {
					services = json;
					
					if(services != null && services.length > 0){
						$('#massage-service-list').empty();
						for(var i = 0; i < services.length; i++){
							var service = services[i];
							var $option = '';
							if(i == 0){
								$option = $('<input type="radio" name="services" id="service-' + service.id +'" value="' + service.id + '" data-price="' + service.price + '" checked="checked"/><label for="service-' + service.id + '">' + service.name + '</label>');
							}else{
								$option = $('<input type="radio" name="services" id="service-' + service.id +'" value="' + service.id + '" data-price="' + service.price + '"/><label for="service-' + service.id + '">' + service.name + '</label>');
							}
							 
							$('#massage-service-list').append($option);
						}
						
						$('#page-massage').trigger('create');
						
						Massage.price = services[0].price;
						$('.total').text(Massage.price.toFixed(2));
						
						$('input[name="services"]').change(function(){
							Massage.price = $(this).data('price');
							$('.total').text(Massage.price.toFixed(2));
						});
					}
				},
				complete: function(){
					Main.loading = false;
					$.mobile.loading('hide');
				}
			});
			
			
			
			$('a.btn-pay').click(function(){
				if(Main.loading){
					return;
				}
				
				var hours = $('input[name="time"]:checked').val();
				Main.serviceDateTime.addHours(hours);
				var datetimeStr = Main.serviceDateTime.toString('yyyy-MM-ddTHH:mm:ss');
				var serviceId = $('input[name="services"]:checked').val();
				var comment = $('#comment').val();
				
				Main.loading = true;
				$.mobile.loading('show');
				$.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    url: Main.apiRoot + 'massage/book',
                    dataType: "json",
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
                    },
                    data: '{"serviceId":' + serviceId + ', "date":"' + datetimeStr + '", "comment":"' + comment +'"}',
                    success: function (response) {
						var event = {
							title: Main.serviceDateTime.toString('hh:mm tt'),
							start: Main.serviceDateTime,
							color: '#ff0000',
							className: ['massage']
						};
						Tools.events.push(event);
		
						$.mobile.changePage('home.html', {reverse: true});
                    },
                    error: function (request, status, error) {
						console.log(request.responseText);
					},
                    complete:function(){
						Main.loading = false;
						$.mobile.loading('hide');
					}
                });
			});
		});
		$('#page-massage-booking').live('pageshow', function(){
			Main.currentService = 'Massage';
			var event = Main.currentEvent;
			$('#selected-date').text(event.start.toString('dddd, d MMMM yyyy hh:mm tt'));
			
			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'GET',
				url: Main.apiRoot + 'massage/?id=' + event.id,
				dataType: "json",
				beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
				},
				success: function (response) {
					$('#selected-service').html(response.service);
					$('#comment').html(response.comment);
					$('span.total').text(response.price);
				},
				error: function (request, status, error) {
					console.log(request.responseText);
				},
				complete:function(){
					Main.loading = false;
					$.mobile.loading('hide');
				}
			});
			
			$('a.btn-cancel').click(function(){
				Main.loading = true;
				$.mobile.loading('show');
				var event = Main.currentEvent;
				
				$.ajax({
					type: 'GET',
					url: Main.apiRoot + 'massage/cancel/' + event.id,
					dataType: "json",
					beforeSend: function (request) {
						request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
					},
					success: function (response) {
						Tools.removeA(Tools.events, Main.currentEvent);
						Main.currentEvent = null;
						
						$.mobile.changePage('home.html', {reverse: true});
					},
					error: function (request, status, error) {
						console.log(request.responseText);
					},
					complete:function(){
						Main.loading = false;
						$.mobile.loading('hide');
					}
				});

			});
		});
	}
}

var Tools = {
	events:null,
	initDate:function(time){
		$('a.date-picker').click(function(){
			$(this).parents('li').find('input.date-picker').focus();
		});
		
		$('input.date-picker').blur(function(){
			var theDateString = $(this).val();
			var lastDotIndex = theDateString.lastIndexOf('.');
			if(lastDotIndex > 0){
				theDateString = theDateString.substr(0, lastDotIndex);
			}
			var datetime = Date.parse(theDateString);
			if(time == undefined){
				$('#text-datetime').text(datetime.toString('dddd, d MMMM yyyy hh:mm tt'));
			}else{
				$('#text-datetime').text(datetime.toString('dddd, d MMMM yyyy'));
			}
		});
	},
	initPasscode:function(){
		$('.btn-passcode').click(function(){
			var passcode = $('#popup-passcode input[name="passcode"]').val();
			$('#text-passcode').text(passcode);
			$('#text-passcode').parents('li').removeClass('ui-btn-active');
		});
	},
	initCalendar:function(){		
		$('#calendar').fullCalendar({
			dayClick:function(date, allDay, jsEvent, view){				
				if(!$(this).hasClass('disabled')){
					var offset = $(this).offset();

					var x = offset.left + ($(this).width() / 2);
					var y = offset.top + ($(this).height() / 2);
					
					$('#popupMenu').popup('open', {x:x, y:y});
					Main.serviceDateTime = date;
				}
			},
			eventClick:function(event, jsEvent, view){				
				if($.inArray('massage', event.className) > -1){
					Main.currentEvent = event;
					$.mobile.changePage('massage_booking.html');
				}
			},
			viewDisplay:function(view){
				$('#calendar .fc-content td.disabled').removeClass('disabled');
				var date = $("#calendar").fullCalendar('getDate');
				var month = date.getMonth();
				var year = date.getFullYear();
				var today = new Date();
				var currentMonth = today.getMonth();
				var currentYear = today.getFullYear();
				
				if(month <= currentMonth && year <= currentYear){
					$('#calendar .fc-content td').each(function(){
						if($(this).hasClass('fc-today')){
							return false;
						}else{
							$(this).addClass('disabled');
						}
					});
				}
			}
		});

		$('#calendar').fullCalendar( 'addEventSource', function(start, end, callback){
			var startStr = start.toString('yyyy-MM-dd');
			var endStr = end.toString('yyyy-MM-dd');
			
			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'POST',
				contentType: 'application/json',
				url: Main.apiRoot + 'booking',
				dataType: "json",
				beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
				},
				data: '{"start":"' + startStr + '", "end":"' + endStr + '"}',
				success: function (response) {
					Tools.events = new Array();
					for(var i = 0; i < response.length; i++){
						var booking = response[i];
						var bookingDate = Date.parse(booking.date);
						var event = {
							id: booking.id,
							title: bookingDate.toString('hh:mm tt'),
							start: bookingDate,
							color: '#ff0000',
							className: ['massage']
						}
						Tools.events.push(event);
					}
					callback(Tools.events);
				},
				error: function (request, status, error) {
					console.log(request.responseText);
				},
				complete:function(){
					Main.loading = false;
					$.mobile.loading('hide');
				}
			});
		});
	},
	removeA: function (arr) {
		var what, a = arguments, L = a.length, ax;
		while (L > 1 && arr.length) {
			what = a[--L];
			while ((ax= arr.indexOf(what)) !== -1) {
				arr.splice(ax, 1);
			}
		}
		return arr;
	},
	encodeBase64: function(input) {
		var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

		var result = '';
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			result += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
		} while (i < input.length);

		return result;
	}
}

var Login = {
	bound:false,
	init:function(){
		if(Login.bound == false){
			console.log('Login: init');
			Login.bound = true;
			$('#page-login').live('pagecreate', function(){
				$('#form-login').validate({
					errorPlacement: function(){
						return;
					},
					submitHandler: function(form) {
						$('#submit-login').attr('disabled', true);
						$.mobile.loading('show');
						var unit = $('#form-login input#unit').val();
						var password = $('#form-login input#password').val();
						$.ajax({
							type: 'POST',
							contentType: 'application/json',
							url: Main.apiRoot + "apartment/login",
							dataType: "json",
							data: '{"unit":"' + unit + '", "password":"' + password + '"}',
							success: function(response){
								Main.unit = unit;
								Main.password = password;
								window.localStorage['unit'] = Main.unit;
								window.localStorage['password'] = Main.password;					
								$.mobile.changePage('home.html');
							},
							error: function (request, status, error) {
								var json = $.parseJSON(request.responseText);
								alert(json.messages);
							},
							complete:function(){
								$('#submit-login').attr('disabled', false);
								$.mobile.loading('hide');
							}
						});
						return false;
					}
				});
			});
		}
	}
}

var Settings = {
	language:'',
	init:function(){
		$('#page-settings').live('pagecreate', function(){
			$('#btn-logout').click(function(){
				//window.localStorage.clear();
				window.localStorage.removeItem('unit');
				window.localStorage.removeItem('password');
				Login.init();
				$.mobile.changePage('login.html');
			});
			
			Language.init();
		});
	}
}

var Language = {
	bound:false,
	init:function(){
		if(Language.bound == false){
			Language.bound = true;
			console.log('init Language');
			$('#page-language').live('pagecreate', function(){
				$('#page-language input:radio[value="' + language + '"]').attr('checked', true);
				
				$('#btn-save').click(function(){
					language = $('#page-language input:checked').val();
					window.localStorage['language'] = language;
					$.mobile.changePage('../settings.html', {reverse: true});
				});
			});
		}
	}
}
