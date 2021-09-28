<template>
    <tr class="mentUnit">
        <td :style="selecting">{{ ment.mentIdx }}</td>
        <td :style="selecting">
            <input type="text" v-model="ment.mentName" ref="mentNameRef" :disabled="!updating" @keyup.enter="mentUpdate">
        </td>
        <td :style="selecting">
            <input type="text" v-model="ment.mentDesc" ref="mentDescRef" :disabled="!updating" @keyup.enter="mentUpdate">
        </td>
        <td :style="selecting">{{ ment.modDate }}</td>
        <td :style="selecting">
            <!-- 기본 -->
            <button v-if="!updating" @click="formUpdate">수정</button>
            <button v-if="!updating" @click="mentDelete">삭제</button>
            <!-- 수정 시 -->
            <button v-if="updating" @click="mentUpdate">완료</button>
            <button v-if="updating" @click="updateCancel">취소</button>
        </td>
    </tr>
</template>

<script>
export default {
    props:['ment'],
    data(){
        return{
            updating:false,
            mentNameStore:"",
            mentDescStroe:"",
            selecting:""
        }
    },
    methods:{
        formUpdate(){
            this.updating = true;
            this.mentNameStore = this.ment.mentName;
            this.mentDescStroe = this.ment.mentDesc;
            this.selecting = "background:silver;";
            setTimeout(() => {
                this.$refs.mentNameRef.focus();
            }, 400);

        },
        mentUpdate(){
            let message = {
                "userId":this.$cookies.get('userId'),
                "loginMarker":this.$cookies.get('loginMarker'),
                "clientCode":this.$cookies.get('clientCode'),
                "clientCodeType":"1",
                "mentIdx":this.ment.mentIdx,
                "mentName":encodeURIComponent(this.ment.mentName),
                "mentDesc":encodeURIComponent(this.ment.mentDesc)
            }

            this.$store.commit('autoSequence');
            const sequence = this.$store.state.login.sequence;
            this.$http.post('/ment/update?sequence='+ sequence +'&responseType=json', message)
            .then(res => {
                if(res.data.result.resultCode == '00'){
                    alert(res.data.result.resultMessage);
                    this.updating = false;
                    this.selecting = "";
                    this.$emit('mentSelect');
                } else {
                    alert(res.data.result.resultMessage);
                }
                
            });
        },
        updateCancel(){
            this.updating = false;
            this.selecting = "";
            this.ment.mentName = this.mentNameStore;
            this.ment.mentDesc = this.mentDescStroe;
        },
        mentDelete(){
            const result = confirm('[ ' + this.ment.mentName + ' ] 을 삭제할까요?');
            if(result){
                let message = {
                    "userId":this.$cookies.get('userId'),
                    "loginMarker":this.$cookies.get('loginMarker'),
                    "clientCode":this.$cookies.get('clientCode'),
                    "clientCodeType":"1",
                    "mentIdx":this.ment.mentIdx,
                }

                this.$store.commit('autoSequence');
                const sequence = this.$store.state.login.sequence;
                this.$http.post('/ment/delete?sequence='+ sequence +'&responseType=json', message)
                .then(res => {
                    if(res.data.result.resultCode == '00'){
                        alert(res.data.result.resultMessage);
                        this.$emit('mentSelect');
                    } else {
                        alert(res.data.result.resultMessage);
                    }
                });
            }
        }
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
