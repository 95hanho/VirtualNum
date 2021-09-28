<template>
    <div class="mentInput">

        <div class="main-content">
            <div class="page-content" id="acsSetPageContent">
                <div class="row">
                    <div class="widget-header widget-header-small">
                        <h5 class="lighter">IBIZ 멘트 등록</h5>
                    </div>
                    <div class="widget-body">
                        <div class="widget-main">
                            <div class="row" style="height:70px;">
                                <div class="input-group col-xs-4">
                                    <label>멘트 이름</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-play-circle bigger-110"></i>
                                        </span>
                                        <input class="form-control" v-model="mentName" @keyup.enter="mentInput" ref="mentNameRef">
                                    </div>
                                </div>
                                <div class="input-group col-xs-5">
                                    <label>멘트 설명</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-headphones bigger-110"></i>
                                        </span>
                                        <input class="form-control" v-model="mentDesc" @keyup.enter="mentInput" ref="mentDescRef">
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="height:90px;">
                                <div class="input-group col-xs-5">
                                    <label>파일 업로드</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-file bigger-110"></i>
                                        </span>
                                        <input @change="fileChange" id="fileInput" filestyle="" type="file" data-class-button="btn btn-default" data-class-input="form-control" data-icon-name="fa fa-upload" class="form-control" tabindex="-1" style="position: absolute; clip: rect(0px 0px 0px 0px);">
                                        <input type="text" id="userfile" class="form-control" v-model="filename" name="userfile" style="height: 41.5px;" disabled>
                                        <span class="group-span-filestyle input-group-btn" tabindex="0">
                                            <label for="fileInput" class="btn btn-default">
                                                <span class="icon-upload bigger-110"></span>
                                            </label>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-group pull-right col-xs-3">
                                    <div class="input-group" id="inputBtn">
                                        <button @click="formReset" class="btn btn-primary btn-sm callDiv" style="margin-left:5px;" >
                                            리셋<i class="icon-download icon-on-right bigger-110"></i>
                                        </button>
                                        <button @click="mentInput" class="btn btn-success btn-sm callDiv">
                                            입력<i class="icon-magic icon-on-right bigger-110"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import EventBus from '@/eventBus/event-bus';

export default {
    data(){
        return{
            mentName:"",
            mentDesc:"",
            filename:"파일을 올려주세요.(▷▷▷▷)",
            fileForm:null,
        }
    },
    methods:{
        fileChange(e){
            this.fileForm = e.target.files[0];
            this.filename = e.target.files[0].name;
        },
        mentInput(){
            if(this.mentName.length == 0){
                alert('멘트 이름을 입력해주세요.')
                this.$refs.mentNameRef.focus();
            } else if(this.mentDesc.length == 0){
                alert('멘트 설명을 입력해주세요.')
                this.$refs.mentDescRef.focus();
            } else if(this.filename == '파일을 올려주세요.(▷▷▷▷)'){
                alert('파일을 올려주세요.')
            } else {

                const userId = this.$cookies.get('userId');

                // 먼저 업로드
                this.$http.post('/upload/ment/user/'+userId+'/clientCode/402/clientCodeType/1/insert', this.fileForm,
                {
                    headers: {
                        'content-type':'blob.type'
                    }
                })
                .then(res => {
                    if(res.data.result.resultCode == '00'){
                        const uploadKey = res.data.result.resultMessage;

                        const message = {
                            "userId":userId,
                            "loginMarker":this.$cookies.get('loginMarker'),
                            "clientCode":this.$cookies.get('clientCode'),
                            "clientCodeType":"1",
                            "uploadKey":uploadKey,
                            "mentName":encodeURIComponent(this.mentName),
                            "mentDesc":encodeURIComponent(this.mentDesc)
                        }

                        // 멘트 등록
                        this.$store.commit('autoSequence');
                        const sequence = this.$store.state.login.sequence;
                        this.$http.post('/ment/insert?sequence='+ sequence +'&responseType=json', message)
                        .then(res2 => {
                            if(res2.data.result.resultCode == '00'){
                                alert(res2.data.result.resultMessage);
                                // 이벤트 버스 요청
                                EventBus.$emit('reSelectMent');
                                this.formReset();
                            } else {
                                alert(res2.data.result.resultMessage);
                            }
                        });
                    } else {
                        alert(res.data.result.resultMessage);
                    }
                });

            }
        },
        formReset(){
            this.mentName = "";
            this.mentDesc = "";
            this.filename = "파일을 올려주세요.(▷▷▷▷)";
            this.fileForm = null;
            this.$refs.mentNameRef.focus();
        }
    }
}
</script>
