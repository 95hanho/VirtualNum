<template>
    <div class="userInfo">

        <div class="main-content">
            <div class="page-content" id="acsSetPageContent">
                <div class="row">
                    <div class="widget-header widget-header-small">
                        <h5 class="lighter">내 정보</h5>
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
                                        <input class="form-control" v-model="userId" disabled>
                                    </div>
                                </div>
                                <div class="input-group col-xs-4">
                                    <label>가입자 이름</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-user-md bigger-110"></i>
                                        </span>
                                        <input class="form-control" v-model="userName" :disabled="!updating" ref="nameRef" @keyup.enter="updateUser">
                                    </div>
                                </div>
                                <div class="input-group col-xs-4">
                                    <label>가입자 번호</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-phone bigger-110"></i>
                                        </span>
                                        <input class="form-control" v-model="userPhone" :disabled="!updating" ref="phoneRef" @keyup.enter="updateUser">
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="height:90px;">
                                <div class="input-group col-xs-4">
                                    <label>IBIZ Code</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-phone bigger-110"></i>
                                        </span>
                                        <input class="form-control" v-model="ibizCode" disabled>
                                    </div>
                                </div>
                                <div class="input-group col-xs-4">
                                    <label>현재 ClientCode</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-code bigger-110"></i>
                                        </span>
                                        <input class="form-control" v-model="clientCode" disabled>
                                    </div>
                                </div>
                            </div>
                            <div v-if="changing" class="row">
                                <div class="input-group col-xs-4">
                                    <label>유저 비밀번호</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-lock bigger-110"></i>
                                        </span>
                                        <input type="password" class="form-control" v-model="userPwd" ref="pwdRef" @keyup.enter="changePwd">
                                    </div>
                                </div>
                                <div class="input-group col-xs-4">
                                    <label>비밀번호 확인</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-lock bigger-110"></i>
                                        </span>
                                        <input type="password" class="form-control" v-model="userPwdCheck" ref="pwdCheckRef" @keyup.enter="changePwd">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-group pull-right col-xs-4">
                                    <div class="input-group" id="inputBtn">
                                        <button v-if="!updating&&!changing" @click="pwdChanging" class="btn btn-primary btn-sm callDiv" style="margin-left:5px;">
                                            암호변경<i class="icon-download icon-on-right bigger-110" ></i>
                                        </button>
                                        <button v-if="!updating&&!changing" class="btn btn-success btn-sm callDiv" @click="updatingUser">
                                            수정하기<i class="icon-magic icon-on-right bigger-110"></i>
                                        </button>

                                        <button v-if="updating" @click="updateCancel" class="btn btn-danger btn-sm callDiv" style="margin-left:5px;">
                                            수정취소<i class="icon-download icon-on-right bigger-110"></i>
                                        </button>
                                        <button v-if="updating" @click="updateUser" class="btn btn-warning btn-sm callDiv" >
                                            수정완료<i class="icon-magic icon-on-right bigger-110"></i>
                                        </button>

                                        <button v-if="changing" @click="changeCancel" class="btn btn-danger btn-sm callDiv" style="margin-left:5px;">
                                            변경취소<i class="icon-download icon-on-right bigger-110"></i>
                                        </button>
                                        <button v-if="changing" @click="changePwd" class="btn btn-warning btn-sm callDiv" >
                                            변경완료<i class="icon-magic icon-on-right bigger-110"></i>
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
import EventBus from '@/eventBus/event-bus'

export default {
    data(){
        return{
            updating:false,
            changing:false,
            userId:"",
            userName:"",
            userPhone:"",
            ibizCode:"",
            clientCode:"",
            userPwd:"",
            userPwdCheck:""
        }
    },
    created(){
        this.selectUser();
    },
    methods:{
        selectUser(){
            let message = {
                "userId":this.$cookies.get('userId'),
                "loginMarker":this.$cookies.get('loginMarker'),
                "clientCode":this.$cookies.get('clientCode'),
                "clientCodeType":"1",
            }

            this.$store.commit('autoSequence');
            const sequence = this.$store.state.login.sequence;
            this.$http.post('/user/select?sequence='+ sequence +'&responseType=json', message)
            .then(res => {
                if(res.data.result.resultCode == '00'){
                    this.userId = res.data.user.userId;
                    this.userName = res.data.user.userName;
                    this.userPhone = res.data.user.userPhone;
                    this.ibizCode = res.data.user.ibizCode;
                    this.clientCode = this.$cookies.get('clientCode');
                } else {
                    alert(res.data.result.resultMessage);
                }
            });
        },
        updatingUser(){
            this.updating = true;
        },
        updateCancel(){
            this.updating = false;
            this.selectUser();
        },
        updateUser(){
            if(this.userName.length == 0){
                alert('가입자 이름을 입력해주세요.')
                this.$refs.nameRef.focus();
            } else if(this.userPhone.length == 0){
                alert('가입자 번호를 입력해주세요.');
                this.$refs.phoneRef.focus();
            } else {
                let message = {
                    "userId":this.$cookies.get('userId'),
                    "loginMarker":this.$cookies.get('loginMarker'),
                    "clientCode":this.$cookies.get('clientCode'),
                    "clientCodeType":"1",
                    "userName":encodeURIComponent(this.userName),
                    "userPhone":encodeURIComponent(this.userPhone)
                }

                this.$store.commit('autoSequence');
                const sequence = this.$store.state.login.sequence;
                this.$http.post('/user/change/info?sequence='+ sequence +'&responseType=json', message)
                .then(res => {
                    if(res.data.result.resultCode == '00'){
                        alert(res.data.result.resultMessage);
                        this.updating = false;
                        EventBus.$emit('login', this.userName);
                    } else {
                        alert(res.data.result.resultMessage);
                    }
                });
            }
            
        },
        pwdChanging(){
            this.changing = true;
        },
        changeCancel(){
            this.changing = false;
        },
        changePwd(){
            if(this.userPwd.length == 0){
                alert('유저 비밀번호를 입력해주세요.');
                this.$refs.pwdRef.focus();
            } else if(this.userPwdCheck.length == 0){
                alert('비밀번호 확인을 입력해주세요.');
                this.$refs.pwdCheckRef.focus();
            } else if(this.userPwd != this.userPwdCheck){
                alert('비밀번호가 일치하지 않습니다.');
                this.$refs.pwdCheckRef.focus();
            } else {
                let message = {
                    "userId":this.$cookies.get('userId'),
                    "loginMarker":this.$cookies.get('loginMarker'),
                    "clientCode":this.$cookies.get('clientCode'),
                    "clientCodeType":"1",
                    "newUserPwd":this.userPwd
                }

                this.$store.commit('autoSequence');
                const sequence = this.$store.state.login.sequence;
                this.$http.post('/user/change/password?sequence='+ sequence +'&responseType=json', message)
                .then(res => {
                    if(res.data.result.resultCode == '00'){
                        alert(res.data.result.resultMessage);
                        this.userPwd = "";
                        this.userPwdCheck ="";
                        this.changing = false;
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
        }
    }
}
</script>

<style scoped>
input[disabled]{
    background-color: beige;
}
</style>
