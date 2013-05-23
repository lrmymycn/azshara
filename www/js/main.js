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
	autoHomeRoot:'http://admin:admin@192.168.1.15/',
	serviceDateTime:null,
	currentService:null,
	currentEvent:null,
	loading:false,
	price:null,
	people:null,
	init:function(){
		$('[data-role="page"]').live('pagecreate', function(){
			Language.translate();
		});
		
		$(document).ready(function(){
			Main.loadConfig();
			Main.getLoginStatus();
			Home.init();
			AutoHome.init();
			Store.init();
			DryClean.init();
			CarWash.init();
			Cleaner.init();
			CarServices.init();
			BabySitting.init();
			Massage.init();
			Chiropractor.init();
			PersonalTraining.init();
			DogWalking.init();
			Removal.init();
			Settings.init();
			BuildingClean.init();
			BuildingService.init();
			ServiceLookup.init();
			TakeAway.init();
			Help.init();
		});
	},
	loadConfig:function(){
		$.support.cors = true;
		$.mobile.allowCrossDomainPages = true;
		$.mobile.touchOverflowEnabled = true;
		$.mobile.defaultPageTransition = 'slide';
		$.mobile.page.prototype.options.backBtnText = _("Back");
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
	},
	loadService:function(){
		$('#selected-date').text(_date(Main.serviceDateTime.toString('dddd , d MMMM yyyy')));
		
		if(Main.currentService == null){
			return;
		}
									
		var services = null;
		$.mobile.loading('show');
		Main.loading = true;
		$.ajax({
			type: 'GET',
			url: Main.apiRoot + Main.currentService + '/services',
			dataType: "json",
			success: function (json) {
				services = json;
				
				if(services != null && services.length > 0){
					$('#service-list').empty();
					for(var i = 0; i < services.length; i++){
						var service = services[i];
						var $option = '';
						if(i == 0){
							$option = $('<input type="radio" name="services" id="service-' + service.id +'" value="' + service.id + '" data-price="' + service.price + '" checked="checked"/><label for="service-' + service.id + '">' + service.name + '</label>');
						}else{
							$option = $('<input type="radio" name="services" id="service-' + service.id +'" value="' + service.id + '" data-price="' + service.price + '"/><label for="service-' + service.id + '">' + service.name + '</label>');
						}
						 
						$('#service-list').append($option);
					}
					
					$('#page-' + Main.currentService).trigger('create');
					
					Main.price = services[0].price;
					$('.total').text(Main.price.toFixed(2));
					
					$('input[name="services"]').change(function(){
						Main.price = $(this).data('price');
						$('.total').text(Main.price.toFixed(2));
					});
				}
			},
			complete: function(){
				Main.loading = false;
				$.mobile.loading('hide');
			}
		});
	},
	loadContacts: function(){
		var contacts = null;
		Main.loading = true;
		$.mobile.loading('show');
		$.ajax({
			type: 'GET',
			url: Main.apiRoot + 'apartment/',
			dataType: "json",
			beforeSend: function (request) {
				request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
			},
			success: function (response) {
				contacts = response.residents;
				if(contacts != null && contacts.length > 0){
					$('#contact-list').empty();
					
					for(var i = 0; i < contacts.length; i++){
						var contact = contacts[i];
						var $option = '';
						if(i == 0){
							$option = $('<input type="radio" name="contact" id="contact-' + contact.id +'" value="' + contact.id + '" checked="checked"/><label for="contact-' + contact.id + '">' + contact.name + '</label>');
						}else{
							$option = $('<input type="radio" name="contact" id="contact-' + contact.id +'" value="' + contact.id + '"/><label for="contact-' + contact.id + '">' + contact.name + '</label>');
						}
						 
						$('#contact-list').append($option);
					}
					
					$('#page-' + Main.currentService).trigger('create');
				}
			},
			error: function (request, status, error) {
				console.log(request.responseText);
			},
			complete:function(){
				Main.loading = false;
				$.mobile.loading('hide');
			}
		});
	},
	loadTime: function(){
		Main.loading = true;
		$.mobile.loading('show');
		$.ajax({
			type: 'GET',
			url: Main.apiRoot + Main.currentService + '/time',
			dataType: "json",
			success: function (response) {
				if(response != null && response.length > 0){
					$('#time-list').empty();
					
					for(var i = 0; i < response.length; i++){
						var time = response[i];
						var $option = '';
						if(i == 0){
							$option = $('<input type="radio" name="preferredtime" id="time-' + time.id +'" value="' + time.description + '" checked="checked"/><label for="time-' + time.id + '">' + time.description + '</label>');
						}else{
							$option = $('<input type="radio" name="preferredtime" id="time-' + time.id +'" value="' + time.description + '"/><label for="time-' + time.id + '">' + time.description + '</label>');
						}
						$('#time-list').append($option);
					}
					
					$('#page-' + Main.currentService).trigger('create');
				}
			},
			error: function (request, status, error) {
				console.log(request.responseText);
			},
			complete:function(){
				Main.loading = false;
				$.mobile.loading('hide');
			}
		});
	},
	loadPeole: function(){
		Main.loading = true;
		$.mobile.loading('show');
		var datetimeStr = Main.serviceDateTime.toString('yyyy-MM-ddTHH:mm:ss');
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: Main.apiRoot + Main.currentService + '/people',
			dataType: "json",
			data: '{"date":"' + datetimeStr + '"}',
			success: function (response) {
				Main.people = response;
				
				for(var i = 0; i < response.length; i++){
					var person = response[i];
					var $option;
					if(i == 0){
						$option = $('<option value="' + person.id + '" selected="selected">' + person.name + '</option>');
					}else{
						$option = $('<option value="' + person.id + '">' + person.name + '</option>');
					}
					
					$('#people').append($option);
				}
				
				$('#people').selectmenu("refresh");
				
				$('#people').change(function(){
					var personId = $(this).val();
					Main.initTimeSegmentList(personId);
				});
				
				var personId = response[0].id;
				Main.initTimeSegmentList(personId);
			},
			error: function (request, status, error) {
				console.log(request.responseText);
			},
			complete:function(){
				Main.loading = false;
				$.mobile.loading('hide');
			}
		});
	},
	initTimeSegmentList: function(personId){
		$('#timesegments').empty();
		$('#timesegments').append('<option>Select Time</option>');
		$('#timesegments').unbind('change').change(function(){
			var val = $(this).val();
			if(val != null && val.length > 0){
				if(val.length > 1){					
					for(var i = 1; i < val.length; i++){
						if(val[i] - val[i-1] != 1) {
							alert('The time must be sequential');
							$(this).val('');
							$('#timesegments').selectmenu("refresh");
							return false;
						}
					}
				}
			
				var from = $('#timesegments option[value="' + val[0] + '"]').data('from');
				var to = $('#timesegments option[value="' + val[val.length - 1] + '"]').data('to');
				var text = from + ' to ' + to;
				$('#timesegments-button .ui-btn-text span').text(text);
			}else{
				$('#timesegments-button .ui-btn-text span').text('Select Time');
			}
		});
		
		if(Main.people == null){
			return false;
		}
		
		var timeSegment = null;
		for(var i = 0; i < Main.people.length; i++){
			if(personId == Main.people[i].id){
				timeSegment = Main.people[i].timesegments;
				break;
			}
		}
		
		if(timeSegment == null){
			return false;
		}
		
		for(var i = 0; i < timeSegment.length; i++){
			var disabled = '';
			if(!timeSegment[i].available){
				disabled = 'disabled="disabled"';
			}
			var $option = $('<option value="' + timeSegment[i].id + '" ' + disabled + ' data-from="' + timeSegment[i].from + '" data-to="' + timeSegment[i].to + '" >' + timeSegment[i].from + ' to ' + timeSegment[i].to + '</option>');
			$('#timesegments').append($option);
		}
		
		$('#timesegments').selectmenu("refresh");
	},
	initBookButton: function(){
		if(Main.currentService == null){
			return;
		}
		$('a.btn-pay').unbind().click(function(){
			if(Main.loading){
				return;
			}
			
			//TODO
			switch(Main.currentService){
				case 'massage':
				case 'removal':
				case 'chiropractor':
				case 'babysitting':
				case 'homeclean':
					if(!$('#form-' + Main.currentService).valid()){
						return false;
					}
					break;
			}
			
			var hours = $('input[name="time"]:checked').val();
			if(hours != undefined){
				Main.serviceDateTime.addHours(hours);
			}
			var datetimeStr = Main.serviceDateTime.toString('yyyy-MM-ddTHH:mm:ss');
			
			var preferredTime = $('input[name="preferredtime"]:checked').val();
			if(preferredTime == undefined){
				preferredTime = '';
			}
			
			var timeSegments = $('#timesegments').val();
			if(timeSegments == undefined){
				timeSegments = '';
			}
			
			var serviceId = $('input[name="services"]:checked').val();
			if(serviceId == undefined){
				serviceId = 0;
			}
			
			var residentId = $('input[name="contact"]:checked').val();
			if(residentId == undefined){
				residentId = 0;
			}
			
			var personId = $('#people').val();
			if(personId == undefined){
				personId = 0;
			}
			
			var passcode = $('#passcode').val();
			if(passcode == undefined){
				passcode = '';
			}
			
			var comment = $('#comment').val();
			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'POST',
				contentType: 'application/json',
				url: Main.apiRoot + Main.currentService + '/book',
				dataType: "json",
				beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
				},
				data: '{"serviceId":' + serviceId + ', "residentId":' + residentId + ', "date":"' + datetimeStr + '", "preferredTime":"' + preferredTime + '", "comment":"' + comment +'", "passcode":"' + passcode + '", "personId":' + personId + ', "timesegments":[' + timeSegments + ']}',
				success: function (response) {
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
	},
	loadBooking: function(){
		var event = Main.currentEvent;
		$('#selected-date').text(_date(event.start.toString('dddd , d MMMM yyyy hh:mm tt')));
		if(Main.currentService == null){
			return;
		}
		Main.loading = true;
		$.mobile.loading('show');
		$.ajax({
			type: 'GET',
			url: Main.apiRoot + Main.currentService + '/?id=' + event.id,
			dataType: "json",
			beforeSend: function (request) {
				request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
			},
			success: function (response) {
				$('#selected-service').html(response.service);
				if(response.passcode != undefined){
					$('#passcode').html(response.passcode);
				}
				$('#selected-time').html(response.preferredTime);
				$('#selected-contact').html(response.name + ' ' + response.email + ' ' + response.mobile);
				$('#selected-person').html(response.person);
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
		
		Main.initCancelButton();
	},
	initCancelButton: function(){
		$('a.btn-cancel').unbind().click(function(){
			Main.loading = true;
			$.mobile.loading('show');
			var event = Main.currentEvent;
			
			$.ajax({
				type: 'GET',
				url: Main.apiRoot + Main.currentService + '/cancel/' + event.id,
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
	},
	callSceneControl: function(id){
		$.ajax({
			type: 'GET',
			url: Main.autoHomeRoot + 'api/sceneControl?id=' + id + '&action=start'
		});
	}
}

var Home = {
	init:function(){
		$('#page-home').live('pageshow', function(){
			Main.currentService = 'Home';
			
			//Home.slider();	
			Tools.initHomeCalendar();
			Home.initFooterLinks();
			Home.initAutoHome();
		});
	},
	slider:function(){
		var slider = new Slider($('#ads')).fetchJson('json/ads.json').setTheme('no-control').setSize(738, 300).setTransitionFunction(SliderTransitionFunctions['squares']);
	},
	initFooterLinks:function(){
		$('a.btn-store').click(function(){
			if($(this).hasClass('grocery')){
				Store.storeId = 1;
				Store.currentCategoryId = 0;
			}else if($(this).hasClass('myer')){
				Store.storeId = 2;
				Store.currentCategoryId = 0;
			}
			$.mobile.changePage('store/categories.html');
		});
	},
	initAutoHome:function(){	
		$('#autohome a').click(function(){
			var id = $(this).data('scene');
			switch(id){
				case 6:
					$('#autohome a[data-scene="6"]').attr('data-theme', 'c').removeClass('ui-btn-up-a').addClass('ui-btn-up-c');
					$('#autohome a[data-scene="7"]').attr('data-theme', 'e').removeClass('ui-btn-up-c').addClass('ui-btn-up-e');
					break;
				case 7:
					$('#autohome a[data-scene="6"]').attr('data-theme', 'a').removeClass('ui-btn-up-c').addClass('ui-btn-up-a');
					$('#autohome a[data-scene="7"]').attr('data-theme', 'c').removeClass('ui-btn-up-e').addClass('ui-btn-up-c');
					break;
				case 8:
					$('#autohome a[data-scene="8"]').attr('data-theme', 'c').removeClass('ui-btn-up-a').addClass('ui-btn-up-c');
					$('#autohome a[data-scene="9"]').attr('data-theme', 'e').removeClass('ui-btn-up-c').addClass('ui-btn-up-e');
					break;
				case 9:
					$('#autohome a[data-scene="8"]').attr('data-theme', 'a').removeClass('ui-btn-up-c').addClass('ui-btn-up-a');
					$('#autohome a[data-scene="9"]').attr('data-theme', 'c').removeClass('ui-btn-up-e').addClass('ui-btn-up-c');
					break;
				case 10:
					$('#autohome a[data-scene="10"]').attr('data-theme', 'c').removeClass('ui-btn-up-a').addClass('ui-btn-up-c');
					$('#autohome a[data-scene="11"]').attr('data-theme', 'e').removeClass('ui-btn-up-c').addClass('ui-btn-up-e');
					break;
				case 11:
					$('#autohome a[data-scene="10"]').attr('data-theme', 'a').removeClass('ui-btn-up-c').addClass('ui-btn-up-a');
					$('#autohome a[data-scene="11"]').attr('data-theme', 'c').removeClass('ui-btn-up-e').addClass('ui-btn-up-c');
					break;
			}

			Main.callSceneControl(id);
		});
		
		$.ajax({
			type: 'GET',
			url: Main.autoHomeRoot + '/api/weather',
			dataType: "json",
			success: function (response) {
				var temp = response.Temperature;
				var hum = response.Humidity;
				var wind = response.Wind;
				
				$('#temp-val').html(temp + '&deg;C');
				$('#hum-val').html(hum + '%');
				$('#wind-val').html(wind + 'km/h');
			}
		});
	}
}

var Store = {
	storeId:0,
	currentCategoryId:0,
	parentCategoryId:0,
	init: function(){
		$('#page-store-categories').live('pageshow', function(){		
			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'GET',
				url: Main.apiRoot + 'store/?id=' + Store.storeId + '&categoryId=' + Store.currentCategoryId,
				dataType: "json",
				success: function (response) {
					$('#title').text(_(response.name));
					
					if(response.parentCategory != null){
						Store.parentCategoryId = response.parentCategory.id;
					}else{
						Store.parentCategoryId = 0;
					}
				
					categories = response.subCategories;
					if(categories != null && categories.length > 0){
						$('#list-categories').empty();
						
						for(var i = 0; i < categories.length; i++){
							var $li;
							if(categories[i].isLastLevel){
								$li = $('<li data-icon="false"><a href="' + categories[i].url + '" target="_blank">'+ categories[i].name + '</a></li>');
							}else{
								$li = $('<li><a href="' + categories[i].url + '" target="_blank">'+ categories[i].name + '</a><a href="categories.html?id=' + categories[i].id +'" data-name="' + categories[i].name + '" data-id="' + categories[i].id + '" class="next"></a></li>');
							}
							$li.find('a.next').click(function(){
								Store.currentCategoryId = $(this).data('id');
							});
							$('#list-categories').append($li);
						}
						
						$('#list-categories').listview('refresh');
					}
				},
				error: function (request, status, error) {
					console.log(request.responseText);
				},
				complete:function(){
					Main.loading = false;
					$.mobile.loading('hide');
				}
			});	
			
			$('#btn-back').unbind().click(function(){
				if(Store.currentCategoryId == 0){
					$.mobile.changePage('../home.html', {reverse: true});
				}else{
					Store.currentCategoryId = Store.parentCategoryId;
					$.mobile.back();
				}
			});
		});
	}
}

var CarWash = {
	price:0,
	init:function(){
		$('#page-carwash').live('pageshow', function(){
			Main.currentService = 'carwash';
			Main.loadService();
			Main.initBookButton();			
		});
		
		$('#page-carwash-booking').live('pageshow', function(){
			Main.currentService = 'carwash';
			Main.loadBooking();
		});
	}
}

var Cleaner = {
	init:function(){
		$('#page-homeclean').live('pageshow', function(){
			Main.currentService = 'homeclean';
			
			$('#form-homeclean').validate({
				errorPlacement: function(){
					return;
				}
			});
			
			Main.loadPeole();
			Main.loadContacts();
			Main.loadService();
			Main.initBookButton();			
		});
		
		$('#page-homeclean-booking').live('pageshow', function(){
			Main.currentService = 'homeclean';
			Main.loadBooking();
		});
	}
}

var DryClean = {
	currentCategory:'',
	currentCategoryId:0,
	items:null,
	init:function(){
		DryClean.items = [];
		
		$('#page-dryclean').live('pageshow', function(){
			Main.currentService = 'dryclean';
			$('#selected-date').text(_date(Main.serviceDateTime.toString('dddd , d MMMM yyyy')));			
			for(var i = 0; i < DryClean.items.length; i++){
				$li = $('<li data-icon="minus"><a href="#" data-theme="c" data-index="' + i + '">' + DryClean.items[i].category + ' - ' + DryClean.items[i].service + '<span class="ui-li-count">' + DryClean.items[i].num + '</span><p class="ui-li-aside">$' + DryClean.items[i].price.toFixed(2) + '</p></a></li>');
				$li.find('a').click(function(){
					var index = $(this).data('index');
					DryClean.items.splice(index, 1);
					$(this).parents('li').remove();
					
					$('#list-items').listview('refresh');					
					DryClean.updateTotal();
				});
				$('#list-items').append($li);
			}
			$('#list-items').listview('refresh');
			DryClean.updateTotal();			
			Main.loadContacts();
						
			$('.btn-pay').unbind().click(function(){
				if(Main.loading){
					return;
				}
				
				if(DryClean.items.length == 0){
					return;
				}
				var datetimeStr = Main.serviceDateTime.toString('yyyy-MM-ddTHH:mm:ss');
				var comment = $('#comment').val();
				var dryCleans = '';
				for(var i = 0; i < DryClean.items.length; i++){
					dryCleans += '{"serviceId":' + DryClean.items[i].serviceId + ', "num":' + DryClean.items[i].num + '},';
				}
				if(dryCleans.length > 0){
					dryCleans = dryCleans.substr(0, dryCleans.length -1);
				}
				var residentId = $('input[name="contact"]:checked').val();
				if(residentId == undefined){
					residentId = 0;
				}
				console.log('{"date":"' + datetimeStr + '", "comment":"' + comment +'", "dryCleans": [' + dryCleans + ']}');
				Main.loading = true;
				$.mobile.loading('show');
				$.ajax({
					type: 'POST',
					contentType: 'application/json',
					url: Main.apiRoot + Main.currentService + '/book',
					dataType: "json",
					beforeSend: function (request) {
						request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
					},
					data: '{"date":"' + datetimeStr + '", "residentId":' + residentId + ', "comment":"' + comment +'", "dryCleans": [' + dryCleans + ']}',
					success: function (response) {
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
		
		$('#page-dryclean-booking').live('pageshow', function(){
			Main.currentService = 'dryclean';
			
			var event = Main.currentEvent;
			$('#selected-date').text(_date(event.start.toString('dddd , d MMMM yyyy')));
			if(Main.currentService == null){
				return;
			}
			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'GET',
				url: Main.apiRoot + Main.currentService + '/?id=' + event.id,
				dataType: "json",
				beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
				},
				success: function (response) {
					var dryCleans = response.dryCleans;
					var dryCleanList = '';
					for(var i = 0; i < dryCleans.length; i++){
						dryCleanList += dryCleans[i].name + ' x ' + dryCleans[i].num + ' = $' + dryCleans[i].price + '<br/>';
					}
					$('#selected-contact').html(response.name + ' ' + response.email + ' ' + response.mobile);
					$('#dryclean-list').html(dryCleanList);
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
			
			Main.initCancelButton();
		});
		
		DryClean.initCategories();
		DryClean.initServices();
	},
	initCategories:function(){
		$('#page-categories').live('pageshow', function(){			
			var categories = null;
			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'GET',
				url: Main.apiRoot + 'dryclean/categories',
				dataType: "json",
				success: function (response) {
					categories = response;
					if(categories != null && categories.length > 0){
						$('#list-categories').empty();
						
						for(var i = 0; i < categories.length; i++){
							var $li = $('<li><a href="services.html" data-id="' + categories[i].id + '">'+ categories[i].name + '</a></li>');
							$li.find('a').click(function(){
								DryClean.currentCategory = $(this).text();
								DryClean.currentCategoryId = $(this).data('id');
							});
							$('#list-categories').append($li);
						}
						
						$('#list-categories').listview('refresh');
					}
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
	initServices:function(){
		$('#page-services').live('pageshow', function(){
			$('#text-service').text(DryClean.currentCategory);
			var currentService = '';
			var currentServiceId = 0;
			var currentUnitPrice = 0;
			
			var services = null;
			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'GET',
				url: Main.apiRoot + 'dryclean/services?id=' + DryClean.currentCategoryId,
				dataType: "json",
				success: function (response) {
					services = response;
					if(services != null && services.length > 0){
						$('#list-services').empty();
						
						for(var i = 0; i < services.length; i++){
							var $li = $('<li data-icon="add"><a href="#popup-quantity" data-id="' + services[i].id + '" data-name="' + services[i].name + '" data-price="' + services[i].price + '" data-position-to="window" data-rel="popup">'+ services[i].name + '<p class="ui-li-aside">$' + services[i].price.toFixed(2) + '</p></a></li>');
							$li.find('a').click(function(){
								currentService = $(this).data('name');
								currentServiceId = $(this).data('id');
								currentUnitPrice = $(this).data('price');
							});
							$('#list-services').append($li);
						}
						
						$('#list-services').listview('refresh');
					}
				},
				error: function (request, status, error) {
					console.log(request.responseText);
				},
				complete:function(){
					Main.loading = false;
					$.mobile.loading('hide');
				}
			});			
			
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

var TakeAway = {
	items:null,
	currentTime:null,
	currentTimeInMinutes:0,
	currentFilter:0,
	currentRestauran:'',
	currentRestaurantId:0,
	currentCategory: '',
	currentCategoryId:0,
	init: function(){
		TakeAway.items = [];
		
		$('#page-takeaway').live('pageshow', function(){
			Main.currentService = 'takeaway';
			$('#selected-date').text(_date(Main.serviceDateTime.toString('dddd , d MMMM yyyy')));
			
			if(TakeAway.currentTime != null){
				$('#time').val(TakeAway.currentTime);
				$('#add-item').removeClass('ui-disabled');
			}
			
			$('#time').unbind().change(function(){
				var time = $(this).val();
				if(time != ''){
					var segs = time.split(':');
					var hours = parseInt(segs[0]);
					var minutes = parseInt(segs[1]);
					
					TakeAway.currentTime = time;
					TakeAway.currentTimeInMinutes = hours * 60 + minutes;
					
					Main.serviceDateTime.addHours(hours);
					Main.serviceDateTime.addMinutes(minutes);
					
					$('#add-item').removeClass('ui-disabled');
				}
			});
							
			for(var i = 0; i < TakeAway.items.length; i++){
				$li = $('<li data-icon="minus"><a href="#" data-theme="c" data-index="' + i + '">' +  TakeAway.items[i].restaurant + ' - ' + TakeAway.items[i].category + ' - ' + TakeAway.items[i].dish + '<span class="ui-li-count">' + TakeAway.items[i].num + '</span><p class="ui-li-aside">$' + TakeAway.items[i].price.toFixed(2) + '</p></a></li>');
				$li.find('a').click(function(){
					var index = $(this).data('index');
					TakeAway.items.splice(index, 1);
					$(this).parents('li').remove();
					
					$('#list-items').listview('refresh');					
					TakeAway.updateTotal();
				});
				$('#list-items').append($li);
			}
			$('#list-items').listview('refresh');
			TakeAway.updateTotal();
			Main.loadContacts();
						
			$('.btn-pay').unbind().click(function(){
				if(Main.loading){
					return;
				}
				
				if(TakeAway.items.length == 0){
					return;
				}
				var datetimeStr = Main.serviceDateTime.toString('yyyy-MM-ddTHH:mm:ss');
				var comment = $('#comment').val();
				var takeAways = '';
				for(var i = 0; i < TakeAway.items.length; i++){
					takeAways += '{"dishId":' + TakeAway.items[i].dishId + ', "num":' + TakeAway.items[i].num + '},';
				}
				if(takeAways.length > 0){
					takeAways = takeAways.substr(0, takeAways.length -1);
				}
				var residentId = $('input[name="contact"]:checked').val();
				if(residentId == undefined){
					residentId = 0;
				}
				console.log('{"date":"' + datetimeStr + '", "comment":"' + comment +'", "takeAways": [' + takeAways + ']}');
				Main.loading = true;
				$.mobile.loading('show');
				$.ajax({
					type: 'POST',
					contentType: 'application/json',
					url: Main.apiRoot + Main.currentService + '/book',
					dataType: "json",
					beforeSend: function (request) {
						request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
					},
					data: '{"date":"' + datetimeStr + '", "time":' + TakeAway.currentTimeInMinutes + ', "residentId":' + residentId + ', "comment":"' + comment +'", "takeAways": [' + takeAways + ']}',
					success: function (response) {
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
		
		$('#page-takeaway-booking').live('pageshow', function(){
			Main.currentService = 'takeaway';
			
			var event = Main.currentEvent;
			$('#selected-date').text(_date(event.start.toString('dddd , d MMMM yyyy hh:mm tt')));

			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'GET',
				url: Main.apiRoot + Main.currentService + '/?id=' + event.id,
				dataType: "json",
				beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
				},
				success: function (response) {
					console.log(response);
					var takeAways = response.takeAways;
					var takeAwaysList = '';
					for(var i = 0; i < takeAways.length; i++){
						takeAwaysList += takeAways[i].name + ' x ' + takeAways[i].num + ' = $' + takeAways[i].price + '<br/>';
					}
					$('#selected-contact').html(response.name + ' ' + response.email + ' ' + response.mobile);
					$('#takeaway-list').html(takeAwaysList);
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
			
			Main.initCancelButton();
		});
		
		TakeAway.initRestaurant();
		TakeAway.initCategories();
		TakeAway.initDishes();
	},
	initRestaurant:function(){
		$('#page-restaurants').live('pageshow', function(){
			$('input[name="sort"]').change(function(){
				TakeAway.currentFilter = parseInt($(this).val());
				TakeAway.sortRestaurants();
			});
		
			var restaurants = null;
			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'POST',
				contentType: 'application/json',
				url: Main.apiRoot + 'takeaway/restaurants',
				dataType: "json",
				data: '{"deliverTime":' + TakeAway.currentTimeInMinutes + '}',
				success: function (response) {
					restaurants = response;
					if(restaurants != null && restaurants.length > 0){
						$('#list-restaurants').empty();
						
						for(var i = 0; i < restaurants.length; i++){
							var $li = $('<li data-type="' + restaurants[i].type + '" data-popularity="' + restaurants[i].popularity + '"><a href="categories.html" data-id="' + restaurants[i].id + '">'+ restaurants[i].name + '</a></li>');
							$li.find('a').click(function(){
								TakeAway.currentRestaurant = $(this).text();
								TakeAway.currentRestaurantId = $(this).data('id');
							});
							$('#list-restaurants').append($li);
						}
						
						TakeAway.sortRestaurants();
					}
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
	sortRestaurants:function(){
		$('#list-restaurants').listview({
			autodividersSelector: function(li){
				var out = null;
				switch(TakeAway.currentFilter){
					case 0:
						out = $(li).find('a').text().charAt(0);
						break;
					case 1:
						out = $(li).data('type');
						break;
					case 2:
						out = $(li).data('popularity');
						break;
				}
				return out;
			}
		});
		
		$('#list-restaurants').listview('refresh');
	},
	initCategories:function(){
		$('#page-restaurant-categories').live('pageshow', function(){
			$('#text-restaurant').text(TakeAway.currentRestaurant);			
			var categories = null;
			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'GET',
				url: Main.apiRoot + 'takeaway/categories/' + TakeAway.currentRestaurantId,
				dataType: "json",
				success: function (response) {
					categories = response;
					if(categories != null && categories.length > 0){
						$('#list-categories').empty();
						
						for(var i = 0; i < categories.length; i++){
							var $li = $('<li><a href="dishes.html" data-id="' + categories[i].id + '">'+ categories[i].name + '</a></li>');
							$li.find('a').click(function(){
								TakeAway.currentCategory = $(this).text();
								TakeAway.currentCategoryId = $(this).data('id');
							});
							$('#list-categories').append($li);
						}
						
						$('#list-categories').listview('refresh');
					}
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
	initDishes:function(){
		$('#page-dishes').live('pageshow', function(){
			$('#text-category').text(TakeAway.currentCategory);
			var currentService = '';
			var currentServiceId = 0;
			var currentUnitPrice = 0;
			
			var dishes = null;
			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'GET',
				url: Main.apiRoot + 'takeaway/dishes/' + TakeAway.currentCategoryId,
				dataType: "json",
				success: function (response) {
					dishes = response;
					if(dishes != null && dishes.length > 0){
						$('#list-dishes').empty();
						
						for(var i = 0; i < dishes.length; i++){
							var $li = $('<li data-icon="add"><a href="#popup-quantity" data-id="' + dishes[i].id + '" data-name="' + dishes[i].name + '" data-price="' + dishes[i].price + '" data-position-to="window" data-rel="popup">'+ dishes[i].name + '<p class="ui-li-aside">$' + dishes[i].price.toFixed(2) + '</p></a></li>');
							$li.find('a').click(function(){
								currentService = $(this).data('name');
								currentServiceId = $(this).data('id');
								currentUnitPrice = $(this).data('price');
							});
							$('#list-dishes').append($li);
						}
						
						$('#list-dishes').listview('refresh');
					}
				},
				error: function (request, status, error) {
					console.log(request.responseText);
				},
				complete:function(){
					Main.loading = false;
					$.mobile.loading('hide');
				}
			});			
			
			$('.btn-quantity').click(function(){
				var num = $('#popup-quantity input[name="quantity"]').val();
				var price = currentUnitPrice * num;
				var item = {restaurantId:TakeAway.currentRestaurantId, restaurant:TakeAway.currentRestaurant,categoryId:TakeAway.currentCategoryId, category:TakeAway.currentCategory, dishId:currentServiceId, dish:currentService, price:price, num:num};
				TakeAway.items.push(item);
				$.mobile.changePage('../takeaway.html', {reverse: true});
			});
		});
	},
	updateTotal : function(){
		var total = 0;
		for(var i = 0; i < TakeAway.items.length; i++){
			total += TakeAway.items[i].price;
		}
		$('.total').text(total.toFixed(2));
	}
}

var CarServices = {
	init:function(){
		$('#page-carservice').live('pageshow', function(){
			Main.currentService = 'carservice';
			$('#selected-date').text(_date(Main.serviceDateTime.toString('dddd , d MMMM yyyy')));
			
			Main.loadTime();
			Main.loadContacts();
			
			$('#form-carservice').validate({
				errorPlacement: function(){
					return;
				},
				submitHandler: function(form) {
					$('#submit-carservice').attr('disabled', true);
					$.mobile.loading('show');
					
					var residentId = $('input[name="contact"]:checked').val();
					if(residentId == undefined){
						residentId = 0;
					}
					var datetimeStr = Main.serviceDateTime.toString('yyyy-MM-ddTHH:mm:ss');
					var preferredTime = $('input[name="preferredtime"]:checked').val();
					var comment = $('#comment').val();
					var vehicleMake = $('#vehiclemake').val();
					var isManual = $('input[name="transmission"]:checked').val();
					var fuleType = $('#fueltype').val();
					var model = $('#model').val();
					var year = $('#manuyear').val();
					var rego = $('#rego').val();
					var engineSize = $('#enginesize').val();
					
					$.ajax({
						type: 'POST',
						contentType: 'application/json',
						url: Main.apiRoot + "carservice/book",
						beforeSend: function (request) {
							request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
						},
						dataType: "json",
						data: '{"residentId":' + residentId + ', "date":"' + datetimeStr + '", "comment":"' + comment + '", "vehicleMake":"' + vehicleMake + '", "isManual":' + isManual + ', "model":"' + model + '", "fuelType":"' + fuleType + '", "year":"' + year + '","rego":"' + rego + '","engineSize":"' + engineSize + '", "preferredTime":"' + preferredTime + '"}',
						success: function(response){
							$.mobile.changePage('home.html', {reverse: true});
						},
						error: function (request, status, error) {
							console.log(request.responseText);
						},
						complete:function(){
							$('#submit-carservice').attr('disabled', false);
							$.mobile.loading('hide');
						}
					});
					return false;
				}
			});			
		});
		
		$('#page-carservice-booking').live('pageshow', function(){
			Main.currentService = 'carservice';
			var event = Main.currentEvent;
			$('#selected-date').text(_date(event.start.toString('dddd , d MMMM yyyy')));
			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'GET',
				url: Main.apiRoot + Main.currentService + '/?id=' + event.id,
				dataType: "json",
				beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
				},
				success: function (response) {
					$('#selected-time').html(response.preferredTime);
					$('#selected-contact').html(response.name + ' ' + response.email + ' ' + response.mobile);
					$('#comment').html(response.comment);
					var carDetails = 'Vehicle Make: ' + response.vehicleMake + '<br/>' + 
									 'Transmission: ' + response.transmission + '<br/>' +
									 'Model: ' + response.model + '<br/>' +
									 'Fuel Type: ' + response.fuelType + '<br/>' +
									 'Year of Manufacture: ' + response.year + '<br/>' +
									 'Rego: ' + response.rego + '<br/>' +
									 'Engine size: ' + response.engineSize;
					$('#car-details').html(carDetails);
				},
				error: function (request, status, error) {
					console.log(request.responseText);
				},
				complete:function(){
					Main.loading = false;
					$.mobile.loading('hide');
				}
			});
			
			Main.initCancelButton();
		});
	}
}

var BabySitting = {
	init:function(){
		$('#page-babysitting').live('pageshow', function(){
			Main.currentService = 'babysitting';
			
			$('#form-babysitting').validate({
				errorPlacement: function(){
					return;
				}
			});
			
			Main.loadPeole();
			Main.loadContacts();
			Main.loadService();
			Main.initBookButton();		
		});
		
		$('#page-babysitting-booking').live('pageshow', function(){
			Main.currentService = 'babysitting';
			Main.loadBooking();
		});
	}
}

var Chiropractor = {
	init:function(){		
		$('#page-chiropractor').live('pageshow', function(){
			Main.currentService = 'chiropractor';
			
			$('#form-chiropractor').validate({
				errorPlacement: function(){
					return;
				}
			});
			
			Main.loadPeole();
			Main.loadContacts();
			Main.loadService();
			Main.initBookButton();
		});
		$('#page-chiropractor-booking').live('pageshow', function(){
			Main.currentService = 'chiropractor';
			Main.loadBooking();
		});
	}
}

var Massage = {
	init:function(){		
		$('#page-massage').live('pageshow', function(){
			Main.currentService = 'massage';
			
			$('#form-massage').validate({
				errorPlacement: function(){
					return;
				}
			});
			
			Main.loadPeole();
			Main.loadContacts();
			Main.loadService();
			Main.initBookButton();
		});
		$('#page-massage-booking').live('pageshow', function(){
			Main.currentService = 'massage';
			Main.loadBooking();
		});
	}
}

var PersonalTraining = {
	init:function(){		
		$('#page-personaltraining').live('pageshow', function(){
			Main.currentService = 'personaltraining';
			
			$('#form-personaltraining').validate({
				errorPlacement: function(){
					return;
				}
			});
			
			Main.loadPeole();
			Main.loadContacts();
			Main.loadService();
			Main.initBookButton();
		});
		$('#page-personaltraining-booking').live('pageshow', function(){
			Main.currentService = 'personaltraining';
			Main.loadBooking();
		});
	}
}

var DogWalking = {
	init:function(){
		$('#page-dogwalking').live('pageshow', function(){
			Main.currentService = 'dogwalking';
			
			$('#form-dogwalking').validate({
				errorPlacement: function(){
					return;
				}
			});
			
			Main.loadPeole();
			Main.loadContacts();
			Main.loadService();
			Main.initBookButton();
		});
		$('#page-dogwalking-booking').live('pageshow', function(){
			Main.currentService = 'dogwalking';
			Main.loadBooking();
		});
	}
}

var Removal = {
	init:function(){
		$('#page-removal').live('pageshow', function(){
			Main.currentService = 'removal';
			
			$('#form-removal').validate({
				errorPlacement: function(){
					return;
				}
			});
			
			$('#removal-date').change(function(){
				Main.serviceDateTime = Date.parse($(this).val());
				console.log(Main.serviceDateTime);
			});

			Main.loadTime();
			Main.loadContacts();
			Main.initBookButton();
		});
		$('#page-removal-booking').live('pageshow', function(){
			Main.currentService = 'removal';
			Main.loadBooking();
		});
	}
}

var BuildingClean = {
	init:function(){
		$('#page-buildingclean').live('pageshow', function(){
			Main.currentService = 'buildingclean';
			Main.serviceDateTime = new Date();
			$('#selected-date').text(_date(Main.serviceDateTime.toString('dddd , d MMMM yyyy')));
			Main.loadContacts();
			Main.initBookButton();
		});
		$('#page-buildingclean-booking').live('pageshow', function(){
			Main.currentService = 'buildingclean';
			Main.loadBooking();
		});
	}
}

var BuildingService = {
	init:function(){
		$('#page-buildingservice').live('pageshow', function(){
			Main.currentService = 'buildingservice';
			$('#selected-date').text(Main.serviceDateTime.toString('dddd, d MMMM yyyy'));
			Main.loadTime();
			Main.loadContacts();
			Main.loadService();
			Main.initBookButton();
		});
		$('#page-buildingservice-booking').live('pageshow', function(){
			Main.currentService = 'buildingservice';
			Main.loadBooking();
		});
	}
}

var ServiceLookup = {
	currentPersonId: 0,
	init:function(){			
		$('#page-servicelookup').live('pageshow', function(){
			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'GET',
				url: Main.apiRoot + 'person/',
				dataType: "json",
				success: function (response) {
					for(var i = 0; i < response.length; i++){
						var $li = '<li data-role="list-divider">' + _(response[i].name) + '</li>';
						$('#service-list').append($li);
			
						var people = response[i].people;
						for(var j = 0; j < people.length; j++){
							$li = $('<li><a href="schedule.html" data-id="' + people[j].id + '">' + people[j].name + '</a></li>');
							$li.find('a').click(function(){
								ServiceLookup.currentPersonId = $(this).data('id');
							});
							$('#service-list').append($li);
						}
					}			
					$('#service-list').listview('refresh');
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
		
		ServiceLookup.initSchedule();
	},
	initSchedule:function(){
		$('#page-schedule').live('pageshow', function(){
			Tools.initScheduleCalendar();
		});
	}
}

var AutoHome = {
	last:0,
	checking: false,
	init: function(){
		$('#page-lighting').live('pageshow', function(){
			AutoHome.checking = true;
			AutoHome.initStatus();
			
			$('#page-lighting select').change(function(){
				var name = 'turnOn';
				if($(this).val() == '0'){
					name = 'turnOff';
				}
				var deviceId = $(this).data('id');
				$.ajax({
					type: 'GET',
					url: Main.autoHomeRoot + 'api/callAction?deviceId=' + deviceId + '&name=' + name,
					dataType: "json"
				});
			});
		});
		
		$('#page-lighting').live('pagehide', function(){
			AutoHome.checking = false;
		});
		
		$('#page-scenes').live('pageshow', function(){
			$('#page-scenes a.scene').click(function(){			
				var id = $(this).data('scene');
				console.log(id);
				Main.callSceneControl(id);
			});
		});
	},
	initStatus: function(){
		Main.loading = true;
		$.mobile.loading('show');
		$.ajax({
			type: 'GET',
			url: Main.autoHomeRoot + 'api/interface/data',
			dataType: "json",
			success: function(data){
				var devices = data.devices;
				for(var i = 0; i < devices.length; i++){
					var id = devices[i].id;
					var val = devices[i].properties.value;
					
					$('#page-lighting select[data-id="' + id + '"]').val(val).slider('refresh');
				}
				
				AutoHome.checkStatus();
			},
			error: function (request, status, error) {
				console.log(request.responseText);
			},
			complete:function(){
				Main.loading = false;
				$.mobile.loading('hide');
			}
		});
	},
	checkStatus: function(){
		$.ajax({
			type: 'GET',
			url: Main.autoHomeRoot + 'api/refreshStates?last=' + AutoHome.last + '&lang=en',
			dataType: "json",
			success: function(data){
				AutoHome.last = data.last;
				if(data.changes != undefined){
					var changes = data.changes;
					for(var i = 0; i < changes.length; i++){
						var id = changes[i].id;
						var val = changes[i].value;
						if(val != undefined){
							$('#page-lighting select[data-id="' + id + '"]').val(val).slider('refresh');
						}
					}
				}
				if(AutoHome.checking){
					AutoHome.checkStatus();
				}
			}
		});
	}
}

var Help = {
	page: null,
	init: function(){
		$('a[data-help]').live('click', function(){
			Help.page = $(this).data('help');
		});
		
		$('#page-help').live('pageshow', function(){
			if(Help.page == null){
				$('#page-help .content').html("Can't find help for this page.");
				return;
			}
			
			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'GET',
				url: Main.apiRoot + 'help/?page=' + Help.page,
				dataType: "json",
				success: function (response) {
					$('#page-help .content').html(response.content);
				},
				error: function (request, status, error) {
					Help.page = null;
					console.log(request.responseText);
				},
				complete:function(){
					Main.loading = false;
					$.mobile.loading('hide');
				}
			});
		});
	}
}

var Tools = {
	events:null,
	initHomeCalendar:function(){	
		var options = {
			minTime: 7,
			maxTime: 19,
			height:720,
			header: {
				left: 'prev,next',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			monthNames: [_('January'),_('February'),_('March'),_('April'),_('May'),_('June'), _('July'),_('August'),_('September'),_('October'),_('November'),_('December')],
			monthNamesShort: [_('Jan'),_('Feb'),_('Mar'),_('Apr'),_('May'),_('Jun'),_('Jul'),_('Aug'),_('Sep'),_('Oct'),_('Nov'),_('Dec')],
			dayNames: [_('Sunday'),_('Monday'),_('Tuesday'),_('Wednesday'),_('Thursday'),_('Friday'),_('Saturday')],
			dayNamesShort: [_('Sun'),_('Mon'),_('Tue'),_('Wed'),_('Thu'),_('Fri'),_('Sat')],
			buttonText: {
				month: _('month'),
				week: _('week'),
				day: _('day')
			},
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
				var offset = $(this).offset();
				var x = offset.left + ($(this).width() / 2);
				var y = offset.top + ($(this).height() / 2);	
				$('#popupBooking ul').empty();
				var dateStr = event.start.toString('yyyy-MM-dd');
				var $li = $('<li data-role="divider" data-theme="c">' + dateStr + '</li>');
				$('#popupBooking ul').append($li);
				var sameDateEvents = Tools.getSameDayEvents(event);
				for(var i = 0; i < sameDateEvents.length; i++){
					var e = sameDateEvents[i];
					var service = e.title;
					var timeStr = e.start.toString('hh:mm tt');
					if(timeStr == '00:00 AM'){
						timeStr = 'All day';
					}
					var url = '#';

					if($.inArray('fc-massage', e.className) == 0){
						url = 'massage_booking.html';
					}else if($.inArray('fc-homeclean', e.className) == 0){
						url = 'cleaner_booking.html';
					}else if($.inArray('fc-carwash', e.className) == 0){
						url = 'carwash_booking.html';
					}else if($.inArray('fc-babysitting', e.className) == 0){
						url = 'baby_sitting_booking.html';
					}else if($.inArray('fc-carservice', e.className) == 0){
						url = 'carservice_booking.html';
					}else if($.inArray('fc-dryclean', e.className) == 0){
						url = 'dryclean_booking.html';
					}else if($.inArray('fc-removal', e.className) == 0){
						url = 'removal_booking.html';
					}else if($.inArray('fc-buildingclean', e.className) == 0){
						url = 'building_clean_booking.html';
					}else if($.inArray('fc-buildingservice', e.className) == 0){
						url = 'building_service_booking.html';
					}else if($.inArray('fc-dogwalking', e.className) == 0){
						url = 'dogwalking_booking.html';
					}else if($.inArray('fc-personaltraining', e.className) == 0){
						url = 'personal_training_booking.html';
					}else if($.inArray('fc-chiropractor', e.className) == 0){
						url = 'chiropractor_booking.html';
					}else if($.inArray('fc-takeaway', e.className) == 0){
						url = 'takeaway_booking.html';
					}
					
					$li = $('<li><a href="' + url + '" data-id=' + e.id + '>' + timeStr + ' - ' + service+ '</a></li>');
					$li.find('a').click(function(){
						var id = $(this).data('id');
						var eventArr = $.grep(Tools.events, function(e){ return e.id == id; });
						if(eventArr.length == 0){
							return false;
						}else{
							Main.currentEvent = eventArr[0];
						}
					});
					$('#popupBooking ul').append($li);
				}
				$('#popupBooking ul').listview('refresh');		
				$('#popupBooking').popup('open', {x:x, y:y});
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
		};
		
		$('#calendar').fullCalendar(options);

		$('#calendar').fullCalendar( 'addEventSource', function(start, end, callback){
			var startStr = start.toString('yyyy-MM-dd');
			var endStr = end.toString('yyyy-MM-dd');
			if(Main.test){
				var data = [{"id":1,"start":"2013-04-08T11:00:00","end":"2013-04-08T15:00:00","type":4},{"id":2,"start":"2013-04-08T13:00:00", "end":"2013-04-08T16:00:00", "type":3}];
				Tools.generateEvents(data);	
				callback(Tools.events);				
			}else{
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
						Tools.generateEvents(response);						
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
			}
		});
	},
	generateEvents: function(response){
		Tools.events = new Array();
		for(var i = 0; i < response.length; i++){
			var booking = response[i];
			var bookingStart = Date.parse(booking.start);
			var bookingAllDay = false;
			var bookingEnd = null;
			if(booking.end == ''){
				bookingAllDay = true;
			}else{
				bookingEnd = Date.parse(booking.end);
			}
			var bookingType = booking.type;
			var title = '';
			var className = '';
			switch(bookingType){
				case 0:
					title = _('Dry Clean');
					className = 'fc-dryclean';
					break;
				case 1:
					title = _('Car Wash');
					className = 'fc-carwash';
					break;
				case 2:
					title = _('Home Clean');
					className = 'fc-homeclean';
					break;
				case 3:
					title = _('Baby Sitting');
					className = 'fc-babysitting';
					break;
				case 4:
					title = _('Massage');
					className = 'fc-massage';
					break;
				case 5:
					title = _('Car Service');
					className = 'fc-carservice';
					break;
				case 6:
					title = _('House Removal');
					className = 'fc-removal';
					break;
				case 7:
					title = _('Building Clean');
					className = 'fc-buildingclean';
					break;
				case 8:
					title = _('Building Service');
					className = 'fc-buildingservice';
					break;
				case 9:
					title = _('Take Away');
					className = 'fc-takeaway';
					break;
				case 10:
					title = _('Dog Walking');
					className = 'fc-dogwalking';
					break;
				case 11:
					title = _('Personal Training');
					className = 'fc-personaltraining';
					break;
				case 12:
					title = _('Chiropractor');
					className = 'fc-chiropractor';
					break;
			}
			var event = {
				id: booking.id,
				title: title,
				start: bookingStart,
				end: bookingEnd,
				allDay: bookingAllDay,
				className: [className]
			}
			Tools.events.push(event);
		}
	},
	initScheduleCalendar:function(){
		$('#schedule-calendar').fullCalendar({
			minTime: 7,
			maxTime: 19,
			header: {
				left: 'prev,next',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			monthNames: [_('January'),_('February'),_('March'),_('April'),_('May'),_('June'), _('July'),_('August'),_('September'),_('October'),_('November'),_('December')],
			monthNamesShort: [_('Jan'),_('Feb'),_('Mar'),_('Apr'),_('May'),_('Jun'),_('Jul'),_('Aug'),_('Sep'),_('Oct'),_('Nov'),_('Dec')],
			dayNames: [_('Sunday'),_('Monday'),_('Tuesday'),_('Wednesday'),_('Thursday'),_('Friday'),_('Saturday')],
			dayNamesShort: [_('Sun'),_('Mon'),_('Tue'),_('Wed'),_('Thu'),_('Fri'),_('Sat')],
			buttonText: {
				month: _('month'),
				week: _('week'),
				day: _('day')
			},
			dayClick:function(date, allDay, jsEvent, view){				
				$('#schedule-calendar')
					.fullCalendar('changeView', 'agendaDay')
					.fullCalendar('gotoDate',
						date.getFullYear(), date.getMonth(), date.getDate());
			},
			eventClick:function(event, jsEvent, view){
				
			},
			viewDisplay:function(view){

			}
		});
		
		$('#schedule-calendar').fullCalendar( 'addEventSource', function(start, end, callback){
			var startStr = start.toString('yyyy-MM-dd');
			var endStr = end.toString('yyyy-MM-dd');
			if(Main.test){
								
			}else{
				Main.loading = true;
				$.mobile.loading('show');
				$.ajax({
					type: 'POST',
					contentType: 'application/json',
					url: Main.apiRoot + 'person/schedule',
					dataType: "json",
					beforeSend: function (request) {
						request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
					},
					data: '{"start":"' + startStr + '", "end":"' + endStr + '", "id":' + ServiceLookup.currentPersonId + '}',
					success: function (response) {
						Tools.generateEvents(response);						
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
			}
		});
	},
	getSameDayEvents:function(event){
		var date = event.start.toString('M/d/yyyy');
		var sameDateEvents = [];
		for(var i = 0; i < Tools.events.length; i++){
			var eventDate = Tools.events[i].start.toString('M/d/yyyy');
			if(date == eventDate){
				sameDateEvents.push(Tools.events[i]);
			}
		}
		return sameDateEvents;
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
		$('#page-settings').live('pageshow', function(){
			$('#btn-logout').click(function(){
				//window.localStorage.clear();
				window.localStorage.removeItem('unit');
				window.localStorage.removeItem('password');
				Login.init();
				$.mobile.changePage('login.html');
			});
		});

		Language.init();
		Account.init();
	}
}

var Account = {
	count:0,
	init:function(){
		var html = '<div class="ui-body ui-body-c resident">' +
						'<div data-role="fieldcontain">' + 
							'<label for="name-{0}">' + _('Name') + ':</label>' +
							'<input type="text" name="name" id="name-{0}" value="{1}" />' +
						'</div>' + 
						'<div data-role="fieldcontain">' +
							'<label for="email-{0}">Email:</label>' + 
							'<input type="text" name="email" id="email-{0}" value="{2}"  />' +
						'</div>' +
						'<div data-role="fieldcontain">' +
							'<label for="mobile-{0}">' + _('Mobile') + ':</label>' +
							'<input type="text" name="mobile" id="mobile-{0}" value="{3}"  />' +
						'</div>' +
						'<div data-role="fieldcontain">' +
							'<a href="#" data-role="button" data-icon="minus" data-inline="true" class="btn-remove">' + _('Remove') + '</a>' +
						'</div>' +
					'</div>';
		$('#page-account').live('pageshow', function(){
			Main.loading = true;
			$.mobile.loading('show');
			$.ajax({
				type: 'GET',
				url: Main.apiRoot + 'apartment/',
				dataType: "json",
				beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
				},
				success: function (response) {
					$('#unit').text(response.unit);
					var residents = response.residents;
					Account.count = residents.length;
					for(var i = 0; i < residents.length; i++){
						var resident = residents[i];
						var block = html.replace(/\{0\}/g, i.toString())
							.replace('{1}', resident.name)
							.replace('{2}', resident.email)
							.replace('{3}', resident.mobile);
						$('#resident-list').append($(block));
					}
					
					$('#page-account').trigger('create');
				},
				error: function (request, status, error) {
					console.log(request.responseText);
				},
				complete:function(){
					Main.loading = false;
					$.mobile.loading('hide');
				}
			});
		
			$('#btn-add').unbind().click(function(){
				var block = html.replace(/\{0\}/g, Account.count.toString())
							.replace('{1}', '')
							.replace('{2}', '')
							.replace('{3}', '');
				$('#resident-list').append($(block));
				$('#page-account').trigger('create');
				Account.count++;
			});
			
			$('.btn-remove').die().live('click', function(){
				if($('div.resident').length <= 1){
					return;
				}
				$(this).parents('div.resident').remove();
			});
			
			$('#btn-save').unbind().click(function(){
				var $residents = $('div.resident');
				if($residents.length == 0){
					alert('Please leave at least one contact.');
					return;
				}
				
				var valid = true;
				var json = '';
				$('#resident-list input.error').removeClass('error');
				$residents.each(function(){
					var residentJson = '{"name":"{0}", "email":"{1}", "mobile":"{2}"}';
					var $name = $(this).find('input[name="name"]');
					if($.trim($name.val()).length == 0){
						$name.addClass('error');
						valid = false;
					}else{
						residentJson = residentJson.replace('{0}', $.trim($name.val()));
					}
					
					var $email = $(this).find('input[name="email"]');
					if($.trim($email.val()).length == 0){
						$email.addClass('error');
						valid = false;
					}else{
						residentJson = residentJson.replace('{1}', $.trim($email.val()));
					}
					
					var $mobile = $(this).find('input[name="mobile"]');
					if($.trim($mobile.val()).length == 0){
						$mobile.addClass('error');
						valid = false;
					}else{
						residentJson = residentJson.replace('{2}', $.trim($mobile.val()));
					}
					
					json += residentJson + ',';
				});
				
				if(valid){
					json = json.substr(0, json.length - 1);
					json = '{"residents":[' + json + ']}';
					Main.loading = true;
					$.mobile.loading('show');
					$.ajax({
						type: 'POST',
						contentType: 'application/json',
						url: Main.apiRoot + 'apartment/update',
						dataType: "json",
						beforeSend: function (request) {
							request.setRequestHeader("Authorization", "Basic " + Tools.encodeBase64(Main.unit + ':' + Main.password));
						},
						data: json,
						success: function (response) {
							$.mobile.changePage('../settings.html', {reverse: true});
						},
						error: function (request, status, error) {
							console.log(request.responseText);
						},
						complete:function(){
							Main.loading = false;
							$.mobile.loading('hide');
						}
					});
				}
			});
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
				
				$('#btn-save').unbind().click(function(){
					language = $('#page-language input:checked').val();
					window.localStorage['language'] = language;
					$.mobile.changePage('../settings.html', {reverse: true});
				});
			});
		}
	},
	translate:function(){
		if(language != 'en'){
			$('[data-translate="true"]').each(function(){
				$this = $(this);
				if($this.find('.ui-btn-text').length > 0){
					$this = $this.find('.ui-btn-text');
				}
				var text = $this.text();
				$this.text(_(text));
			});
		}
	}
}
