<template>
    <div class="setSchedule">

        <div class="main-content">
            <div class="page-content">
                <div class="row">
                    <h2 v-if="scheduleObject.zeroList" style="text-align:center;">유저의 스케줄이 없습니다.</h2>
                    <table v-if="!scheduleObject.zeroList" class="table table-striped table-bordered table-hover" id="acsSetTable">
                        <thead>
                            <tr>
                                <th width="7%">스케줄Idx</th>
                                <th width="14%">스케줄이름</th>
                                <th width="8%">스케줄타입</th>
                                <th width="10%">시작일</th>
                                <th width="10%">종료일</th>
                                <th width="10%">시작시간</th>
                                <th width="10%">종료시간</th>
                                <th width="11%">제외 요일</th>
                                <th width="20%"></th>
                            </tr>
                        </thead>
                        <tbody v-for="(schedule, index) in scheduleObject.scheduleList" :key="index">
                            <SetScheduleUnit :schedule="schedule" :idx="idx" @picker="picker"/>
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
import SetScheduleUnit from '@/components/SetScheduleUnit'

export default {
    props:['scheduleObject'],
    data(){
        return{
            idx:"",
        }
    },
    created(){
        // 스케줄 리셋
        EventBus.$on('ScheduleReset', () => {
            this.idx = "";
        });
    },
    beforeDestroy(){
        EventBus.$off('ScheduleReset');
    },
    components:{
        SetScheduleUnit
    },
    methods:{
        picker(value){
            if(this.idx == value){
                this.idx = "";
            } else {
                this.idx = value;
            }
        }
    }
}
</script>
