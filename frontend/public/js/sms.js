// SMS 페이지 로드 될때
function onLoadSmsPage() {
	$("#examViewBtn").attr('style', 'visibility:hidden');
	//$("#examRemoveBtn").attr('style', 'visibility:hidden');
	
//	var btn = $("#examViewBtn");
//	if (btn.css("visibility") == 'hidden') {
//		btn.css("visibility", "visible");
//	}
	
	$("#selTypeText").show();
	$("#selTypeExcel").hide();
	$("#selTypeHand").hide();
	$("#excelWarning").hide();
	
	
	var browserName = checkBrowser(); 
	
	if (browserName == 'ie' || browserName == 'ie10') {
		alert("'익스플로러' 는 지원하지 않습니다. \n구글 '크롬' 을 사용해주세요!");
		window.history.go(-1);
	}else{
		if (browserName != 'chrome') {
			//alert("'크롬' 을 사용하지 않으면 파일검증 기능이 제대로 작동하지 않을 수 있습니다.");
			alert("타 브라우저는 지원하지 않습니다. \n구글 '크롬' 을 사용해주세요!");
			history.back();
		}
	}
	
}

// 통계 페이지 로드 될때..
function onLoadStatPage() {
	$("#dayStat").show();
	$("#monthStat").hide();
	
	$('#smsStartDatePicker').datepicker({
       	format:'yyyy-mm-dd',
            "autoclose": true
       });
	if($("#smsStartDatePicker").val() == ''){
		$("#smsStartDatePicker").datepicker('update',new Date());
	}
	
	$('#smsEndDatePicker').datepicker({
       	format:'yyyy-mm-dd',
        "autoclose": true
       });
	if($("#smsEndDatePicker").val() == ''){
		$("#smsEndDatePicker").datepicker('update',new Date());
	}

	if($("#senderMonthPicker").val() == ''){
		$("#senderMonthPicker").val(_getYearMonth());
	}
	
}

// 검증페이지 로드될때..
function onLoadExaminePage(sendKey, senderName, totalCnt, tableName) {
	//sendkey=" + sendKey + "&sendername=" + senderName;
	
	console.log("$sendKey: " + sendKey);
	console.log("$senderName: " + senderName);
	console.log("$totalCnt: " + totalCnt);
	console.log("$tableName: " + tableName);
	
	showExamineResults(jQuery.trim(sendKey), jQuery.trim(senderName), jQuery.trim(totalCnt), jQuery.trim(tableName));
}


// 통계조회 페이지 열기 
function openStatPop(){
	var url = "openSmsStat";
	common.popup2(url, '통계조회', 1280, 720);
}


// 통계조회 시 일별/월별 선택
function selectStatType(type) {
	if ('month' == type) {  //월별
		$("#dayStat").hide();
		$("#monthStat").show();
		
		if($("#smsMonthPicker").val() == ''){
			$("#smsMonthPicker").val(_getYearMonth());
		}
		
	}else{  //일별
		$("#dayStat").show();
		$("#monthStat").hide();
	}
	
	dwr.util.removeAllRows("sendStatTbody");
	$("#searchSmsStatus").show();
	$("#searchSmsStatus").html("(검색 조건을 입력하세요)");
}

//발송 타입 선택시 (radio)
function selectMsgType(type) {
	if ('sms' == type) {
		$(".kakaomenu").hide();
		$(".kakaomenu input").val('');
	}
	else if ('lms' == type) {
		$(".kakaomenu").hide();
		$(".kakaomenu input").val('');
	}
	else if ('kakao' == type) {
		$(".kakaomenu").show();
		$(".kakaomenu input").val('');
		$("#kakaoKey").val('779a65ee9f8242b6bd982e799211ad3d8d3c03da');
	}	
}

// 검증방식 선택시 (radio)
function selectExamineType(type) {
	if ('text' == type) {
		$("#selTypeExcel").hide();
		$("#selTypeHand").hide();
		$("#selTypeText").show();
		$("#excelWarning").hide();
	}
	else if ('excel' == type) {
		$("#selTypeText").hide();
		$("#selTypeHand").hide();
		$("#selTypeExcel").show();
		$("#excelWarning").show();
	}
	else if ('hand' == type) {
		$("#selTypeText").hide();
		$("#selTypeExcel").hide();
		$("#selTypeHand").show();
		$("#excelWarning").hide();
	}	
	
	resetInformations();
}


function _getYearMonth() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	//var day = date.getDate();
	
	if (("" + month).length == 1) {month = "0" + month;}
	//if (("" + day).length == 1) {day = "0" + day;}
	
	return ("" + year + "-" + month);
}

// 통계조회 데이터 셀 정보
var sendStatCellFuncs = [
                        function(data) {return data.cust;},
                    	function(data) {return data.sendId;},
                    	function(data) {return data.jobDate.replace(".0", "");},
                    	function(data) {return data.description;},
                    	function(data) {return data.total;},
                    	function(data) {return data.success;},
                    	function(data) {return data.failed;},
                    	function(data) {return data.queue;},
                    ];

//발송이력 데이터 셀 정보
var senderCellFuncs = [
                        function(data) {return data.cust;},
                    	function(data) {return data.sendId;},
                    	function(data) {return data.jobDate.replace(".0", "");},
                    	function(data) {return data.description;},
                    ];

//검증데이터 셀 정보
var examineCellFuncs1 = [
	                   	function(data) {return data.rank;},
	                   	function(data) {return data.dstaddr;}
	                  ];

var examineCellFuncs2 = [
                        function(data) {return data.ext_col0;},
 	                   	function(data) {return data.dstaddr;}
 	                  ];



// 통계조회 시간 검증 - 월 조회
function checkMonth() {
	var date = string.getOnlyNumberString($("#smsMonthPicker").val());
	
	if(date.length < 6) {
		alert("조회 일자가 잘못되었습니다.");
		return false;
	}
}

// 통계조회 시간 검증 - 발송이력 조회 용
function checkMonth2() {
	var date = string.getOnlyNumberString($("#senderMonthPicker").val());
	
	if(date.length < 6) {
		alert("조회 일자가 잘못되었습니다.");
		return false;
	}
}

// 통계조회 시간 검증 - 일 조회 
function checkStartEndDateTime(){
	var startDate = string.getOnlyNumberString($("#smsStartDatePicker").val());
	var endDate = string.getOnlyNumberString($("#smsEndDatePicker").val());

	if(startDate.length != 8){
		alert("조회 시작일이 잘못되었습니다.");
		return false;
	}
	if(endDate.length != 8){
		alert("조회 종료일이 잘못되었습니다.");
		return false;
	}
	
	if(startDate != endDate){
		if(startDate > endDate){
			alert("시작일이 종료일보다 나중일 수 없습니다.");
			return false;
		}
	}
	
	if (startDate.substring(4, 6) != endDate.substring(4, 6)) {
		alert("시작일과 종료일의 년/월은 동일해야 합니다.");
		return false;
	}
	
	return true;
}

// 통계 조회 
function getDayStatList(type){
	var isMonth = false;
	
	if ('month' == type) {  //월 조회
		isMonth = true;
		if (checkMonth() == false) {
			return;
		}
	}else{  //일 조회
		isMonth = false;
		if (checkStartEndDateTime() == false){
			return;
		}
	}
	
	SmsService.getDaySendStatList(
			$("#sendKey").val()
			, $('#senderName').val()
			, isMonth == true ? $('#smsMonthPicker').val() : $('#smsStartDatePicker').val()
			, isMonth == true ? '' : $('#smsEndDatePicker').val()
			
			, function(data){
				if(data != null){
					if(data.length > 0){
						if (data[0].resultCode == '1146') {
							dwr.util.removeAllRows("sendStatTbody");
							$("#searchSmsStatus").show();
							$("#searchSmsStatus").html("입력된 기간에 해당하는 테이블이 없습니다. 년/월을 확인하세요!");
						}
						else{
							$("#searchSmsStatus").hide();
							dwr.util.removeAllRows("sendStatTbody");
							dwr.util.addRows("sendStatTbody", data, sendStatCellFuncs, tableController.tableCreator);							
						}
					}
					else{
						dwr.util.removeAllRows("sendStatTbody");
						$("#searchSmsStatus").show();
						$("#searchSmsStatus").html("해당 조건에 맞는 데이터가 존재하지 않습니다.");
					}
				}else{
					alert("통계 조회 중 기타에러 발생!");
				}
			});
}

// 발송이력 조회
function getSenderList() {
	if (checkMonth2() == false) {
		return;
	}
	
	SmsService.getSenderList(
			$("#senderSendKey").val()
			, $('#senderSenderName').val()
			, $('#senderMonthPicker').val()
			
			, function(data){
				if(data != null){
					if(data.length > 0){
						$("#searchSenderStatus").hide();
						dwr.util.removeAllRows("senderTbody");
						dwr.util.addRows("senderTbody", data, senderCellFuncs, tableController.tableCreator);							
					}
					else{
						dwr.util.removeAllRows("senderTbody");
						$("#searchSenderStatus").show();
						$("#searchSenderStatus").html("해당 조건에 맞는 데이터가 존재하지 않습니다.");
					}
				}else{
					alert("발송이력 조회 중 기타에러 발생!");
				}
	});
	
}

// 전화번호 입력 textarea 에 숫자만 들어가도록 제어하는 함수 
function numbersOnly(e, decimal) {
    var key;
    var keychar;

    if (window.event) {
        key = window.event.keyCode;
    } else if (e) {
        key = e.which;
    } else {
        return true;
    }
    keychar = String.fromCharCode(key);

    if ((key == null) || (key == 0) || (key == 8) || (key == 9) || (key == 13) || (key == 27) ) {  
             //|| (key == 45) ){
        return true;
    } else if ((("0123456789").indexOf(keychar) > -1)) {
        return true;
    } else if (decimal && (keychar == ".")) {
        return true;
    } else
        return false;
}


function downloadExcelFormat(){
	SmsService.downloadExcelFormat(
		function(data){
			if(data != null){
				dwr.engine.openInDownload(data);
			}
			else{
				alert("엑셀 양식 파일 다운로드에 실패했습니다.");
			}
	});
}

// 리셋버튼 클릭시
function cleanMsgData() {
	window.location.reload(true);
	
//	$('#sendKey').val('');
//	$('#senderName').val('');
//	$('#description').val('');
//	$('#callback').val('');
//	$('#sendSubject').val('');
//	$('#testDstNumbers').val('');
//	$('#dstNumbers').val('');
//	$('#dstNumberExcelFile').val('');
//	$('#dstNumberTextFile').val('');
//	$("input[type='radio'][name='sendType'][value=1]").click();
//	
//	resetInformations();
}




/* 테스트 발송 */
function sendMessageTest(){
	if ($('#senderName').val() == ''){
		alert("의뢰자를 선택해주세요.");
		return false;
	}
	
	if ($('#callback').val() == ''){
		alert("callback 번호를 입력해 주세요.");
		return false;
	}
	
	var sendType = $("input[type='radio'][name='sendType']:checked").val();  //1:sms, 3:lms, 7:친구톡-text
	
	if (sendType == '3') {
		if ($('#sendSubject').val() == ''){
			alert("제목을 입력해 주세요.");
			return false;
		}
	}
	else if (sendType == '7') {
		if ($('#kakaoKey').val() == ''){
			alert("친구톡 Sender-Key 를 입력해 주세요.");
			return false;
		}
		
		var pat = /^https?:\/\//i;  //URI scheme 체크
		if ( $('#kakaoLink').val() == '' || pat.test($('#kakaoLink').val()) ) {
			//ok
		}else{
			alert("친구톡 URL 링크 형식이 잘못되었습니다.");
			return false;
		}
	}
	
	if ($('#sendText').val() == ''){
		alert("본문을 입력해 주세요.");
		return false;
	}
	
	if ($('#testDstNumbers').val() == ''){
		alert("수신자 번호를 입력해 주세요.");
		return false;
	}
	
	
	SmsService.sendMessageTest(
			sendType,
			jQuery.trim($("#senderName").val()),
			jQuery.trim($("#callback").val()),
			jQuery.trim($("#sendSubject").val()),
			$("#sendText").val(),
			jQuery.trim($("#testDstNumbers").val()),
			sendType == '7' ? jQuery.trim($("#kakaoKey").val()) : null,
			sendType == '7' ? jQuery.trim($("#kakaoBtnName").val()) : null,
			sendType == '7' ? jQuery.trim($("#kakaoLink").val()) : null,
			function(data){
				if(data != null){
					if(data.resultCode == '00'){
						alert("테스트 메시지 발송을 요청하였습니다.");
					}else{
						alert(data.resultMessage);
					}
				}else{
					alert("테스트 메시지 발송 중 기타에러 발생!");
				}
		});
}

/* 실제 발송 */
function sendMessageReal(){
	var examineType = $("input[type='radio'][name='optionsRadios']:checked").val();
	var examBtn = $("#examViewBtn");
	
	if ($("#actionStatus").html() != ""){
		alert("진행중인 작업이 있습니다. 잠시 후 다시 시도하세요.");
		return;
	}
	
	if (examineType != 'hand' && examBtn.css("visibility") != 'visible') {
		alert("수신자 파일 검증을 먼저 해야합니다.");
		return false;
	}
	
	if ($('#sendKey').val() == ''){
		alert("발송구분 key를 입력해주세요.");
		return false;
	}
	
	if ($('#senderName').val() == ''){
		alert("의뢰자를 선택해주세요.");
		return false;
	}
	
	if ($('#callback').val() == ''){
		alert("callback 번호를 입력해 주세요.");
		return false;
	}
	
	var sendType = $("input[type='radio'][name='sendType']:checked").val();  //1:sms, 3:lms, 7:친구톡-text
	
	if (sendType == '3') {
		if ($('#sendSubject').val() == ''){
			alert("제목을 입력해 주세요.");
			return false;
		}
	} 
	else if (sendType == '7') {
		if ($('#kakaoKey').val() == ''){
			alert("친구톡 Sender-Key 를 입력해 주세요.");
			return false;
		}
		
		var pat = /^https?:\/\//i;  //URI scheme 체크
		if ( $('#kakaoLink').val() == '' || pat.test($('#kakaoLink').val()) ) {
			//ok
		}else{
			alert("친구톡 URL 링크 형식이 잘못되었습니다.");
			return false;
		}
	}
	
	if ($('#sendText').val() == ''){
		alert("본문을 입력해 주세요.");
		return false;
	}
	
	//제목&본문 길이체크
	if (sendType == '7') {  //카카오 친구톡일때
		SmsService.checkTextLength_Kakao(
				$('#sendSubject').val(),
				$('#sendText').val(),
				function(data){
					if (data != null){
						var rNum = Number(data);
						if (rNum == -1) {
							alert("제목이 40byte 를 초과하였습니다.");
						}else if (rNum == -2) {
							alert("본문이 1000자 를 초과하였습니다.");
						}else{
							_showConfirmPopup(examineType, sendType);
						}
					}else{
						alert("텍스트 길이 체크 중 기타에러 발생!"); 
					}
				});
	}else{
		SmsService.checkTextLength(
				$('#sendSubject').val(),
				$('#sendText').val(),
				function(data){
					if (data != null){
						var rNum = Number(data);
						if (rNum == -1) {
							alert("제목이 40byte 를 초과하였습니다.");
						}else if (rNum == -2) {
							alert("본문이 2000byte 를 초과하였습니다.");
						}else{
							_showConfirmPopup(examineType, sendType);
						}
					}else{
						alert("텍스트 길이 체크 중 기타에러 발생!"); 
					}
				});
	}
	
}

function _showConfirmPopup(examineType, sendType) {
	if (confirm("정말 발송하시겠습니까? \n\n (확인을 누르시면 실제로 발송됩니다!!!)\n\n") == true) {
		_sendMessage(examineType, sendType);
	}
}

function _sendMessage(examineType, sendType) {
	
	if ('hand' == examineType) { /* 손으로 텍스트 입력 시 */
		var inputNumbers = $('#dstNumbers').val();
		
		if('' == inputNumbers){
			alert("수신자 번호를 입력해주세요.");
			//alert("업로드 할 엑셀 파일을 선택하세요.");
			return;
		}
		
		SmsService.sendMessage(
				jQuery.trim($('#sendKey').val()),
				sendType,
				jQuery.trim($("#senderName").val()),
				$("#description").val(),
				jQuery.trim($("#callback").val()),
				jQuery.trim($("#sendSubject").val()),
				$("#sendText").val(),
				jQuery.trim(inputNumbers),
				sendType == '7' ? jQuery.trim($("#kakaoKey").val()) : null,
				sendType == '7' ? jQuery.trim($("#kakaoBtnName").val()) : null,
				sendType == '7' ? jQuery.trim($("#kakaoLink").val()) : null,
				function(data){
					if(data != null){
						if(data.resultCode == '00'){
							alert("실제 메시지 발송을 요청하였습니다.");
						}else{
							alert(data.resultMessage);
						}
						
						dropExamineTables(true);
					}
					else{
						alert("메시지 발송 중 기타에러 발생!");
						dropExamineTables(false);
					}
					
			});
		
	}else{ /* 파일 업로드 시 */

		_uploadDstNumbers(
				examineType,
				jQuery.trim($('#sendKey').val()),
				sendType,
				jQuery.trim($("#senderName").val()),
				$("#description").val(),
				jQuery.trim($("#callback").val()),
				jQuery.trim($("#sendSubject").val()),
				$("#sendText").val(),
				sendType == '7' ? jQuery.trim($("#kakaoKey").val()) : null,
				sendType == '7' ? jQuery.trim($("#kakaoBtnName").val()) : null,
				sendType == '7' ? jQuery.trim($("#kakaoLink").val()) : null
		);
	}
}


/* 파일 업로드 */
function _uploadDstNumbers(examineType, sendKey, sendType, senderName, description, callback, sendSubject, sendText, kakaoKey, kakaoBtnName, kakaoLink) {
	if ($("#actionStatus").html() != ""){
		return;
	}
	
	var file;
	var fileType;
	
	if ('text' == examineType) {
		var fileNameText = $("#dstNumberTextFile").val();
		
		if ('' == fileNameText){
			alert("업로드 할 텍스트 파일을 선택하세요.");
			return;
		}else{
			file = dwr.util.getValue('dstNumberTextFile');
			fileType = "TEXT";			
		}
	}
	else if ('excel' == examineType) {
		var fileNameExcel = $("#dstNumberExcelFile").val();
		
		if ('' == fileNameExcel){
			alert("업로드 할 엑셀 파일을 선택하세요.");
			return;
		}else{
			file = dwr.util.getValue('dstNumberExcelFile');
			fileType = "EXCEL";			
		}
	}
	
	$("#actionStatus").html("<i class=\"icon-spinner icon-spin orange bigger-125\"></i>업로드 중입니다. 잠시만 기다려주세요.");
	
	SmsService.insertDstNumbersInBatch(
		sendKey,
		sendType,
		senderName,
		description,
		callback,
		sendSubject,
		sendText,
		kakaoKey,
		kakaoBtnName,
		kakaoLink,
		fileType,
		file,
		function(data){
			$("#actionStatus").html("");
			
			if(data != null){
				if(data.result.resultCode == '00'){
					//getCalledPageInfo();
					//opener.getSetPageInfo();
					//dwr.engine.openInDownload(data.file);
					alert("요청을 받아 DB에 데이터 입력중입니다.");
					dropExamineTables(true);
				}
				else if (data.result.resultCode == '19'){  //DUPLICATE_SEND_ID
					alert(data.result.resultMessage);
					//dropExamineTables();  -> SEND_ID 중복시에는 검증데이터 남겨두자.
				}
				else{
					alert(data.result.resultMessage);
					dropExamineTables(true);
				}
			}else{
				alert("파일업로드 중 기타에러 발생!");
				dropExamineTables(false);
			}
		}
	);
}


// 데이터 검증하기
function examineDatas() {
	if ($("#actionStatus").html() != ""){
		alert("진행중인 작업이 있습니다. 잠시 후 다시 시도하세요.");
		return;
	}
	
	resetExamInfo();
	
	if ($('#sendKey').val() == ''){
		alert("발송구분 key를 입력해주세요.");
		return false;
	}
	
	if ($('#senderName').val() == ''){
		alert("의뢰자를 선택해주세요.");
		return false;
	}
	
	if ($('#callback').val() == ''){
		alert("callback 번호를 입력해 주세요.");
		return false;
	}
	
	var sendType = $("input[type='radio'][name='sendType']:checked").val();  //1:sms, 3:lms
	
	if (sendType == '3') {
		if ($('#sendSubject').val() == ''){
			alert("제목을 입력해 주세요.");
			return false;
		}
	}
	else if (sendType == '7') {
		if ($('#kakaoKey').val() == ''){
			alert("친구톡 Sender-Key 를 입력해 주세요.");
			return false;
		}
		
		var pat = /^https?:\/\//i;  //URI scheme 체크
		if ( $('#kakaoLink').val() == '' || pat.test($('#kakaoLink').val()) ) {
			//ok
		}else{
			alert("친구톡 URL 링크 형식이 잘못되었습니다.");
			return false;
		}
	}
	
	if ($('#sendText').val() == ''){
		alert("본문을 입력해 주세요.");
		return false;
	}
	
	
	//제목&본문 길이체크
	if (sendType == '7') {  //카카오 친구톡일때
		SmsService.checkTextLength_Kakao(
				$('#sendSubject').val(),
				$('#sendText').val(),
				function(data) {
					if (data != null) {
						var rNum = Number(data);
						if (rNum == -1) {
							alert("제목이 40byte 를 초과하였습니다.");
						}
						else if (rNum == -2) {
							alert("본문이 1000자 를 초과하였습니다.");
						}
						else {
							var examineType = $("input[type='radio'][name='optionsRadios']:checked").val();
							
							if ('hand' == examineType) { /* 손으로 텍스트 입력 시 */
								alert("직접 입력 시에는 파일검증 기능을 사용할 수 없습니다.");
							}else{
								_uploadExamineDatas(
										examineType,
										jQuery.trim($('#sendKey').val()),
										jQuery.trim($("#senderName").val())
								);							
							}
						}
					}else{
						alert("텍스트 길이 체크 중 기타에러 발생!");
					}
				});
	}else{
		SmsService.checkTextLength(
				$('#sendSubject').val(),
				$('#sendText').val(),
				function(data) {
					if (data != null) {
						var rNum = Number(data);
						if (rNum == -1) {
							alert("제목이 40byte 를 초과하였습니다.");
						}
						else if (rNum == -2) {
							alert("본문이 2000byte 를 초과하였습니다.");
						}
						else {
							var examineType = $("input[type='radio'][name='optionsRadios']:checked").val();
							
							if ('hand' == examineType) { /* 손으로 텍스트 입력 시 */
								alert("직접 입력 시에는 파일검증 기능을 사용할 수 없습니다.");
							}else{
								_uploadExamineDatas(
										examineType,
										jQuery.trim($('#sendKey').val()),
										jQuery.trim($("#senderName").val())
								);							
							}
						}
					}else{
						alert("텍스트 길이 체크 중 기타에러 발생!");
					}
				});
	}
	
	
}


/* 파일 업로드 */
function _uploadExamineDatas(examineType, sendKey, senderName) {
	if ($("#actionStatus").html() != ""){
		return;
	}
	
	var file;
	var fileType;
	
	if ('text' == examineType) {
		var fileNameText = $("#dstNumberTextFile").val();
		
		if ('' == fileNameText){
			alert("업로드 할 텍스트 파일을 선택하세요.");
			return;
		}else{
			file = dwr.util.getValue('dstNumberTextFile');
			fileType = "TEXT";			
		}
	}
	else if ('excel' == examineType) {
		var fileNameExcel = $("#dstNumberExcelFile").val();
		
		if ('' == fileNameExcel){
			alert("업로드 할 엑셀 파일을 선택하세요.");
			return;
		}else{
			file = dwr.util.getValue('dstNumberExcelFile');
			fileType = "EXCEL";			
		}
	}
	
	var date = new Date();
	var tableName = 'TBL_' + date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds()); 
	console.log("# examine tableName: " + tableName);
	
	$("#actionStatus").html("<i class=\"icon-spinner icon-spin orange bigger-125\"></i>업로드 중입니다. 잠시만 기다려주세요.");

	SmsService.examineDatas(
		sendKey,
		senderName,
		tableName,
		fileType,
		file,
		function(data){
			$("#actionStatus").html("");
			
			if(data != null){
				
				/* data.resultCode 를 totalCnt 를 받는 용도로 임의 사용중이라서 
				 * 에러발생시에는 -1 을 리턴하도록 해놓은 상태임! */
				
				if (data.resultCode == '-1'){
					if (data.resultMessage != '') {
						alert(data.resultMessage);
					}else{
						alert("DB 입력 작업 중 오류가 발생하였습니다.");
					}
				} 
				else if (data.resultCode != '') {
					//getCalledPageInfo();
					//opener.getSetPageInfo();
					//dwr.engine.openInDownload(data.file);
					alert("요청을 받아 DB에 데이터 입력중입니다.\n잠시 기다려주세요...");

					$("#hiddenExamTable").val(tableName);  		//히든필드에 테이블명 저장
					$("#hiddenTotalCnt").val(data.resultCode);	//히든필드에 totalCnt 임시저장
					$("#examViewBtn").attr('style', 'visibility:visible'); 	//검증결과보기 버튼 노출
					//$("#examRemoveBtn").attr('style', 'visibility:visible');//검증테이블 삭제 버튼 노출
				}
				else {
					alert("기타 오류 발생");
				}
				
			}else{
				alert("데이터검증에 실패하였습니다.");
			}
		}
	);
}

/**
 * 데이터 검증결과 보여주기
 * @param sendKey
 * @param senderName
 * @param totalCnt
 * @returns {Boolean}
 */
function showExamineResults(sendKey, senderName, totalCnt, tableName) {
	if (sendKey == ''){
		alert("발송구분 key 값이 유효하지 않습니다.");
		return false;
	}
	
	if (senderName == ''){
		alert("의뢰자 값이 유효하지 않습니다.");
		return false;
	}
	
	console.log("# showExamineResults - tableName: " + tableName);
	if (tableName == ''){
		alert("검증테이블명이 유효하지 않습니다.");
		return false;
	}
	
	$("#totalRow").html("전체 건수: " + totalCnt);
	
	var threadCntFinished = false;
	
	// 작업 스레드 진행현황 (전체/종료 스레드 갯수) 파악
	SmsService.readExamineThreadCount(
			jQuery.trim(tableName)
			, function(data){
				if (data != null) {
					if(data.result.resultCode == '00'){
						var total = Number(data.total);
						var finished = Number(data.finished);  
						
						if (total > finished) {
							threadCntFinished = false;
							$("#successRow").html("성공 건수: 계산중..");
							$("#failRow").html("* 현재 성공/실패 건수 계산 중입니다. 잠시후 새로고침 해주세요");
							$("#finishInfo").html("");
						}else{
							threadCntFinished = true;
							$("#finishInfo").html("*** 검증이 완료되었습니다 ***");
							
							// 검증완료된 데이터 갯수(성공갯수) 조회
							SmsService.getExamineCount(
									jQuery.trim(tableName)
									, function(data){
										if (data != null) {
											var successNum = Number(data);
											var totalNum = Number(totalCnt);
											var failNum = totalNum - successNum;  
											
											$("#totalRow").html("전체 건수: " + totalNum);
											$("#successRow").html("성공 건수: " + successNum);
											$("#failRow").html("실패 건수: " + failNum);

										}else{
											alert("검증 데이터 카운트 조회 실패");
										}
									});
						}
					}else{
						console.log(data.result.resultMessage);
					}
				}else{
					console.log("검증 스레드 카운트 조회 실패");
				}
			});
	

	var fetchCnt = 30; 
	
	// DB에 입력된 검증데이터 샘플 조회
	SmsService.getExamineResults(
			fetchCnt
			, jQuery.trim(tableName)
			, function(data){
				if(data != null){
					if(data.length > 0){
						$("#examineStatus").hide();
						dwr.util.removeAllRows("examineTbody1");
						dwr.util.addRows("examineTbody1", data, examineCellFuncs1, tableController.tableCreator);
					}else{
						dwr.util.removeAllRows("examineTbody1");
						$("#examineStatus").show();
						$("#examineStatus").html("해당 조건에 맞는 데이터가 존재하지 않습니다.");
					}
				}else{
					dwr.util.removeAllRows("examineTbody1");
					$("#examineStatus").show();
					$("#examineStatus").html("샘플 데이터 조회에 실패하였습니다.");
				}
			});
	
//	if (tcnt_ > 20) {
//		SmsService.getExamineLastResults(
//				jQuery.trim(tableName)
//				, function(data){
//					if(data != null){
//						if(data.length > 0){
//							$("#examineStatus").hide();
//							dwr.util.removeAllRows("examineTbody2");
//							dwr.util.addRows("examineTbody2", data, examineCellFuncs2, tableController.tableCreator);
//						}else{
//							dwr.util.removeAllRows("examineTbody2");
//							$("#examineStatus").show();
//							$("#examineStatus").html("해당 조건에 맞는 데이터가 존재하지 않습니다.");
//						}
//					}else{
//						dwr.util.removeAllRows("examineTbody2");
//						$("#examineStatus").show();
//						$("#examineStatus").html("마지막부분 샘플조회에 실패하였습니다.");
//					}
//				});		
//	}
	
} 


//데이터 검증 페이지 열기 
function openExaminePop(){
	if ($('#sendKey').val() == ''){
		alert("발송구분 key를 입력해주세요.");
		return false;
	}
	
	if ($('#senderName').val() == ''){
		alert("의뢰자를 선택해주세요.");
		return false;
	}
	
	var sendKey =  jQuery.trim($('#sendKey').val());
	var senderName = jQuery.trim($("#senderName").val());
	var totalCnt = jQuery.trim($("#hiddenTotalCnt").val());
	var tableName = jQuery.trim($("#hiddenExamTable").val()); 
	
	var url = "openSmsExamine?" + "sendkey='" + sendKey + "'&sendername='" + senderName + "'&totalcnt='" + totalCnt + "'&tablename='" + tableName + "'";
	common.popup2(url, '데이터검증', 1280, 720);
}


// 검증테이블들 (지난날짜) 제거
function dropExamineTables(resetFlag) {
	SmsService.dropExamineTables(
			function(data){
				if(data != null){
					if(data.resultCode == '00'){
						console.log("검증테이블이 모두 제거되었습니다.");
					}else{
						console.log(data.resultMessage);
					}
				}else{
					console.log("지난 검증테이블 제거 중 기타 에러 발생!");					
				}
				
				if (resetFlag) {
					resetInformations();
				}
			});
}

// 현재 검증테이블 제거 - 사용안함!
function dropExamineData() {
	var tableName = $("#hiddenExamTable").val();
	
	if (tableName != '') {
		SmsService.dropExamineData(
				jQuery.trim(tableName)
				, function(data){
					if(data != null){
						if(data.resultCode == '00'){
							console.log("검증테이블이 제거되었습니다.");
							//alert("검증테이블이 제거되었습니다.");
						}else if(data.resultCode == '43'){
							console.log("이미 검증테이블이 제거된 상태입니다.");
							//alert("이미 제거되었습니다.");
						}else{
							console.log(data.resultMessage);
							//alert(data.resultMessage);
						}
					}else{
						console.log("검증테이블 제거 중 기타 에러 발생!");
						//alert("검증테이블 제거 중 기타 에러 발생!");
					}
					
					//resetInformations();
				});
	}
}

//파일입력창 및 검증데이터 리셋
function resetInformations() {
	$('#dstNumberTextFile').val('');
	$('#dstNumberExcelFile').val('');
	resetExamInfo();
}

// 검증데이터 리셋
function resetExamInfo() {
	$("#hiddenTotalCnt").val('0');
	$("#hiddenExamTable").val('');
	$("#examViewBtn").attr('style', 'visibility:hidden');
	//$("#examRemoveBtn").attr('style', 'visibility:hidden');	
}


function pad2(n) { return n < 10 ? '0' + n : n }


function checkFixIE8() {
	this.blur();
	this.focus();
}


// 접속브라우저 확인
function checkBrowser(){
	var agt = navigator.userAgent.toLowerCase(); 
	
	if (agt.indexOf("chrome") != -1) return 'chrome'; 
//	else if (agt.indexOf("opera") != -1) return 'Opera'; 
//	else if (agt.indexOf("staroffice") != -1) return 'Star Office'; 
//	else if (agt.indexOf("webtv") != -1) return 'WebTV'; 
//	else if (agt.indexOf("beonex") != -1) return 'Beonex'; 
//	else if (agt.indexOf("chimera") != -1) return 'Chimera'; 
//	else if (agt.indexOf("netpositive") != -1) return 'NetPositive'; 
//	else if (agt.indexOf("phoenix") != -1) return 'Phoenix'; 
//	else if (agt.indexOf("firefox") != -1) return 'Firefox'; 
//	else if (agt.indexOf("safari") != -1) return 'Safari'; 
//	else if (agt.indexOf("skipstone") != -1) return 'SkipStone'; 
//	else if (agt.indexOf("netscape") != -1) return 'Netscape'; 
//	else if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
	else {
		if (getVersionIE() == "N/A") {
			return 'unknown';
		}
		else {
			var verNum = parseInt(getVersionIE());
			
			if (isNaN(verNum) || verNum >= 10) {
				return "ie10"
			}else{
				return "ie";
//				switch (verNum) {
//				case 9:  //IE9
//					break;
//				case 8:  //IE8
//					break;
//				case 7:  //IE7
//					break;
//				case 6:  //IE6
//					break;
//				default:
//					break;
//				}
			}
		}
	} 
	
}

// 익스플로러 버전
function getVersionIE() { 
	 var word; 
	 var version = "N/A"; 

	 var agent = navigator.userAgent.toLowerCase(); 
	 var name = navigator.appName; 

	 // IE old version ( IE 10 or Lower ) 
	 if ( name == "Microsoft Internet Explorer" ) {
		 word = "msie ";
	 }
	 else { 
		 // IE 11 
		 if ( agent.search("trident") > -1 ) word = "trident/.*rv:"; 

		 // Microsoft Edge  
		 else if ( agent.search("edge/") > -1 ) word = "edge/"; 
	 } 

	 var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})" ); 

	 if ( reg.exec( agent ) != null ) version = RegExp.$1 + RegExp.$2; 

	 return version; 
	 
} 




