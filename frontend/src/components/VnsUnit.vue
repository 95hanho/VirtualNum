<template>
    <tr class="vnsUnit">
        <td :style="selecting">
            {{ vnsNumber.vnsIdx }}
        </td>
        <td :style="selecting">
            <input type="text" style="" v-model="vnsNumber.vnsNumber" ref="vnsNumRef" :disabled="!updating">
        </td>
        <td :style="selecting">
            {{ vnsNumber.defaultSetIdx }}
        </td>
        <td :style="selecting">
            {{ vnsNumber.defaultSetName }}
        </td>
        <td :style="selecting">
            <!-- 기본 -->
            <button v-if="!updating" @click="formUpdate">수정</button>
            <button v-if="!updating" @click="vnsDelete">삭제</button>
            <!-- 수정 시 -->
            <button v-if="updating" @click="vnsUpdate">완료</button>
            <button v-if="updating" @click="updateCancel">취소</button>
        </td>
    </tr>
</template>

<script>
export default {
    props:['vnsNumber'],
    data(){
        return{
            updating:false,
            updateNumStore:"",
            selecting:"",
        }
    },
    methods:{
        formUpdate(){
            this.selecting = "background:silver;"
            this.updating = true;
            this.updateNumStore = this.vnsNumber.vnsNumber;
            setTimeout(() => {
                this.$refs.vnsNumRef.focus();
            }, 400);
        },
        vnsUpdate(){
            let message = {
                "userId":this.$cookies.get('userId'),
                "loginMarker":this.$cookies.get('loginMarker'),
                "clientCode":this.$cookies.get('clientCode'),
                "clientCodeType":"1",
                "vnsIdx":this.vnsNumber.vnsIdx,
                "vncNumber":this.vnsNumber.vnsNumber,
                //"defaultSetIdx":"0"
            }

            this.$store.commit('autoSequence');
            const sequence = this.$store.state.login.sequence;
            this.$http.post('/number/ibiz/vns/update?sequence='+ sequence +'&responseType=json', message)
            .then(res => {
                if(res.data.result.resultCode == '00'){
                    alert(res.data.result.resultMessage);
                    this.selecting = "";
                    this.updating = false;
                    this.$emit('vnsSelect');
                } else {
                    alert(res.data.result.resultMessage);
                }
                
            });
        },
        updateCancel(){
            this.updating = false;
            this.selecting = "";
            this.vnsNumber.vnsNumber = this.updateNumStore;
        },
        vnsDelete(){
            const result = confirm('[ ' + this.vnsNumber.vnsNumber + ' ] 을 삭제할까요?');
            if(result){
                let message = {
                    "userId":this.$cookies.get('userId'),
                    "loginMarker":this.$cookies.get('loginMarker'),
                    "clientCode":this.$cookies.get('clientCode'),
                    "clientCodeType":"1",
                    "vnsIdx":this.vnsNumber.vnsIdx,
                }

                this.$store.commit('autoSequence');
                const sequence = this.$store.state.login.sequence;
                this.$http.post('/number/ibiz/vns/delete?sequence='+ sequence +'&responseType=json', message)
                .then(res => {
                    if(res.data.result.resultCode == '00'){
                        alert(res.data.result.resultMessage);
                        this.$emit('vnsSelect');
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
