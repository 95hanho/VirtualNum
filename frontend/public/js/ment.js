
function loadMentPage(idx){
	dwr.engine.setErrorHandler(error.expiredSession);

	$('#mentShowItemCountSelector').change(function(){
		$("#mentCurrentPage").val(1);
		getMentPageInfo();
	});
	
	getMentPageInfo();
}

function mentPageCallback(){
	getMentPageInfo();
}

/*
 * ment 조회
 */

function getMentPageInfo(){
	Ment.getMentPageInfo(
		$('#acsMentName').val()
		, $('#mentCurrentPage').val()
		, $("#mentShowItemCountSelector option:selected").val()
		, function(data){
			if(data.totalCount < $("#mentShowItemCountSelector option:selected").val()){
				$('#mentPageSelectorDiv')[0].innerHTML = "";
			}
			else{
				$('#mentPageSelectorDiv')[0].innerHTML = pagination.makeHtmlString(data, "#mentCurrentPage", mentPageCallback);
			}
			if(data != null){
				getAcsMentList(data.minItem);
			}
			
		});
}

var mentCellFuncs = [
	function(data) {return data.mentName;},
	function(data) {return data.mentDesc;},
	function(data) {return data.modId;},
	function(data) {return data.modDate;},
	function(data) {
		var href =
			"<div class='visible-md visible-lg hidden-sm hidden-xs action-buttons'>"
			+ "<a class='green' title=\"다운로드\" href=\"javascript:downloadAcsMent(\'" + data.mentIdx + "\')\"><i class='icon-download bigger-130'></i></a>"
			+ "<a class='blue' title=\"수정\" href=\"javascript:openMentManagementPop(\'u\' ,\'" + data.mentIdx + "\')\"><i class='icon-cog bigger-130'></i></a>"
			+ "<a class='red' title=\"삭제\" href=\"javascript:deleteAcsMent(\'" + data.mentIdx + "\')\"><i class='icon-trash bigger-130'></i></a>"
			+ "</div>";
		return href;
	}
];


function getAcsMentList(minItem){
	Ment.getAcsMentList(
		$('#acsMentName').val()
		, minItem 
		, $("#mentShowItemCountSelector option:selected").val()
		, function(data){
			if(data != null){
				dwr.util.removeAllRows("acsMentTbody");
				dwr.util.addRows("acsMentTbody", data, mentCellFuncs, tableController.tableCreator);
			}
	});
}

function downloadAcsMent(mentIdx){
	Ment.downloadAcsMent(
		mentIdx
		, function(data){
			if(data != null){
				dwr.engine.openInDownload(data);
			}
			else{
				alert("음원 다운로드에 실패했습니다.");
			}
	});
}

function openMentManagementPop(mode, mentIdx){
	var url = "openMentManagementPop?mode=" + mode;
	if(mode == 'u'){
		url += "&mentIdx=" + mentIdx;
		common.popup(url, 'ment', 500, 300);
	}
	else{
		common.popup(url, 'ment', 500, 350);
	}
	
}

function initMentManagePop(){
	if($("#mode").val() == 'i'){
		$(".updateDiv").hide();
		$(".insertDiv").show();
		$(".recordDiv").hide();
		
		$('.recordYnRadio').change(function(){
			if($.trim($('input:radio[name="recordYnRadio"]:checked').val()) == 'N'){
				$(".recordDiv").hide();
				$(".uploadDiv").show();
			}
			else{
				$(".recordDiv").show();
				$(".uploadDiv").hide();
				getRecordFileList();
			}
		});
		
	}
	else if($("#mode").val() == 'u'){
		$(".updateDiv").show();
		$(".insertDiv").hide();
		Ment.getAcsMentByMentIdx(
			$("#mentIdx").val()
			, function(data){
				if(data != null){
					$("#mentName").val(data.mentName);
					$("#mentDesc").val(data.mentDesc);
				}
				else{
					alert("음원 정보가 잘못되었습니다.");
					window.close();
				}
			}
		);
	}
}

function insertAcsMent(){
	if($("#uploadStatus").text() != ""){
		return;
	}
	if($("#mentName").val() == ""){
		alert("음원명을 입력하세요.");
		return;
	}
	
	var fileName = $("#mentFile").val();
	if(fileName == ''){
		alert("업로드 할 음원 파일을 선택하세요.");
		return;
	}
	
	var file = dwr.util.getValue('mentFile');
	$("#uploadStatus").text("업로드 중입니다. 잠시만 기다려주세요.");
	
	Ment.insertAcsMent(
		$("#mentName").val()
		, $("#mentDesc").val()
		, file
		, function(data){
			$("#uploadStatus").text("");
			if(data.resultCode == '00'){
				opener.$("#mentCurrentPage").val("1");
				opener.getMentPageInfo();
				window.close();
			}
			else{
				alert(data.resultMessage);
			}
	});
}

function changeMentInfo(){
	if($("#mentName").val() == ""){
		alert("음원명을 입력하세요.");
		return;
	}
	Ment.changeMentInfo(
		$("#mentIdx").val()
		, $("#mentName").val()
		, $("#mentDesc").val()
		, function(data){
			if(data.resultCode == '00'){
				opener.$("#mentCurrentPage").val("1");
				opener.getMentPageInfo();
				window.close();
			}
			else{
				alert(data.resultMessage);
			}
	});
}


function deleteAcsMent(mentIdx){
	if(confirm('한번 삭제한 음원은 복원할 수 없습니다. 삭제하시겠습니까?') == false){
		return;
	}
	
	Ment.deleteAcsMent(
		mentIdx
		, function(data){
			if(data.resultCode == '00'){
				$("#mentCurrentPage").val("1");
				getMentPageInfo();
			}
			else{
				alert(data.resultMessage);
			}
	});
}






function openWavFormatPop(){
	var url = "openWavFormatPop";
	common.popup(url, 'info', 440, 490);
}


function getRecordFileList(){
	Ment.getRecordFileList(
		function(data){
			if(data != null){
				if(data.result.resultCode == '00'){
					if(data.recordList.length > 0){
						dwr.util.removeAllOptions("recordFileSelector");
						$('#recordFileSelector').append("<option value='0' selected>녹음파일을 선택하세요.</option>");
						dwr.util.addOptions("recordFileSelector", data.recordList
								, function logisNameFormatter(data){return data.callId;}
							, function logisNameFormatter(data){return "통화시간 : " + string.getTimeString(data.callStartTime.substr(8, 6)) + ", 발신번호 : " + string.getPhoneNumberString(data.callerNumber);}
						);
					}
					else{
						alert("오늘 녹음된 파일이 없습니다. 가상번호로 통화하여 녹음파일을 생성하세요. 가상번호는 가입자 정보에서 확인할 수 있습니다.");
						$('#recordFileSelector').append("<option value='0' selected>녹음파일이 없습니다.</option>");
					}
				}
				else{
					alert(data.result.resultMessage);
				}
			}
			else{
				alert("녹음파일 목록을 조회할 수 없습니다.");
			}
	});
}

function setAcsMent(){

	if($("#mentName").val() == ""){
		alert("음원명을 입력하세요.");
		return;
	}
	
	if($("#recordFileSelector option:selected").val() == "0"){
		alert("녹음파일을 선택하세요.");
		return;
	}
	$("#uploadStatus").text("저장 중입니다. 잠시만 기다려주세요.");
	
	Ment.setAcsMentUsingRecordFile(
		$("#mentName").val()
		, $("#mentDesc").val()
		, $("#recordFileSelector option:selected").val()
		, function(data){
			$("#uploadStatus").text("");
			if(data.resultCode == '00'){
				opener.$("#mentCurrentPage").val("1");
				opener.getMentPageInfo();
				window.close();
			}
			else{
				alert(data.resultMessage);
			}
	});
}


function downloadRecordMent(){
	if($("#recordFileSelector option:selected").val() == '0'){
		alert("다운로드할 녹음파일을 선택하세요.");
		return false;
	}
	
	Ment.downloadRecordMent(
		$("#recordFileSelector option:selected").val()
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
				alert("음원 다운로드에 실패했습니다.");
			}
	});
}
