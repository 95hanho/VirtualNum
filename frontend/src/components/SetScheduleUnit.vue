<template>
    <tr class="setScheduleUnit" @click="pick">
        <td :style="selecting">{{ schedule.scheduleIdx }}</td>
        <td :style="selecting">{{ schedule.scheduleName }}</td>
        <td :style="selecting">{{ scheduleType }}</td>
        <td :style="selecting">{{ startDate }}</td>
        <td :style="selecting">{{ endDate }}</td>
        <td :style="selecting">{{ startTime }}</td>
        <td :style="selecting">{{ endTime }}</td>
        <td :style="selecting">{{ weekType }}</td>
        <td :style="selecting" style="text-align:center;">
            <button style="width:50%;" v-if="pickView">선택</button>
            <button style="width:50%;" v-if="!pickView">취소</button>
        </td>
    </tr>
</template>

<script>
import EventBus from '@/eventBus/event-bus'

export default {
    props:['schedule', 'idx'],
    data(){
        return {
            selecting:"",
            pickView:true,
        }
    },
    created(){
        // 이벤트버스 요청올 때 작동
        EventBus.$on('updatingSetSchedule', (scheduleIdx) => {
            if(scheduleIdx == this.schedule.scheduleIdx){
                this.pick();
            }
        });
    },
    beforeDestroy(){
        EventBus.$off('updatingSetSchedule');
    },
    methods:{
        pick(){
            this.$emit('picker', this.schedule.scheduleIdx);
            // 이벤트 버스 요청
            EventBus.$emit('pickSchedule', this.schedule.scheduleIdx, this.schedule.scheduleName);
        }
    },
    watch:{
        idx(){
            if(this.idx == this.schedule.scheduleIdx){
                this.selecting = "background:silver;"
                this.pickView = false
            } else {
                this.selecting = ""
                this.pickView = true
            }
        }
    },
    computed:{
        scheduleType(){
            if(this.schedule.scheduleType == '1'){
                return '기간'
            } else if(this.schedule.scheduleType == '2') {
                return '매 월'
            } else if(this.schedule.scheduleType == '3') {
                return '매 년'
            }
            return "???"
        },
        startDate(){
            const year = this.schedule.startDate.substring(0, 4)
            const month = this.schedule.startDate.substring(4, 6)
            const day = this.schedule.startDate.substring(6, 8)
            if(this.schedule.scheduleType == '2') {
                return day + "일"
            } else if(this.schedule.scheduleType == '3') {
                return month + "월" + day + "일"
            } else {
                return year + "." + month + "." + day
            }
        },
        endDate(){
            const year = this.schedule.endDate.substring(0, 4)
            const month = this.schedule.endDate.substring(4, 6)
            const day = this.schedule.endDate.substring(6, 8)
            if(this.schedule.scheduleType == '2') {
                return day + "일"
            } else if(this.schedule.scheduleType == '3') {
                return month + "월" + day + "일"
            } else {
                return year + "." + month + "." + day
            }
        },
        startTime(){
            return this.schedule.startTime.substring(0,2) + "시" + this.schedule.startTime.substring(2,4) + "분"
        },
        endTime(){
            return this.schedule.endTime.substring(0,2) + "시" + this.schedule.endTime.substring(2,4) + "분"
        },
        weekType(){
            let weektype = "";
            if(this.schedule.weekType.charAt(0) == 0){
                weektype = weektype + '일'
            }
            if(this.schedule.weekType.charAt(1) == 0){
                weektype = weektype + '월'
            }
            if(this.schedule.weekType.charAt(2) == 0){
                weektype = weektype + '화'
            }
            if(this.schedule.weekType.charAt(3) == 0){
                weektype = weektype + '수'
            }
            if(this.schedule.weekType.charAt(4) == 0){
                weektype = weektype + '목'
            }
            if(this.schedule.weekType.charAt(5) == 0){
                weektype = weektype + '금'
            }
            if(this.schedule.weekType.charAt(6) == 0){
                weektype = weektype + '토'
            }
            if(!weektype){
                weektype = "없음"
            }
            return weektype
        }
    }
}
</script>
