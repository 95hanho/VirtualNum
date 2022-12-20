<template>
    <tr class="scheduleUnit">
        <td :style="selecting">{{ schedule.scheduleIdx }}</td>
        <td :style="selecting">{{ schedule.scheduleName }}</td>
        <td :style="selecting">{{ scheduleType }}</td>
        <td :style="selecting">{{ startDate }}</td>
        <td :style="selecting">{{ endDate }}</td>
        <td :style="selecting">{{ startTime }}</td>
        <td :style="selecting">{{ endTime }}</td>
        <td :style="selecting">{{ weekType }}</td>
        <td :style="selecting">
            <button @click="scheduleUpdate">수정</button>
            <button @click="scheduleDelete">삭제</button>
        </td>
    </tr>
</template>

<script>
import EventBus from '@/eventBus/event-bus'

export default {
    props:['schedule'],
    data(){
        return {
            updatingIdx:"",
            selecting:""
        }
    },
    watch:{
        updatingIdx(value){
            if(value == this.schedule.scheduleIdx){
                this.selecting = "background:silver;";
            } else {
                this.selecting = "";
            }
        }
    },
    created(){
        EventBus.$on('updatingIdx', (updatingIdx) => {
            this.updatingIdx = updatingIdx;
        });
    },
    beforeDestroy(){
        EventBus.$off('updatingIdx');
    },
    methods:{
        scheduleUpdate(){
            // 이벤트 버스 요청
            EventBus.$emit('updatingSchedule', this.schedule);
        },
        scheduleDelete(){
            const result = confirm('[ ' + this.schedule.scheduleName + ' ] 을 삭제할까요?');
            if(result){
                let message = {
                    "userId":this.$cookies.get('userId'),
                    "loginMarker":this.$cookies.get('loginMarker'),
                    "clientCode":this.$cookies.get('clientCode'),
                    "clientCodeType":"1",
                    "scheduleIdx":this.schedule.scheduleIdx
                }

                this.$store.commit('autoSequence');
                const sequence = this.$store.state.login.sequence;
                this.$http.post('/schedule/delete?sequence='+ sequence +'&responseType=json', message)
                .then(res => {
                    if(res.data.result.resultCode == '00'){
                        alert(res.data.result.resultMessage);
                        this.$emit('scheduleSelect');
                        // 이벤트 버스 요청
                        EventBus.$emit('deleteReset');
                    } else {
                        alert(res.data.result.resultMessage);
                    }
                    
                });
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
