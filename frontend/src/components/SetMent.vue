<template>
    <div class="setMent">

        <div class="main-content">
            <div class="page-content">
                <div class="row">
                    <h2 v-if="mentObject.zeroList" style="text-align:center;">유저의 멘트가 없습니다.</h2>
                    <table v-if="!mentObject.zeroList" class="table table-striped table-bordered table-hover" id="acsSetTable">
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
                                <th width="10%">멘트Idx</th>
                                <th width="10%">멘트이름</th>
                                <th width="40%">멘트설명</th>
                                <th width="20%">수정날짜</th>
                                <th width="20%">멘트타입</th>
                            </tr>
                        </thead>
                        <tbody v-for="(ment, index) in mentObject.mentList" :key="index">
                            <SetMentUnit :ment="ment" :pickList="pickList" @picker="picker"/>
                        </tbody>
                    </table>
                    <div class="modal-footer no-margin-top" id="acsSetPageSelectorDiv"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import EventBus from '@/eventBus/event-bus'
import SetMentUnit from '@/components/SetMentUnit'

export default {
    props:['mentObject'],
    data(){
        return{
            pickList:[]
        }
    },
    created(){
        // 멘트 리셋
        EventBus.$on('MentReset', () => {
            this.pickList = [];
        });
    },
    beforeDestroy(){
        EventBus.$off('MentReset');
    },
    computed:{
        
    },
    components:{
        SetMentUnit
    },
    methods:{
        picker(idx, type, mentName){
            for(let key in this.pickList){
                if(type == 0){
                    if(this.pickList[key].idx == idx){
                        this.pickList.splice(key, 1);
                        break;
                    }
                }
                if(this.pickList[key].type == type){
                    this.pickList.splice(key, 1);
                    break;
                }
            }
            if(type != 0){
                const pick = {
                    "idx":idx,
                    "type":type,
                    "mentName":mentName
                }
                this.pickList.push(pick);
            }
            
            // 이벤트 버스 요청
            EventBus.$emit('pickMent', this.pickList);
        }
    }
}
</script>
