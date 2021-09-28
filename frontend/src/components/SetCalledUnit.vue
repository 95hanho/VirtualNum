<template>
    <tr class="setCalledUnit" @click="pick">
        <td :style="selecting">{{ calledNumber.calledIdx }}</td>
        <td :style="selecting">
            {{ calledNumber.calledNumber }}
        </td>
        <td style="text-align:center;" :style="selecting">
            <button style="width:50%;" v-if="pickView">선택</button>
            <button style="width:50%;" v-if="!pickView">취소</button>
        </td>
    </tr>
</template>

<script>
import EventBus from '@/eventBus/event-bus'

export default {
    props:['calledNumber'],
    data(){
        return{
            selecting:"",
            pickView:true,
        }
    },
    created(){
        // 이벤트버스 요청올 때 작동
        EventBus.$on('updatingCalledNumber', (calledNumberList) => {
            for(let key in calledNumberList){
                if(this.calledNumber.calledIdx == calledNumberList[key].calledIdx){
                    this.pick();
                }
            }
        });
        // 착신번호 리셋
        EventBus.$on('CalledNumberReset', () => {
            this.selecting = ""
            this.pickView = true
        });
    },
    beforeDestroy(){
        EventBus.$off('updatingCalledNumber');
        EventBus.$off('CalledNumberReset');
    },
    methods:{
        pick(){
            if(this.pickView){
                this.selecting = "background:silver;"
                this.pickView = false
            } else {
                this.selecting = ""
                this.pickView = true
            }
            // 이벤트 버스 요청
            EventBus.$emit('pickcalledNumber', this.calledNumber.calledIdx, this.calledNumber.calledNumber);
        },
    }
}
</script>
