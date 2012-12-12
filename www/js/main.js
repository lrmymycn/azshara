var language = window.localStorage['language'];
if(language == null || language == ''){
	language = 'en';
}

head.js("js/jquery.js", "js/jquery-ui.min.js", "js/jquery.mobile.js", "js/jquery.validate.min.js", "js/date.js", "js/slider.min.js","js/fullcalendar.js", 'js/lang.js', function() {
   Main.init();
});

var Main = {
	username:'',
	password:'',
	test:true,
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
			
			Tools.initCalendar();
		});
	},
	loadConfig:function(){
		$.support.cors = true;
		$.mobile.allowCrossDomainPages = true;
		$.mobile.defaultPageTransition = 'slide';		
	},
	getLoginStatus:function(){
		Main.username = window.localStorage['username'];
		Main.password = window.localStorage['password'];
		
		if(Main.test == true){
			Main.username = 'test';
			Main.password = 'test';
		}
		
		if(Main.username == null || Main.password == null){
			Login.init();
			$.mobile.changePage('login.html', {transition:'none'});
		}else{
			$.mobile.changePage('home.html', {transition:'none'});
		}
	}
}

var Home = {
	init:function(){
		$('#page-home').live('pagecreate', function(){
			$('#span-username').text(Main.username);
			
			Home.slider();
			
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
	datetime:null,
	price:0,
	init:function(){
		$('#page-massage').live('pagecreate', function(){
			if(Massage.datetime != null){
				$('#text-datetime').text(Massage.datetime.toString('dddd, d MMMM yyyy hh:mm tt'));
			}
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

var Tools = {
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
		$('#page-calendar').live('pageshow', function(){
			
			if(!$('#calendar').hasClass('fc')){
				$('#calendar').fullCalendar({
					dayClick:function(date, allDay, jsEvent, view){
						if(!$(this).hasClass('disabled')){
							Massage.datetime = date;
							$.mobile.changePage('time.html');
						}
					}
				});
				
				//custom calendar
				$('#calendar td').each(function(){
					if($(this).hasClass('fc-today')){
						return false;
					}else{
						$(this).addClass('disabled');
					}
				});
			}
		});
		$('#page-time').live('pageshow', function(){
			$('#btn-select').click(function(){
				var hours = $('#page-time input:checked').val();
				Massage.datetime.addHours(hours);
				$.mobile.changePage('../massage.html');
			});
		});
	},
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
						$.ajax({
							url: "http://www.webility.com.au/post.php",
							data: $('#form-login').serialize(),
							success: function(data){
								Main.username = $('#form-login input#username').val();
								Main.password = $('#form-login input#password').val();
								window.localStorage['username'] = Main.username;
								window.localStorage['password'] = Main.password;					
								$.mobile.changePage('home.html');
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
				window.localStorage.removeItem('username');
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
