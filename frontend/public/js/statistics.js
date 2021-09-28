
function loadStatisticsPage(idx){
	dwr.engine.setErrorHandler(error.expiredSession);
	
	var day = new Date();
	
	$('#statDatePicker').datepicker({
       	format:'yyyy-mm-dd',
            "autoclose": true
       });
	$("#statisticsTable").hide();
	getAcsAllSetListForSelector();
	
	$('#statStartDatePicker').datepicker({
       	format:'yyyy-mm-dd',
        "autoclose": true
    });
	
	$('#statEndDatePicker').datepicker({
       	format:'yyyy-mm-dd',
        "autoclose": true
    });

	if($("#statEndDatePicker").val() == ''){
		$("#statEndDatePicker").datepicker('update',day);
	}
	day.setDate(day.getDate() - 1);
	if($("#statStartDatePicker").val() == ''){
		$("#statStartDatePicker").datepicker('update', day);
	}
	
}

/*
 * 통계 조회
 */
var statisticsCellFuncs = [
	function(data) {return  string.getDateString(data.statisticsDate);},
//	function(data) {return data.setName;},
	function(data) {return string.addComma(data.requestTotalCount);},
	function(data) {return string.addComma(data.requestSuccessCount);},
	function(data) {return string.addComma(data.requestFailCount);},
	function(data) {return string.addComma(data.calledCallSum);},
	function(data) {return string.addComma(data.calledCallCount);},
	function(data) {return string.addComma(data.calledConnSum);},
	function(data) {return string.addComma(data.calledConnCount);},
	function(data) {return string.addComma(data.tmCallSum);},
	function(data) {return string.addComma(data.tmCallCount);},
	function(data) {return string.addComma(data.tmConnSum);},
	function(data) {return string.addComma(data.tmConnCount);}
];


function checkStartEndDateTime(){
	var startDate = string.getOnlyNumberString($("#statStartDatePicker").val());
	var endDate = string.getOnlyNumberString($("#statEndDatePicker").val());
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
	return true;
}


function getAcsStatistics(){
	if($("#acsSetSelector option:selected").val() == 's'){
		alert("조회할 설정을 선택하세요.");
		return false;
	}
	if($('#statStartDatePicker').val() == ''){
		alert("조회 시작일을 입력하세요.");
		return false;
	}
	if($('#statStartDatePicker').val() == ''){
		alert("조회 종료일을 입력하세요.");
		return false;
	}
	
	if(checkStartEndDateTime() == false){
		return false;
	}
	
	Statistics.getAcsStatistics(
			$("#acsSetSelector option:selected").val()
			, $('#statStartDatePicker').val()
			, $('#statEndDatePicker').val()
			, function(data){
				if(data != null){
					if(data.result.resultCode == '00'){
						if(data.statisticsList.length > 0){
							$("#statisticsTable").show();
							dwr.util.removeAllRows("statisticsTbody");
							dwr.util.addRows("statisticsTbody", data.statisticsList, statisticsCellFuncs, tableController.tableCreator);
						}
						else{
							$("#statisticsTable").hide();
							alert("통계 정보가 없습니다.");
						}
					}
					else{
						alert(data.result.resultMessage);
					}
					
				}
				else{
					alert("통계 정보를 조회할 수 없습니다.");
				}
	});
}


function exportAcsStatistics(){
	if($("#acsSetSelector option:selected").val() == 's'){
		alert("조회할 설정을 선택하세요.");
		return false;
	}
	if($('#statStartDatePicker').val() == ''){
		alert("조회 시작일을 입력하세요.");
		return false;
	}
	if($('#statStartDatePicker').val() == ''){
		alert("조회 종료일을 입력하세요.");
		return false;
	}
	
	if(checkStartEndDateTime() == false){
		return false;
	}
	
	Statistics.exportAcsStatistics(
			$("#acsSetSelector option:selected").val()
			, $('#statStartDatePicker').val()
			, $('#statEndDatePicker').val()
			, function(data){
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
			$("#acsSetSelector").append("<option value='s' selected>설정을 선택하세요.</option>");
			$("#acsSetSelector").append("<option value='0'>테스트호</option>");
			dwr.util.addOptions("acsSetSelector", data, function(data){return data.setIdx;}, function(data){return data.setName;});
		}
		else{
			alert("등록된 설정이 없습니다.");
		}
	});
}


