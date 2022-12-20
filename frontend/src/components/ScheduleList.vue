<template>
    <div class="scheduleList">

        <div class="main-content">
            <div class="page-content">
                <div class="row">
                    <h2 v-if="zeroList" style="text-align:center;">유저의 스케줄이 없습니다.</h2>
                    <table v-if="!zeroList" class="table table-striped table-bordered table-hover" id="acsSetTable">
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
                        <tbody v-for="(schedule, index) in scheduleList" :key="index">
                            <ScheduleUnit :schedule="schedule" @scheduleSelect="scheduleSelect"/>
                        </tbody>
                    </table>
                    <div class="modal-footer no-margin-top" id="acsSetPageSelectorDiv"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import ScheduleUnit from '@/components/ScheduleUnit'
import EventBus from '@/eventBus/event-bus'

export default {
    data(){
        return{
            scheduleList:[],
            zeroList: true,
        }
    },
    created(){
        this.scheduleSelect();
        EventBus.$on('reSelectSchedule', () => {
            this.scheduleSelect();
        });
    },
    beforeDestroy(){
        EventBus.$off('reSelectSchedule');
    },
    components:{
        ScheduleUnit
    },
    methods:{
        scheduleSelect(){
            let message = {
                "userId":this.$cookies.get('userId'),
                "loginMarker":this.$cookies.get('loginMarker'),
                "clientCode":this.$cookies.get('clientCode'),
                "clientCodeType":"1",
            }

            this.$store.commit('autoSequence');
            const sequence = this.$store.state.login.sequence;
            this.$http.post('/schedule/select?sequence='+ sequence +'&responseType=json', message)
            .then(res => {
                if(res.data.result.resultCode == '00'){
                    if(res.data.scheduleList.length == 0){
                        this.zeroList = true;
                    } else {
                        this.zeroList = false;
                        this.scheduleList = res.data.scheduleList;
                    }
                } else {
                    alert(res.data.result.resultMessage);
                }
            });
        }
    }
}
</script>
