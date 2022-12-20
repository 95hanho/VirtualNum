<template>
    <tr class="setVnsUnit" @click="pick">
        <td :style="selecting">{{ vnsNumber.vnsIdx }}</td>
        <td :style="selecting">
            {{ vnsNumber.vnsNumber }}
        </td>
        <td :style="selecting">
            {{ vnsNumber.defaultSetIdx }}
        </td>
        <td :style="selecting">
            {{ vnsNumber.defaultSetName }}
        </td>
        <td style="text-align:center;" :style="selecting">
            <button style="width:50%;" v-if="pickView" >선택</button>
            <button style="width:50%;" v-if="!pickView">취소</button>
        </td>
    </tr>
</template>

<script>
import EventBus from '@/eventBus/event-bus'

export default {
    props:['vnsNumber', 'idx'],
    data(){
        return{
            selecting:"",
            pickView:true,
        }
    },
    created(){
        // 이벤트버스 요청올 때 작동
        EventBus.$on('updatingVnsNumber', (vnsIdx) => {
            if(vnsIdx == this.vnsNumber.vnsIdx){
                this.pick();
            }
        });
    },
    beforeDestroy(){
        EventBus.$off('updatingVnsNumber');
    },
    methods:{
        pick(){
            this.$emit('picker', this.vnsNumber.vnsIdx);
            // 이벤트 버스 요청
            EventBus.$emit('pickVnsNumber', this.vnsNumber.vnsIdx, this.vnsNumber.vnsNumber);
        }
    },
    watch:{
        idx(){
            if(this.idx == this.vnsNumber.vnsIdx){
                this.selecting = "background:silver;"
                this.pickView = false
            } else {
                this.selecting = ""
                this.pickView = true
            }
        }
    },
}
</script>
