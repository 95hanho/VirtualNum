<template>
    <tr class="calledUnit">
        <td :style="selecting">
            {{ calledNumber.calledIdx }}
        </td>
        <td :style="selecting">
            <input type="text" style="" v-model="calledNumber.calledNumber" ref="calledNumRef" :disabled="!updating">
        </td>
        <td :style="selecting">
            <!-- 기본 -->
            <button v-if="!updating" @click="formUpdate">수정</button>
            <button v-if="!updating" @click="calledDelete">삭제</button>
            <!-- 수정 시 -->
            <button v-if="updating" @click="vnsUpdate">완료</button>
            <button v-if="updating" @click="updateCancel">취소</button>
        </td>
    </tr>
</template>

<script>
export default {
    props:['calledNumber'],
    data(){
        return{
            updating:false,
            updateNumStore:"",
            selecting:""
        }
    },
    methods:{
        formUpdate(){
            this.updating = true;
            this.selecting = "background:silver;";
            this.updateNumStore = this.calledNumber.calledNumber;
            setTimeout(() => {
                this.$refs.calledNumRef.focus();
            }, 400);
        },
        vnsUpdate(){
            let message = {
                "userId":this.$cookies.get('userId'),
                "loginMarker":this.$cookies.get('loginMarker'),
                "clientCode":this.$cookies.get('clientCode'),
                "clientCodeType":"1",
                "calledIdx":this.calledNumber.calledIdx,
                "calledNumber":this.calledNumber.calledNumber,
            }

            this.$store.commit('autoSequence');
            const sequence = this.$store.state.login.sequence;
            this.$http.post('/number/ibiz/called/update?sequence='+ sequence +'&responseType=json', message)
            .then(res => {
                if(res.data.result.resultCode == '00'){
                    alert(res.data.result.resultMessage);
                    this.updating = false;
                    this.selecting = "";
                    this.$emit('calledSelect');
                } else {
                    alert(res.data.result.resultMessage);
                }
                
            });
        },
        updateCancel(){
            this.updating = false;
            this.selecting = "";
            this.calledNumber.calledNumber = this.updateNumStore;
        },
        calledDelete(){
            const result = confirm('[ ' + this.calledNumber.calledNumber + ' ] 을 삭제할까요?');
            if(result){
                let message = {
                    "userId":this.$cookies.get('userId'),
                    "loginMarker":this.$cookies.get('loginMarker'),
                    "clientCode":this.$cookies.get('clientCode'),
                    "clientCodeType":"1",
                    "calledIdx":this.calledNumber.calledIdx,
                }
                
                this.$store.commit('autoSequence');
                const sequence = this.$store.state.login.sequence;
                this.$http.post('/number/ibiz/called/delete?sequence='+ sequence +'&responseType=json', message)
                .then(res => {
                    if(res.data.result.resultCode == '00'){
                        alert(res.data.result.resultMessage);
                        this.$emit('calledSelect');
                    } else {
                        alert(res.data.result.resultMessage);
                    }
                    
                });
            }
        },
    }
}
</script>

<style scoped>
input[disabled] {
    background-color: white;
}
input{
    background-color: beige;
}
</style>
