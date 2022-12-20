<template>
    <div class="ibizSettingList">
        
        <div class="main-content">
            <div class="page-content">
                <div class="row">
                    <h2 v-if="zeroList" style="text-align:center;">유저의 050번호가 없습니다.</h2>
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
                                <th width="10%">050Idx</th>
                                <th width="30%">050번호</th>
                                <th width="20%">defaultSetIdx</th>
                                <th width="20%">defaultSetName</th>
                                <th width="20%"></th>
                            </tr>
                        </thead>
                        <tbody v-for="(vnsNumber, index) in vnsNumberList" :key="index">
                            <VnsUnit :vnsNumber="vnsNumber" @vnsSelect="vnsSelect"/>
                        </tbody>
                    </table>
                    <div class="modal-footer no-margin-top" id="acsSetPageSelectorDiv"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import VnsUnit from '@/components/VnsUnit'
import EventBus from '@/eventBus/event-bus';

export default {
    data(){
        return{
            vnsNumberList:[],
            zeroList: false,
        }
    },
    created(){
        this.vnsSelect();
        // 이벤트버스 요청올 때 작동
        EventBus.$on('reSelectVns', () => {
            this.vnsSelect();
        });
    },
    beforeDestroy(){
        EventBus.$off('reSelectVns');
    },
    components:{
        VnsUnit
    },
    methods:{
        vnsSelect(){
            let message = {
                "userId":this.$cookies.get('userId'),
                "loginMarker":this.$cookies.get('loginMarker'),
                "clientCode":this.$cookies.get('clientCode'),
                "clientCodeType":"1",
                // vnsIdx 알기위해서 (=23589)
                //"vnsNumber":"050701006001"
            }

            this.$store.commit('autoSequence');
            const sequence = this.$store.state.login.sequence;
            this.$http.post('/number/ibiz/vns/select?sequence='+ sequence +'&responseType=json', message)
            .then(res => {
                if(res.data.result.resultCode == '00'){
                    if(res.data.vnsNumberList.length == 0){
                        this.zeroList = true;
                    } else {
                        this.zeroList = false;
                        this.vnsNumberList = res.data.vnsNumberList;
                    }
                    
                } else {
                    alert(res.data.result.resultMessage);
                }
            });
        }
    }
}
</script>

<style>
button {
    width:45%;
    height:100%;
    margin-left: 5px;
    box-shadow: inset 0px 0px 33px 0px #91b8b3;
    background: linear-gradient(to bottom, #768d87 5%, #6c7c7c 100%);
    background-color: #768d87;
    border-radius: 5px;
    border: 1px solid #566963;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-family: Arial;
    font-size: 14px;
    font-weight: bold;
    text-decoration: none;
    text-shadow: 0px 0px 0px #2b665e;
}
button:hover{
    background: linear-gradient(to bottom, #6c7c7c 5%, #768d87 100%);
    background-color: #6c7c7c;
}
button:active{
    position:relative;
    top:1px;
}
tbody:nth-of-type(odd)>tr>td{
    background-color: white;
}
input{
    width:100%;
    height:100%;
    font-size:15px;
}
select{
    width:100%;
    height:100%;
    font-size: 15px;
}
#acsSetPageSelectorDiv{
    width:100%;
}
</style>
