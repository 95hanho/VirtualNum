<template>
    <div class="calledList">

        <div class="main-content">
            <div class="page-content">
                <div class="row">
                    <h2 v-if="zeroList" style="text-align:center;">유저의 착신번호가 없습니다.</h2>
                    <table v-if="!zeroList" class="table table-striped table-bordered table-hover" id="acsSetTable">
                        <!--
                        <thead>
                            <tr>
                                <th width="25%">가상번호</th>
                                <th width="15%">유저아이디</th>
                                <th width="30%">멘트경로</th>
                                <th width="10%"><span data-trigger="hover" title="설정의 현재 상태를 의미합니다.">상태</span></th>
                                <th width="20%"></th>
                            </tr>
                        </thead>
                        -->
                        <thead>
                            <tr>
                                <th width="20%">착신Idx</th>
                                <th width="60%">착신번호</th>
                                <th width="20%"></th>
                            </tr>
                        </thead>
                        <tbody v-for="(calledNumber, index) in calledNumberList" :key="index">
                            <CalledUnit :calledNumber="calledNumber" @calledSelect="calledSelect"/>
                        </tbody>
                    </table>
                    <div class="modal-footer no-margin-top" id="acsSetPageSelectorDiv"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import CalledUnit from '@/components/CalledUnit'
import EventBus from '@/eventBus/event-bus'

export default {
    data(){
        return{
            calledNumberList:[],
            zeroList: false,
        }
    },
    created(){
        this.calledSelect();
        // 이벤트버스 요청올 때 작동
        EventBus.$on('reSelectCalled', () => {
            this.calledSelect();
        });
    },
    beforeDestroy(){
        EventBus.$off('reSelectCalled');
    },
    components:{
        CalledUnit
    },
    methods:{
        calledSelect(){
            let message = {
                "userId":this.$cookies.get('userId'),
                "loginMarker":this.$cookies.get('loginMarker'),
                "clientCode":this.$cookies.get('clientCode'),
                "clientCodeType":"1",
            }

            this.$store.commit('autoSequence');
            const sequence = this.$store.state.login.sequence;
            this.$http.post('/number/ibiz/called/select?sequence='+ sequence +'&responseType=json', message)
            .then(res => {
                if(res.data.result.resultCode == '00'){
                    if(res.data.calledNumberList.length == 0){
                        this.zeroList = true;
                    } else {
                        this.zeroList = false;
                        this.calledNumberList = res.data.calledNumberList;
                    }
                    
                } else {
                    alert(res.data.result.resultMessage);
                }
            });
        }
    }
}
</script>
