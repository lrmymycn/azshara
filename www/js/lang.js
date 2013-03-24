function _(s) {
	if(language == 'zh'){
		if (typeof(zh) != 'undefined' && zh[s]) {
			return zh[s];
		}
	}
	return s;
}

var zh = {
	'Grocery':'购物',
	'Takeaway':'外卖',
	'Taxi':'出租车',
	'Dry Clean':'干洗',
	'Car Wash':'洗车',
	'Home Clean':'清洁',
	'Car Services':'汽车服务',
	'Baby Sitting':'保姆',
	'Massage':'按摩',
	'Chiropractor':'正骨'
}