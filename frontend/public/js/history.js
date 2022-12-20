var pageIndex = 0;
var exportFlag = 0;
function initElements(){
	$("#searchStatus").html("조회 조건을 입력하세요.");
	$("#historyTable").hide();
	$("#cdrTable").hide();
	$("#searchedCountDiv").hide();
	$("#historyCurrentPage").val("1");
	$('#historyPageSelectorDiv')[0].innerHTML = "";
}

function initElementChange(){
	
	$('#acsSetSelector').change(function(){
		$("#historyCurrentPage").val("1");
		if(pageIndex == '1'){
			getCdrPageInfo();
		}
		else{
			getHistoryPageInfo();
		}
	});
	$('#acsConnDurationSelector').change(function(){
		$("#historyCurrentPage").val("1");
		getCdrPageInfo();
	});
	
	$('#acsSetShowItemCountSelector').change(function(){
		$("#historyCurrentPage").val("1");
		if(pageIndex == '1'){
			getCdrPageInfo();
		}
		else{
			getHistoryPageInfo();
		}
	});
	$('#acsCallResultSelector').change(function(){
		$("#historyCurrentPage").val("1");
		getHistoryPageInfo();
	});
}

function loadHistoryPage(idx){
	dwr.engine.setErrorHandler(error.expiredSession);
	pageIndex = idx;
	if(idx == '1'){
		$(".requestDiv").hide();
		$(".callDiv").show();
	}
	else if(idx == '2'){
		$(".requestDiv").show();
		$(".callDiv").hide();
	}
	initElements();
	initElementChange();
	
	$('#acsStartDatePicker').datepicker({
       	format:'yyyy-mm-dd',
            "autoclose": true
       });
	if($("#acsStartDatePicker").val() == ''){
		$("#acsStartDatePicker").datepicker('update',new Date());
	}
		
	$('#acsStartTimePicker').timepicker({
		minuteStep: 1,
		secondStep: 1,
		showMeridian: false,
		showSeconds: true,
		defaultTime: '00:00:00'
	});
	
	$('#acsEndDatePicker').datepicker({
       	format:'yyyy-mm-dd',
        "autoclose": true
       });
	if($("#acsEndDatePicker").val() == ''){
		$("#acsEndDatePicker").datepicker('update',new Date());
	}
	
	$('#acsEndTimePicker').timepicker({
		minuteStep: 1,
		secondStep: 1,
		showMeridian: false,
		showSeconds: true,
		defaultTime: '23:59:59'
	});
	
	
	getAcsAllSetListForSelector();
}

function historyPageCallback(){
	getHistoryPageInfo();
}


function cdrPageCallback(){
	getCdrPageInfo();
}



/*
 * 이력 조회
 */


function checkStartEndDateTime(){
	var startDate = string.getOnlyNumberString($("#acsStartDatePicker").val());
	var endDate = string.getOnlyNumberString($("#acsEndDatePicker").val());
	var startTime = string.getOnlyNumberString($("#acsStartTimePicker").val());
	var endTime = string.getOnlyNumberString($("#acsEndTimePicker").val());
	if(startDate.length != 8){
		alert("조회 시작일이 잘못되었습니다.");
		return false;
	}
	if(endDate.length != 8){
		alert("조회 종료일이 잘못되었습니다.");
		return false;
	}

	if(startTime.length != 6 || startTime < '000000' || startTime > '240000'){
		alert("조회 시작 시간이 잘못되었습니다.");
		return false;
	}
	if(endTime.length != 6 || endTime < '000000' || endTime > '240000'){
		alert("조회 종료 시간이 잘못되었습니다.");
		return false;
	}
	
	if(startDate != endDate){
		if(startDate > endDate){
			alert("시작일이 종료일보다 나중일 수 없습니다.");
			return false;
		}
	}
	else{
		//시간 비교
		if(startTime > endTime){
			alert("시작시간이 종료시간보다 나중일 수 없습니다.");
			return false;
		}
	}
	return true;
}

function getCdrPageInfo(){
	
	if(checkStartEndDateTime() == false){
		return;
	}

	$("#searchStatus").html("<i class=\"icon-spinner icon-spin orange bigger-125\"></i>조회 중입니다. 잠시만 기다려주세요.");
	$("#searchStatus").show();
	$("#searchedCountDiv").hide();
	$("#cdrTable").hide();
	$("#historyPageSelectorDiv").hide();
	
	HistoryService.getCdrPageInfo(
			$("#acsSetSelector option:selected").val()
			, $('#acsStartDatePicker').val()
			, $('#acsStartTimePicker').val()
			, $('#acsEndDatePicker').val()
			, $('#acsEndTimePicker').val()
			, $('#calledNumber').val()
			, $("#acsConnDurationSelector option:selected").val()
			, $("#historyCurrentPage").val() 
			, $("#acsSetShowItemCountSelector option:selected").val()
			, function(data){
				if(data != null){
					if(data.totalCount < $("#acsSetShowItemCountSelector option:selected").val()){
						$('#historyPageSelectorDiv')[0].innerHTML = "";
					}
					else{
						$('#historyPageSelectorDiv')[0].innerHTML = pagination.makeHtmlString(data, "#historyCurrentPage", cdrPageCallback);
					}
					$("#totalSearchedCount").text(string.addComma(data.totalCount));
					getAcsCdrList(data.minItem);
				}
				else{
					$("#searchStatus").hide();
					alert("조회에 실패했습니다.");
				}
			});
}

var cdrCellFuncs = [
	function(data) {
		var href = "<div class='action-buttons' style='text-align:center'>"
				+ "<a class='green' title=\"상세보기\" href=\"javascript:openRequesthistoryDetailPop(\'" + data.cdrId + "\')\"><i class='icon-search bigger-130'></i></a>";
				+ "</div>";
		return href;
	},
	//FIX_ME mysql DB가 분리되어 setName이 없음
//	function(data) {return data.setName;},
	function(data) {return $("#acsSetSelector option:selected").text();},
	function(data) {return string.getPhoneNumberString(data.calledNumber);},
	function(data) {return string.getDateTimeString(data.calledCSTime);},
	function(data) {return data.calledCauseValue;},
	function(data) {return string.addComma(data.calledCallDuration);},
	function(data) {return string.addComma(data.calledConnDuration);},
	function(data) {return string.addComma(data.tmCallDuration);},
	function(data) {return string.addComma(data.tmConnDuration);}
];


function getAcsCdrList(minItem){

	if(checkStartEndDateTime() == false){
		return;
	}
	
	HistoryService.getAcsCdrList(
			$("#acsSetSelector option:selected").val()
			, $('#acsStartDatePicker').val()
			, $('#acsStartTimePicker').val()
			, $('#acsEndDatePicker').val()
			, $('#acsEndTimePicker').val()
			, $('#calledNumber').val()
			, $("#acsConnDurationSelector option:selected").val()
			, minItem 
			, $("#acsSetShowItemCountSelector option:selected").val()
			, function(data){
				if(data != null){
					if(data.length > 0){
						$("#searchStatus").hide();
						$("#searchedCountDiv").show();
						$("#cdrTable").show();
						$("#historyPageSelectorDiv").show();
						dwr.util.removeAllRows("cdrTbody");
						dwr.util.addRows("cdrTbody", data, cdrCellFuncs, tableController.tableCreator);
					}
					else{
						$("#searchStatus").html("해당 조건에 맞는 데이터가 존재하지 않습니다.");
					}
				}
				
	});
}


function exportAcsCdrList(){
	if(exportFlag == 1){
		$("#searchStatus").html("<i class=\"icon-spinner icon-spin orange bigger-125\"></i>요청하신 작업을 처리하고 있습니다. 잠시만 기다려주세요.");
		$("#searchStatus").show();
		return;
	}
	
	if(checkStartEndDateTime() == false){
		return;
	}
	exportFlag = 1;
	$("#searchStatus").html("<i class=\"icon-spinner icon-spin orange bigger-125\"></i>엑셀파일을 만들고 있습니다. 잠시만 기다려주세요.");
	$("#searchStatus").show();
	
	HistoryService.exportAcsCdrList(
			$("#acsSetSelector option:selected").val()
			, $('#acsStartDatePicker').val()
			, $('#acsStartTimePicker').val()
			, $('#acsEndDatePicker').val()
			, $('#acsEndTimePicker').val()
			, $('#calledNumber').val()
			, $("#acsConnDurationSelector option:selected").val()
			, function(data){
				exportFlag = 0;
				$("#searchStatus").html("");
				$("#searchStatus").hide();
				if(data != null){
					if(data.result.resultCode != '00'){
						alert(data.result.resultMessage);
					} 
					else{
						dwr.engine.openInDownload(data.file);
					}
				}
				else{
					alert("다운받기에 실패했습니다.");
				}
				
	});
}




/*
 * for called history
 */

function getHistoryPageInfo(){
	
	if(checkStartEndDateTime() == false){
		return;
	}

	$("#searchStatus").html("<i class=\"icon-spinner icon-spin orange bigger-125\"></i>조회 중입니다. 잠시만 기다려주세요.");
	$("#searchStatus").show();
	$("#searchedCountDiv").hide();
	$("#historyTable").hide();
	$("#historyPageSelectorDiv").hide();
	
	HistoryService.getHistoryPageInfo(
			$("#acsSetSelector option:selected").val()
			, $('#acsStartDatePicker').val()
			, $('#acsStartTimePicker').val()
			, $('#acsEndDatePicker').val()
			, $('#acsEndTimePicker').val()
			, $('#calledNumber').val()
			, $("#acsCallResultSelector option:selected").val()
			, $("#historyCurrentPage").val() 
			, $("#acsSetShowItemCountSelector option:selected").val()
			, function(data){
				if(data != null){
					if(data.totalCount < $("#acsSetShowItemCountSelector option:selected").val()){
						$('#historyPageSelectorDiv')[0].innerHTML = "";
					}
					else{
						$('#historyPageSelectorDiv')[0].innerHTML = pagination.makeHtmlString(data, "#historyCurrentPage", historyPageCallback);
					}
					$("#totalSearchedCount").text(string.addComma(data.totalCount));
					getAcsHistoryList(data.minItem);
				}
				else{
					$("#searchStatus").hide();
					alert("조회에 실패했습니다.");
				}
			});
}

var historyCellFuncs = [
	function(data) {return data.setName;},
	function(data) {return data.calledNumber;},
	function(data) {return data.calledName;},
	function(data) {
		if(data.callResult == '1'){
			return '성공';
		}
		else{
			return '실패';
		}
	},
	function(data) {return data.tryCount;},
	function(data) {return data.regId;},
	function(data) {return data.regDate;}
];


function getAcsHistoryList(minItem){

	if(checkStartEndDateTime() == false){
		return;
	}
	
	HistoryService.getAcsHistoryList(
			$("#acsSetSelector option:selected").val()
			, $('#acsStartDatePicker').val()
			, $('#acsStartTimePicker').val()
			, $('#acsEndDatePicker').val()
			, $('#acsEndTimePicker').val()
			, $('#calledNumber').val()
			, $("#acsCallResultSelector option:selected").val()
			, minItem 
			, $("#acsSetShowItemCountSelector option:selected").val()
			, function(data){
				if(data != null){
					if(data.length > 0){
						$("#searchStatus").hide();
						$("#searchedCountDiv").show();
						$("#historyTable").show();
						$("#historyPageSelectorDiv").show();
						dwr.util.removeAllRows("historyTbody");
						dwr.util.addRows("historyTbody", data, historyCellFuncs, tableController.tableCreator);
					}
					else{
						$("#searchStatus").html("해당 조건에 맞는 데이터가 존재하지 않습니다.");
					}
				}
				
	});
}


function exportHistoryList(){
	if(exportFlag == 1){
		$("#searchStatus").html("<i class=\"icon-spinner icon-spin orange bigger-125\"></i>요청하신 작업을 처리하고 있습니다. 잠시만 기다려주세요.");
		$("#searchStatus").show();
		return;
	}
	
	if(checkStartEndDateTime() == false){
		return;
	}
	exportFlag = 1;
	$("#searchStatus").html("<i class=\"icon-spinner icon-spin orange bigger-125\"></i>엑셀파일을 만들고 있습니다. 잠시만 기다려주세요.");
	$("#searchStatus").show();
	
	HistoryService.exportHistoryList(
			$("#acsSetSelector option:selected").val()
			, $('#acsStartDatePicker').val()
			, $('#acsStartTimePicker').val()
			, $('#acsEndDatePicker').val()
			, $('#acsEndTimePicker').val()
			, $('#calledNumber').val()
			, $("#acsCallResultSelector option:selected").val()
			, function(data){
				exportFlag = 0;
				$("#searchStatus").html("");
				$("#searchStatus").hide();
				if(data != null){
					if(data.result.resultCode != '00'){
						alert(data.result.resultMessage);
					} 
					else{
						dwr.engine.openInDownload(data.file);
					}
				}
				else{
					alert("다운받기에 실패했습니다.");
				}
				
	});
}





function getAcsAllSetListForSelector(){
	SetService.getAcsAllSetListForSelector(
		function(data){
		if(data != null){
			dwr.util.removeAllOptions("acsSetSelector");
			$("#acsSetSelector").append("<option value='a' selected>전체</option>");
			$("#acsSetSelector").append("<option value='0'>테스트 전화</option>");
			dwr.util.addOptions("acsSetSelector", data, function(data){return data.setIdx;}, function(data){return data.setName;});
		}
		else{
			alert("등록된 설정이 없습니다.");
		}
	});
}



function openRequesthistoryDetailPop(cdrId){
	var url = "openRequesthistoryDetailPop?cdrId="+cdrId;
	common.popup(url, '상세조회', 600, 800);
}

function getWhorelStr(whorel){
	if(whorel == '1'){
		return '착신자';
	}
	else if(whorel == '2'){
		return '상담원';
	}
	else{
		return '시스템';
	}
}

function initRequestDetailPop(){
	dwr.engine.setErrorHandler(error.invalidRequestPop);
	HistoryService.getCdrByCdrId(
		$("#cdrId").val()
		, function(data){
			if(data != null){
				$("#callerNumber").text(string.getPhoneNumberString(data.callerNumber));
				$("#calledNumber").text(string.getPhoneNumberString(data.calledNumber));
//				$("#tmNumber").text(string.getPhoneNumberString(data.tmNumber));
				
				$("#calledCSTime").text(string.getDateTimeString(data.calledCSTime));
				if(data.calledCallDuration > 0){
					$("#calledANTime").text(string.getDateTimeString(data.calledANTime));
					$("#calledCETime").text(string.getDateTimeString(data.calledCETime));
				}
				else{
					$("#calledANTime").text("-");
					$("#calledCETime").text("-");
				}
				
				$("#calledCallDuration").text(data.calledCallDuration);
				$("#calledConnDuration").text(data.calledConnDuration);
				$("#calledCauseValue").text(data.calledCauseValue);
				$("#whorel").text(getWhorelStr(data.whorel));
				
				
				if(data.tmCallDuration > 0){
					$("#tmCSTime").text(string.getDateTimeString(data.tmCSTime));
					$("#tmANTime").text(string.getDateTimeString(data.tmANTime));
					$("#tmCETime").text(string.getDateTimeString(data.tmCETime));
					$("#tmCallDuration").text(data.tmCallDuration);
					$("#tmConnDuration").text(data.tmConnDuration);
					$("#tmCauseValue").text(data.tmCauseValue);
				}
				else{
					$("#tmCSTime").text("-");
					$("#tmANTime").text("-");
					$("#tmCETime").text("-");
					$("#tmCallDuration").text(data.tmCallDuration);
					$("#tmConnDuration").text(data.tmConnDuration);
					$("#tmCauseValue").text("연결하지 않음");
				}
			}
			else{
				alert("데이터 조회에 실패했습니다.");
			}
	});
}
