function _(s) {
	switch(language){
		case 'zh':
			if (typeof(zh) != 'undefined' && zh[s]) {
				return zh[s];
			}
			break;
		case 'kr':
			if (typeof(kr) != 'undefined' && kr[s]) {
				return kr[s];
			}
			break;
		case 'jp':
			if (typeof(jp) != 'undefined' && jp[s]) {
				return jp[s];
			}
			break;
		default:
			return s;
			break;
	}
}

function _date(s){
	if(language == 'zh'){
		var sg = s.split(' ');
		for(var i = 0; i < sg.length; i ++){
			sg[i] = _(sg[i]);
		}
		return sg.join(' ');
	}
	return s;
}

var zh = {
	//Menu
	'Add Clothes':'添加物件',
	'Add Contact':'添加联系人',
	'Add Meal':'添加外卖',
	'Additional Information':'补充说明',
	'Back':'返回',
	'Baby Sitter':'保姆',
	'Baby Sitting':'婴儿照顾',
	'Book Now': '预约',
	'Booking':'预约',
	'Building Clean':'大楼清洁',
	'Building Service': '公寓服务',
	'Cancel Booking':'取消预约',
	'Car Services':'汽车服务',
	'Car Wash':'洗车',
	'Chiropractor':'正骨',
	'Cleaner':'清洁人员',
	'Contact':'联系人',
	'Date and Time':'日期与时间',
	'Date':'日期',
	'Dog Walking':'遛狗',
	'Door Passcode': '公寓临时密码',
	'Dry Clean':'干洗',
	'Grocery':'在线商店',
	'Help':'帮助',
	'Home':'首页',
	'Home Clean':'清洁',
	'House Removal': '搬家预约',
	'Items':'物件',
	'Language':'语言',
	'Logout':'注销',
	'Massage':'按摩',
	'Masseur': '按摩师',
	'Meals':'已点外卖',
	'My Account': '账户',
	'Mobile':'手机',
	'Most popular search':'常用搜索',
	'Name':'姓名',
	'Pay Now':'付款',
	'Personal Training':'健身',
	'Preferred Time':'时间',
	'Remove':'删除',
	'Save': '保存',
	'Schedule': '日程安排',
	'Select Time':'选择时间',
	'Service Lookup':'服务搜索',
	'Services': '服务项目',
	'Settings': '设置',
	'Take Away':'外卖',
	'Total':'总额',
	'Trainer':'训练师',
	'Walker':'遛狗人员',
	
	//Month
	'January': '一月',
	'February': '二月',
	'March': '三月',
	'April': '四月',
	'May': '五月',
	'June': '六月',
	'July': '七月',
	'August': '八月',
	'September': '九月',
	'October': '十月',
	'November': '十一月',
	'December': '十二月',
	
	'Jan': '一月',
	'Feb': '二月',
	'Mar': '三月',
	'Apr': '四月',
	'May': '五月',
	'Jun': '六月',
	'Jul': '七月',
	'Aug': '八月',
	'Sep': '九月',
	'Oct': '十月',
	'Nov': '十一月',
	'Dec': '十二月',
	
	//Week
	'Sunday': '周日',
	'Monday': '周一',
	'Tuesday': '周二',
	'Wednesday': '周三',
	'Thursday': '周四',
	'Friday': '周五',
	'Saturday': '周六',
	
	'Sun': '周日',
	'Mon': '周一',
	'Tue': '周二',
	'Wed': '周三',
	'Thu': '周四',
	'Fri': '周五',
	'Sat': '周六',
	
	'month':'月',
	'week':'周',
	'day':'日'
};

var kr = {
	//Menu
	'Add Clothes':'의류 선택',
	'Add Contact':'연락처 추가',
	'Add Meal':'음식 선택',
	'Additional Information':'추가 정보',
	'Back':'뒤로',
	'Baby Sitter':'보모',
	'Baby Sitting':'아기 돌보기',
	'Book Now': '지금 예약',
	'Booking':'예약',
	'Building Clean':'빌딩 청소',
	'Building Service': '빌딩 서비스',
	'Cancel Booking':'예약 취소',
	'Car Services':'차량 서비스',
	'Car Wash':'세차',
	'Chiropractor':'카이로프랙터',
	'Cleaner':'청소부',
	'Contact':'연락처',
	'Date and Time':'날짜와 시간',
	'Date':'날짜',
	'Dog Walking':'애완견 산책',
	'Door Passcode': '도어 비밀번호',
	'Dry Clean':'세탁',
	'Grocery':'식료품',
	'Help':'도움말',
	'Home':'집',
	'Home Clean':'집청소',
	'House Removal': '이사',
	'Items':'항목',
	'Language':'언어',
	'Logout':'나가기',
	'Massage':'마사지',
	'Masseur': '안마사',
	'Meals':'음식',
	'My Account': '내구좌',
	'Mobile':'핸드폰',
	'Most popular search':'최고 인기 검색',
	'Name':'성함',
	'Pay Now':'지금 결재',
	'Personal Training':'개인 교습',
	'Preferred Time':'선호 시간',
	'Remove':'삭제',
	'Save': '저장',
	'Schedule': '일정',
	'Select Time':'시간 선택',
	'Service Lookup':'서비스 둘러보기',
	'Services': '서비스 항목',
	'Settings': '설정',
	'Take Away':'테이크어웨이',
	'Total':'합계',
	'Trainer':'강사',
	'Walker':'산책 동반자',
	
	//Month
	'January': '1월',
	'February': '2월',
	'March': '3월',
	'April': '4월',
	'May': '5월',
	'June': '6월',
	'July': '7월',
	'August': '8월',
	'September': '9월',
	'October': '10월',
	'November': '11월',
	'December': '12월',
	
	'Jan': '1월',
	'Feb': '2월',
	'Mar': '3월',
	'Apr': '4월',
	'May': '5월',
	'Jun': '6월',
	'Jul': '7월',
	'Aug': '8월',
	'Sep': '9월',
	'Oct': '10월',
	'Nov': '11월',
	'Dec': '12월',
	
	//Week
	'Sunday': '일요일',
	'Monday': '월요일',
	'Tuesday': '화요일',
	'Wednesday': '수요일',
	'Thursday': '목요일',
	'Friday': '금요일',
	'Saturday': '토요일',
	
	'Sun': '일요일',
	'Mon': '월요일',
	'Tue': '화요일',
	'Wed': '수요일',
	'Thu': '목요일',
	'Fri': '금요일',
	'Sat': '토요일',
	
	'month':'월',
	'week':'주',
	'day':'일'
};

var jp = {
	//Menu
	'Add Clothes':'追加衣服',
	'Add Contact':'追加コンタクト',
	'Add Meal':'追加食事',
	'Additional Information':'追加のインフォメーション',
	'Back':'戻る',
	'Baby Sitter':'ベビーシッター',
	'Baby Sitting':'子守り',
	'Book Now': '今、予約する',
	'Booking':'予約する',
	'Building Clean':'建物掃除',
	'Building Service': '建物点検、修理',
	'Cancel Booking':'予約キャンセル',
	'Car Services':'車点検',
	'Car Wash':'洗車',
	'Chiropractor':'指圧師',
	'Cleaner':'クリーナー',
	'Contact':'コンタクト',
	'Date and Time':'日時',
	'Date':'日',
	'Dog Walking':'犬散歩',
	'Door Passcode': 'ドアコード',
	'Dry Clean':'ドライクリーン',
	'Grocery':'食料品',
	'Help':'手伝う',
	'Home':'家',
	'Home Clean':'掃除',
	'House Removal': '転居',
	'Items':'物',
	'Language':'言葉',
	'Logout':'ログアウト',
	'Massage':'メッセージ',
	'Masseur': 'マッサージ師',
	'Meals':'食事',
	'My Account': 'マイアカウント',
	'Mobile':'携帯',
	'Most popular search':'一番人気検索',
	'Name':'名前',
	'Pay Now':'今支払う',
	'Personal Training':'パーソナルトレーニング',
	'Preferred Time':'希望時間',
	'Remove':'移動',
	'Save': '保管',
	'Schedule': 'スケジュール',
	'Select Time':'時間選択',
	'Service Lookup':'検索サービス',
	'Services': 'サービス',
	'Settings': '設定',
	'Take Away':'持ち帰り',
	'Total':'合計',
	'Trainer':'トレーナー',
	'Walker':'散歩する人',
	
	//Month
	'January': '一月',
	'February': '二月',
	'March': '三月',
	'April': '四月',
	'May': '五月',
	'June': '六月',
	'July': '七月',
	'August': '八月',
	'September': '九月',
	'October': '十月',
	'November': '十一月',
	'December': '十二月',
	
	'Jan': '一月',
	'Feb': '二月',
	'Mar': '三月',
	'Apr': '四月',
	'May': '五月',
	'Jun': '六月',
	'Jul': '七月',
	'Aug': '八月',
	'Sep': '九月',
	'Oct': '十月',
	'Nov': '十一月',
	'Dec': '十二月',
	
	//Week
	'Sunday': '日曜日',
	'Monday': '月曜日',
	'Tuesday': '火曜日',
	'Wednesday': '水曜日',
	'Thursday': '木曜日',
	'Friday': '金曜日',
	'Saturday': '土曜日',
	
	'Sun': '日',
	'Mon': '月',
	'Tue': '火',
	'Wed': '水',
	'Thu': '水',
	'Fri': '金',
	'Sat': '土',
	
	'month':'月',
	'week':'週',
	'day':'日'
};
