<template>
    <tr class="setmentUnit">
        <td :style="selecting">{{ ment.mentIdx }}</td>
        <td :style="selecting">
            {{ ment.mentName }}
        </td>
        <td :style="selecting">
            {{ ment.mentDesc }}
        </td>
        <td :style="selecting">
            {{ ment.modDate }}
        </td>
        <td style="text-align:center;" :style="selecting">
            <select class="form-control" v-model="mentType">
                <option value=0>없음</option>
                <option value=1>1</option>
                <option value=2>2</option>
                <option value=3>3</option>
                <option value=4>4</option>
            </select>
        </td>
    </tr>
</template>

<script>
import EventBus from '@/eventBus/event-bus'

export default {
    props:['ment', 'pickList'],
    data(){
        return{
            mentType:0,
            selecting:"",
            updating:false,
        }
    },
    created(){
        // 이벤트버스 요청올 때 작동
        EventBus.$on('updatingMent', (mentList) => {
            for(let key in mentList){
                if(this.ment.mentIdx == mentList[key].mentIdx){
                    this.updating = true;
                    this.mentType = Number(mentList[key].mentType);
                }
            }
        });
    },
    beforeDestroy(){
        EventBus.$off('updatingMent');
    },
    computed:{
    },
    watch:{
        mentType:{
            deep:false,
            handler(mentType){
                this.$emit('picker', this.ment.mentIdx, mentType, this.ment.mentName);
            }
        },
        pickList:{
            deep:true,
            handler(pickList){
                var exist = false;
                for(let key in pickList){
                    if(pickList[key].idx == this.ment.mentIdx){
                        exist = true;
                        this.mentType = pickList[key].type;
                    }
                }
                if(!exist){
                    this.mentType = 0;
                    this.selecting = "";
                } else {
                    this.selecting = "background:silver;"
                }
            }
        }
    }
}
</script>
