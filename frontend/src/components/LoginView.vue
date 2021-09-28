<template lang="html">
    <div class="loginview">
        
        <div class="main-container">
            <div class="main-content">
                <div class="row">
                    <div class="col-sm-8 col-sm-offset-1">
                        <div class="login-container">
                            <div class="center">
                                <h1>
                                    <span class="blue">세종 가상번호 조회서비스</span>
                                </h1>
                                <h4 class="red">세종텔레콤</h4>
                            </div>
                            <div class="space-6"></div>
                            <div class="position-relative">
                                <div class="login-box visible widget-box no-border">
                                    <div class="widget-body">
                                        <div class="widget-main">
                                            <h4 class="header blue lighter bigger">
                                                <i class="icon-coffee green"></i>
                                                가입자 정보를 입력하세요.
                                            </h4>
                                            <div class="space-6"></div>
                                            <div id="user">
                                                <fieldset>
                                                    <label class="block clearfix">
                                                        <span class="block input-icon input-icon-right">
                                                            <input type="text" class="form-control" placeholder="UserID" v-model="user.userId" @keyup.enter="login" ref="userIdRef">
                                                            <i class="icon-user"></i>
                                                        </span>
                                                    </label>

                                                    <label class="block clearfix">
                                                        <span class="block input-icon input-icon-right">
                                                            <input type="password" class="form-control" placeholder="Password" v-model="user.userPwd" @keyup.enter="login" ref="pwdRef">
                                                            <i class="icon-lock"></i>
                                                        </span>
                                                    </label>

                                                    <label class="block clearfix">
                                                        <span class="block input-icon input-icon-right">
                                                            <input type="text" class="form-control" placeholder="ClientCode" v-model="user.clientCode" @keyup.enter="login" ref="clientCodeRef">
                                                            <i class="icon-code"></i>
                                                        </span>
                                                    </label>

                                                    <div id="lower">
                                                        <span class="red">{{ loginResult }}</span>
                                                    </div>

                                                    <div class="space"></div>

                                                    <div class="clearfix">
                                                        <button class="width-35 pull-right btn-sm btn-primary" @click="login">
                                                            <i class="icon-key"></i>
                                                            Login
                                                        </button>
                                                    </div>
                                                    <div class="space-4"></div>
                                                </fieldset>
                                            </div>
                                        </div>
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
            user:{
                // 기본 테스트 id
                userId:"naver_t",
                userPwd:"qnrlqnrk123",
                clientCode:"402",
                //userId:"test",
                //userPwd:"test123123",
                // vns번호 다가진 id
                //userId:"naver_t2",
                //userPwd:"qnrlqnrk123"
                // 관리자 id
                //userId:"admin",
                //userPwd:"admin123123",
            },
            loginResult:""
        }
    },
    methods: {
        async login(){
            if(this.user.userId.length == 0){
                alert('유저 아이디를 입력해주세요');
                this.$refs.userIdRef.focus();
            } else if(this.user.userPwd.length < 10){
                alert('비밀번호를 10자리 이상 입력해주세요.');
                this.$refs.pwdRef.focus();
            } else if(this.user.clientCode.length == 0){
                alert('ClientCode를 입력해주세요');
                this.$refs.clientCodeRef.focus();
            } else {

                //this.$store.commit('autoSequence');
                //console.log(this.$store.state.login.sequence);
                let message = {
                    "userId":this.user.userId,
                    "userPwd":this.user.userPwd,
                    "clientCode":this.user.clientCode,
                    "clientCodeType":"1"
                }

                // aes암호화해야하는지 확인
                await this.$http.get('/encrypt/state')
                .then(async (res) => {
                    if(res.data.encrypt.state == 'on'){
                        console.log('서버요청 암호화');
                        this.$store.commit('aesOn');
                        await this.$store.dispatch('aes128', message)
                        .then((res) => {
                            message = res;
                        });
                    }
                }).catch(async (error)=>{
                    if(error.message == 'Request failed with status code 404'){
                        console.log('강제 서버요청 암호화');
                        this.$store.commit('aesOn');
                        await this.$store.dispatch('aes128', message)
                        .then((res) => {
                            message = res;
                        });
                    }
                });
                
                const sequence = this.$store.state.login.sequence;
                this.$http.post('/user/login?sequence='+ sequence +'&responseType=json',message/*message2*/)
                .then(async res => {
                    if(res.data.result.resultCode == '00'){
                        const loginInfo = {
                            userId:this.user.userId,
                            loginMarker:res.data.result.resultMessage,
                            clientCode:this.user.clientCode
                        }
                        await this.$store.commit('login', loginInfo);
                        EventBus.$emit('login');
                        this.$router.push({name: 'Main'});
                    } else {
                        this.loginResult = res.data.result.resultMessage;
                    }
                });

            }
        }
    }
}
</script>

<style scoped>
.position-relative{
    position: relative;
    border: 3px solid black;
    background: black;
}
</style>
