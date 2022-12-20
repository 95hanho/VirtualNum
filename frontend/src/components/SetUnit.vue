<template>
    <tr class="setUnit">
        <td :style="selecting">{{ set.setIdx }}</td>
        <td :style="selecting">{{ set.setName }}</td>
        <td :style="selecting">
            <input type="text" style="text-align:center;" v-model="set.setWeight" ref="setWeightRef" :disabled="!prioritizing">
        </td>
        <td :style="selecting">{{ setType }}</td>
        <td :style="selecting">{{ set.schedule.scheduleName }}</td>
        <td :style="selecting">{{ set.vnsNumber.vnsNumber }}</td>
        <td :style="selecting">{{ calledNumber }}</td>
        <td :style="selecting">{{ ment }}</td>
        <td :style="prioritizeStyle||selecting">
            <button v-if="!prioritizing" @click="setUpdate">수정</button>
            <button v-if="!prioritizing" @click="setDelete">삭제</button>

            <button v-if="prioritizing" style="width:60%" @click="prioritize">우선순위 변경</button>
        </td>
    </tr>
</template>

<script>
import EventBus from '@/eventBus/event-bus'

export default {
    props:['set', 'updateSetIdx'],
    data(){
        return{
            prioritizing:false,
            prioritizeStyle:"",
            selecting:"",
        }
    },
    watch:{
        updateSetIdx(value){
            if(this.set.setIdx == value){
                this.selecting = "background:silver;"
            } else {
                this.selecting = ""
            }
        }
    },
    created(){
        // 우선순위 변경ing 
        EventBus.$on('prioritize', () => {
            this.prioritizing = true;
            this.prioritizeStyle = "text-align:center;"
        });
        // 우선순위 변경취소
        EventBus.$on('prioritizeCancel', () => {
            this.prioritizing = false;
            this.prioritizeStyle = ""
        });
    },
    beforeDestroy(){
        EventBus.$off('prioritize');
        EventBus.$off('prioritizeCancel');
    },
    methods:{
        setUpdate(){
            // 이벤트 버스 요청
            this.$emit('setUpdateForm', this.set);
        },
        setDelete(){
            const result = confirm('[ ' + this.set.setName + ' ] 을 삭제할까요?');
            if(result){
                let message = {
                    "userId":this.$cookies.get('userId'),
                    "loginMarker":this.$cookies.get('loginMarker'),
                    "clientCode":this.$cookies.get('clientCode'),
                    "clientCodeType":"1",
                    "setIdx":this.set.setIdx
                }

                this.$store.commit('autoSequence');
                const sequence = this.$store.state.login.sequence;
                this.$http.post('/set/delete?sequence='+ sequence +'&responseType=json', message)
                .then(res => {
                    if(res.data.result.resultCode == '00'){
                        alert(res.data.result.resultMessage);
                        // 이벤트 버스 요청
                        EventBus.$emit('deleteSet');
                    } else {
                        alert(res.data.result.resultMessage);
                    }
                });
            }
        },
        prioritize(){
            const result = confirm('[ ' + this.set.setName + ' ] 의 우선순위를 변경할까요?');
            if(result){
                let message = {
                    "userId":this.$cookies.get('userId'),
                    "loginMarker":this.$cookies.get('loginMarker'),
                    "clientCode":this.$cookies.get('clientCode'),
                    "clientCodeType":"1",
                    "setList":[
                        {
                            "setIdx":this.set.setIdx,
                            "setWeight":this.set.setWeight
                        }
                    ]
                }

                this.$store.commit('autoSequence');
                const sequence = this.$store.state.login.sequence;
                this.$http.post('/set/change/weight?sequence='+ sequence +'&responseType=json', message)
                .then(res => {
                    if(res.data.result.resultCode == '00'){
                        alert(res.data.result.resultMessage);
                    } else {
                        alert(res.data.result.resultMessage);
                    }
                });
            }
        }
    },
    computed:{
        setType(){
            if(this.set.setType == 1){
                return '호 연결'
            } else if(this.set.setType == 2){
                return '호 종료'
            }
            return ''
        },
        calledNumber(){
            if(this.set.calledNumberList.length != 0){
                let calledNumber = this.set.calledNumberList[0].calledNumber;

                for(let key in this.set.calledNumberList){
                    if(key > 0){
                        calledNumber += ', ' + this.set.calledNumberList[key].calledNumber;
                    }
                }

                return calledNumber;
            } else {
                return "";
            }
            
            
        },
        ment(){
            if(this.set.mentList.length != 0){
                var ment = '[' + this.set.mentList[0].mentName + ', ' + this.set.mentList[0].mentType + '타입]';

                for(let key in this.set.mentList){
                    if(key > 0){
                        ment += ', [' + this.set.mentList[key].mentName + ', ' + this.set.mentList[key].mentType + '타입]';
                    }
                }
            }
            
            return ment;
        }
    },
    
}
</script>

<style scoped>
input[disabled] {
    background-color: beige;
}
</style>
