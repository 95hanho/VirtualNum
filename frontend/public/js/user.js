
function loadUserPage(idx){
	dwr.engine.setErrorHandler(error.expiredSession);
	
	$("#userInfo").hide();
	$("#systemInfo").hide();
	if(idx == 1){
		getUserInfo();
		$("#userInfo").show();
	}
	else if(idx == 2){
		getSystemInfo();
		$("#systemInfo").show();
	}
}

function getUserInfo(){
	User.getUserInfo(
		function(data){
			if(data != null){
				$("#officeName").text(data.officeName);
				$("#officeBalance").text(comma.setComma(data.officeBalance) + "원");
				$("#usedAccount").text(comma.setComma(data.usedAccount) + "원");
				$("#availableBalance").text(comma.setComma(Number(data.officeBalance) - Number(data.usedAccount)) + "원");
				if(data.aoStatus == '1'){
					$("#officeStatus").text("서비스를 이용할 수 있는 상태입니다.");
				}
				else{
					$("#officeStatus").text("서비스 이용이 중지되어 있습니다. 관리자에게 문의하세요.");
				}
				
				$("#userId").text(data.userId);
				$("#userName").text(data.userName);
				$("#userPhone").text(string.getPhoneNumberString(data.userPhone));
				$("#accessNumber").text(string.getPhoneNumberString(data.accessNumber));
			}
			else{
				alert("가입자 정보를 가져오는데 실패했습니다.");
			}
		});
}


function getSystemInfo(){
	User.getSystemInfo(
		function(data){
			if(data != null){
				$("#serviceStartTime").text(string.getTimeString(data.serviceStartTime));
				$("#serviceEndTime").text(string.getTimeString(data.serviceEndTime));
			}
			else{
				alert("시스템 환경 정보를 가져오는데 실패했습니다.");
			}
		});
}


function openChangePwdPop(event){
	var url = "openChangePwdPop";
	common.popupCurrentPosition(event, url, 'change', 300, 360);
}

function changePassword(){
	if($("#oldPassword").val() == ''){
		alert("현재 비밀번호를 입력하세요.");
		return;
	}
	
	if($("#newPassword").val() == ""){
		alert("새 비밀번호를 입력하세요.");
		return;
	}
	
	if($("#newPasswordConfirm").val() == ""){
		alert("새 비밀번호 확인을 입력하세요.");
		return;
	}
	
	if($("#newPassword").val() != $("#newPasswordConfirm").val()){
		alert("새 비밀번호와 새 비밀번호 확인 값이 일치하지 않습니다.");
		return;
	}
	
	User.changePassword(
		$("#oldPassword").val()
		, $("#newPassword").val()
		, function(data){
			if(data != null){
				if(data.resultCode == '00'){
						alert("변경되었습니다.");
						window.close();
					}
					else{
						alert(data.resultMessage);
					}
				}
				else{
					alert("비밀번호 변경도중 오류가 발생했습니다.");
				}
		});
}
