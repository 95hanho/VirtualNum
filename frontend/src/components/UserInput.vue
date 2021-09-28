<template>
    <div class="userInput">

        <div class="main-content">
            <div class="page-content" id="acsSetPageContent">
                <div class="row">
                    <div class="widget-header widget-header-small">
                        <h5 class="lighter">IBIZ 유저 등록</h5>
                    </div>
                    <div class="widget-body">
                        <div class="widget-main">
                            <div class="row" style="height:90px;">
                                <div class="input-group col-xs-4">
                                    <label>유저 아이디</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-user bigger-110"></i>
                                        </span>
                                        <input class="form-control" v-model="userId" ref="idRef" @keyup.enter="userInput">
                                    </div>
                                </div>
                                <div class="input-group col-xs-4">
                                    <label>유저 비밀번호</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-lock bigger-110"></i>
                                        </span>
                                        <input type="password" class="form-control" v-model="userPwd" ref="pwdRef" @keyup.enter="userInput">
                                    </div>
                                </div>
                                <div class="input-group col-xs-4">
                                    <label>비밀번호 확인</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-lock bigger-110"></i>
                                        </span>
                                        <input type="password" class="form-control" v-model="userPwdCheck" ref="pwdCheckRef" @keyup.enter="userInput">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-group col-xs-4">
                                    <label>가입자 이름</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-user-md bigger-110"></i>
                                        </span>
                                        <input class="form-control" v-model="userName" ref="nameRef" @keyup.enter="userInput">
                                    </div>
                                </div>
                                <div class="input-group col-xs-4">
                                    <label>가입자 번호</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-phone bigger-110"></i>
                                        </span>
                                        <input class="form-control" v-model="userPhone" ref="phoneRef" @keyup.enter="userInput">
                                    </div>
                                </div>
                                <div class="input-group col-xs-4">
                                    <label>ClientCode</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-code bigger-110"></i>
                                        </span>
                                        <input class="form-control" v-model="clientCode" ref="clienCodeRef" @keyup.enter="userInput">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-group pull-right col-xs-4">
                                    <div class="input-group" id="inputBtn">
                                        <button class="btn btn-primary btn-sm callDiv" style="margin-left:5px;" @click="formReset">
                                            리셋<i class="icon-download icon-on-right bigger-110"></i>
                                        </button>
                                        <button class="btn btn-success btn-sm callDiv" @click="userInput">
                                            입력<i class="icon-magic icon-on-right bigger-110"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    data(){
        return{
            userId:"",
            userPwd:"",
            userPwdCheck:"",
            userName:"",
            userPhone:"",
            clientCode:""
        }
    },
    methods:{
        userInput(){
            if(this.userId.length == 0){
                alert('유저 아이디를 입력해주세요.');
                this.$refs.idRef.focus();
            } else if(this.userPwd.length == 0){
                alert('유저 비밀번호를 입력해주세요.');
                this.$refs.pwdRef.focus();
            } else if(this.userPwdCheck.length == 0){
                alert('비밀번호 확인을 입력해주세요.');
                this.$refs.pwdCheckRef.focus();
            } else if(this.userName.length == 0){
                alert('가입자 이름을 입력해주세요.');
                this.$refs.nameRef.focus();
            } else if(this.userPhone.length == 0){
                alert('가입자 번호를 입력해주세요.');
                this.$refs.phoneRef.focus();
            } else if(this.clientCode.length == 0){
                alert('ClientCode를 입력해주세요.');
                this.$refs.clienCodeRef.focus();
            } else if(this.userPwd != this.userPwdCheck){
                alert('비밀번호가 일치하지 않습니다.');
                this.$refs.pwdCheckRef.focus();
            } else {
                let message = {
                    "userId":this.userId,
                    "userPwd":this.userPwd,
                    "clientCode":this.clientCode,
                    "clientCodeType":"1",
                    "userName":encodeURIComponent(this.userName),
                    "userPhone":encodeURIComponent(this.userPhone)
                }

                this.$store.commit('autoSequence');
                const sequence = this.$store.state.login.sequence;
                this.$http.post('/user/join?sequence='+ sequence +'&responseType=json', message)
                .then(res => {
                    if(res.data.result.resultCode == '00'){
                        alert(res.data.result.resultMessage);
                        this.formReset();
                    } else if(res.data.result.resultCode == '28'){
                        alert(res.data.result.resultMessage);
                        this.userPwd = "";
                        this.userPwdCheck = "";
                        this.$refs.pwdRef.focus();
                    } else {
                        alert(res.data.result.resultMessage);
                    }
                });
            }
            
        },
        formReset(){
            this.userId = "";
            this.userPwd = "";
            this.userPwdCheck = "";
            this.userName = "";
            this.userPhone = "";
            this.clienCode = "";
            this.$refs.idRef.focus();
        }
    }
}
</script>

<style scoped>

</style>
