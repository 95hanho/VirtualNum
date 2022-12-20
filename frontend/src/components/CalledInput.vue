<template>
    <div class="calledInput">

        <div class="main-content">
            <div class="page-content" id="acsSetPageContent">
                <div class="row">
                    <div class="widget-header widget-header-small">
                        <h5 class="lighter">IBIZ 착신 번호 등록</h5>
                    </div>
                    <div class="widget-body">
                        <div class="widget-main">
                            <div class="row" style="height:90px;">
                                <div class="input-group col-xs-5">
                                    <label>착신 번호</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-phone bigger-110"></i>
                                        </span>
                                        <input class="form-control" v-model="calledNumber" ref="calledRef" @keyup.enter="calledInput">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-group pull-right col-xs-4">
                                    <div class="input-group" id="inputBtn">
                                        <button class="btn btn-primary btn-sm callDiv" style="margin-left:5px;" @click="formReset">
                                            리셋<i class="icon-download icon-on-right bigger-110"></i>
                                        </button>
                                        <button class="btn btn-success btn-sm callDiv" @click="calledInput">
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
import EventBus from '@/eventBus/event-bus';

export default {
    data(){
        return{
            calledNumber:"",
            //calledNumber:"01012341234",
        }
    },
    methods:{
        calledInput(){
            let message = {
                "userId":this.$cookies.get('userId'),
                "loginMarker":this.$cookies.get('loginMarker'),
                "clientCode":this.$cookies.get('clientCode'),
                "clientCodeType":"1",
                "calledNumber":this.calledNumber,
            }

            this.$store.commit('autoSequence');
            const sequence = this.$store.state.login.sequence;
            this.$http.post('/number/ibiz/called/insert?sequence='+ sequence +'&responseType=json', message)
            .then(res => {
                if(res.data.result.resultCode == '00'){
                    alert(res.data.result.resultMessage);
                    // 이벤트 버스 요청
                    EventBus.$emit('reSelectCalled');
                    this.formReset();
                } else {
                    alert(res.data.result.resultMessage);
                }
                
            });
        },
        formReset(){
            this.calledNumber = "";
            this.$refs.calledRef.focus();
        }
    }
}
</script>
