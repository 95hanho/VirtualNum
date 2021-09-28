<template>
    <div class="scheduleInput">

        <div class="main-content">
            <div class="page-content" id="acsSetPageContent">
                <div class="row">
                    <div class="widget-header widget-header-small">
                        <h5 v-if="!updating" class="lighter">IBIZ 일정 등록</h5>
                        <h5 v-if="updating" class="lighter" style="color:red">IBIZ 일정(Idx={{ updatingIdx }}) 수정</h5>
                    </div>
                    <div class="widget-body">
                        <div class="widget-main">
                            <div class="row" style="height:30px;">
                                
                                <div class="input-group col-xs-12">
                                    <ul class="pagination" style="margin:0px;border: outset;">
                                        <li :class="type1"><a class="page-link" @click="typeChange(1)" style="cursor:pointer;">기 간</a></li>
                                        <li :class="type2"><a class="page-link" @click="typeChange(2)" style="cursor:pointer;">매 월</a></li>
                                        <li :class="type3"><a class="page-link" @click="typeChange(3)" style="cursor:pointer;">매 년</a></li>
                                    </ul>
                                </div>

                            </div>
                            <hr>
                            <div class="row" style="height:80px;">
                                <div class="input-group col-xs-4">
                                    <label>일정 이름</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-book bigger-110"></i>
                                        </span>
                                        <input class="form-control" v-model="scheduleName" ref="nameRef" @keyup.enter="scheduleInput">
                                    </div>
                                </div>
                            </div>

                            <div class="row" style="height:110px;">
                                <div class="input-group col-xs-3">
                                    <label>시작일</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-time bigger-110"></i>
                                        </span>
                                        <datepicker v-if="type1view" v-model="startDate"></datepicker>
                                        <input v-if="type1view" class="form-control" v-model="startDateString">

                                        <select v-if="type2view" class="form-control" v-model="startday">
                                            <option v-for="index in 31" :key="index">{{ index }}일</option>
                                        </select>

                                        <select v-if="type3view" class="form-control" v-model="startM" style="width:50%;">
                                            <option v-for="index in 12" :key="index">{{ index }}월</option>
                                        </select>
                                        <select v-if="type3view" class="form-control" v-model="startD" style="width:50%;">
                                            <option v-for="index in dayLimit1" :key="index">{{ index }}일</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="input-group col-xs-3">
                                    <label>종료일</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-time bigger-110"></i>
                                        </span>
                                        <datepicker v-if="type1view" v-model="endDate"></datepicker>
                                        <input v-if="type1view" class="form-control" v-model="endDateString">

                                        <select v-if="type2view" class="form-control" v-model="endday">
                                            <option v-for="index in 31" :key="index">{{ index }}일</option>
                                        </select>

                                        <select v-if="type3view" class="form-control" v-model="endM" style="width:50%;">
                                            <option v-for="index in 12" :key="index">{{ index }}월</option>
                                        </select>
                                        <select v-if="type3view" class="form-control" v-model="endD" style="width:50%;">
                                            <option v-for="index in dayLimit2" :key="index">{{ index }}일</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="input-group col-xs-2">
                                    <label>시작 시간</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-time bigger-110"></i>
                                        </span>
                                        <vue-timepicker v-model="startTime"></vue-timepicker>
                                        <input class="form-control" v-model="startTimeString">
                                    </div>
                                </div>
                                <div class="input-group col-xs-2">
                                    <label>종료 시간</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <span class="input-group-addon">
                                            <i class="icon-time bigger-110"></i>
                                        </span>
                                        <vue-timepicker v-model="endTime"></vue-timepicker>
                                        <input class="form-control" v-model="endTimeString">
                                    </div>
                                </div>
                            </div>
                            <h4 style="text-align:right">※ 회색박스 클릭하여 변경</h4>

                            <div class="row">
                                <div class="input-group col-xs-6">
                                    <label>요일 선택(흰박스=제외)</label>
                                    <div class="input-group bootstrap-timepicker">
                                        <ul class="pagination" style="margin:0px;">
                                            <li :class="week1"><a class="page-link" @click="weekChange(1)" style="cursor:pointer;">일</a></li>
                                            <li :class="week2"><a class="page-link" @click="weekChange(2)" style="cursor:pointer;">월</a></li>
                                            <li :class="week3"><a class="page-link" @click="weekChange(3)" style="cursor:pointer;">화</a></li>
                                            <li :class="week4"><a class="page-link" @click="weekChange(4)" style="cursor:pointer;">수</a></li>
                                            <li :class="week5"><a class="page-link" @click="weekChange(5)" style="cursor:pointer;">목</a></li>
                                            <li :class="week6"><a class="page-link" @click="weekChange(6)" style="cursor:pointer;">금</a></li>
                                            <li :class="week7"><a class="page-link" @click="weekChange(7)" style="cursor:pointer;">토</a></li>
                                        </ul>
                                    </div> 
                                    
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="input-group pull-right col-xs-4">
                                    <div class="input-group" id="inputBtn">
                                        <button v-if="!updating" class="btn btn-primary btn-sm callDiv" style="margin-left:5px;" @click="formReset">
                                            리셋<i class="icon-download icon-on-right bigger-110"></i>
                                        </button>
                                        <button v-if="!updating" class="btn btn-success btn-sm callDiv" @click="scheduleInput">
                                            입력<i class="icon-magic icon-on-right bigger-110"></i>
                                        </button>

                                        <button v-if="updating" class="btn btn-danger btn-sm callDiv" style="margin-left:5px;" @click="cancelUpdating">
                                            취소<i class="icon-download icon-on-right bigger-110"></i>
                                        </button>
                                        <button v-if="updating" class="btn btn-warning btn-sm callDiv" @click="scheduleUpdate">
                                            수정<i class="icon-magic icon-on-right bigger-110"></i>
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
import Datepicker from 'vuejs-datepicker'
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'
import EventBus from '@/eventBus/event-bus'

export default {
    data(){
        return{
            updating:false,
            updatingIdx:"",
            // 타입선택
            type1:"page-item active",
            type1view:true,
            type2:"page-item",
            type2view:false,
            type3:"page-item",
            type3view:false,
            scheduleName:"",
            // 타입1의 시작일 종료일
            startDate:new Date(2021, 0, 1),
            startDateString:"2021년01월01일",
            startDateData:"20210101",
            endDate:new Date(2021, 11, 31),
            endDateString:"2021년12월31일",
            endDateData:"20211231",
            // 타입2의 시작일 종료일
            startday:"1일",
            endday:"31일",
            // 타입3의 시작일 종료일
            startM:"1월",
            startD:"1일",
            startMDdata:"0101",
            endM:"12월",
            endD:"1일",
            endMDdata:"1201",
            dayLimit1:31,
            dayLimit2:31,
            // 시작시간, 종료시간
            startTime:'00:00',
            startTimeString:"00시00분",
            startTimeData:"0000",
            endTime:'23:59',
            endTimeString:"23시59분",
            endTimeData:"2359",
            week1:"page-item active",
            week2:"page-item active",
            week3:"page-item active",
            week4:"page-item active",
            week5:"page-item active",
            week6:"page-item active",
            week7:"page-item active",
            weekData:"1111111"
        }
    },
    components:{
        Datepicker,
        VueTimepicker
    },
    created(){
        EventBus.$on('updatingSchedule', (schedule) => {
            this.scheduleUpdating(schedule);
        });
        EventBus.$on('deleteReset', () => {
            this.cancelUpdating();
        });
    },
    beforeDestroy(){
        EventBus.$off('updatingSchedule');
        EventBus.$off('deleteReset');
    },
    watch:{
        updatingIdx(){
            EventBus.$emit('updatingIdx', this.updatingIdx);
        },
        startDate(){
            const date = this.startDate;
            const year = date.getFullYear();
            let month = (1 + date.getMonth());
            month = month >= 10 ? month : '0' + month;
            let day = date.getDate();
            day = day >= 10 ? day : '0' + day;
            this.startDateString = year + "년" + month + "월" + day + "일";
            this.startDateData = '' + year + month + day;
        },
        endDate(){
            const date = this.endDate;
            const year = date.getFullYear();
            let month = (1 + date.getMonth());
            month = month >= 10 ? month : '0' + month;
            let day = date.getDate();
            day = day >= 10 ? day : '0' + day;
            this.endDateString = year + "년" + month + "월" + day + "일";
            this.endDateData = '' + year + month + day;
        },
        startTime(){
            const time = this.startTime;
            this.startTimeString = time.substring(0,2) + '시' + time.substring(3,5) + '분';
            this.startTimeData = time.replace(":", "")
        },
        endTime(){
            const time = this.endTime;
            this.endTimeString = time.substring(0,2) + '시' + time.substring(3,5) + '분';
            this.endTimeData = time.replace(":", "")
        },
        startM(){
            this.startD = "1일"
            const selectMonth = this.startM;
            switch(selectMonth){
                case "2월":
                    this.dayLimit1 = 29;
                    break;
                case "4월":
                case "6월":
                case "9월":
                case "11월":
                    this.dayLimit1 = 30;
                    break;
                default:
                    this.dayLimit1 = 31;
            }
            let month = selectMonth.replace("월", "")
            month = month >= 10 ? month : '0' + month;
            this.startMDdata = month + this.startMDdata.substring(2,4)
        },
        startD(){
            const selectDay = this.startD;
            let day = selectDay.replace("일", "")
            day = day >= 10 ? day : '0' + day;
            this.startMDdata = this.startMDdata.substring(0,2) + day
        },
        endM(){
            this.endD = "1일"
            const selectMonth = this.endM;
            switch(selectMonth){
                case "2월":
                    this.dayLimit2 = 29;
                    break;
                case "4월":
                case "6월":
                case "9월":
                case "11월":
                    this.dayLimit2 = 30;
                    break;
                default:
                    this.dayLimit2 = 31;
            }
            let month = selectMonth.replace("월", "")
            month = month >= 10 ? month : '0' + month;
            this.endMDdata = month + this.endMDdata.substring(2,4)
        },
        endD(){
            const selectDay = this.endD;
            let day = selectDay.replace("일", "")
            day = day >= 10 ? day : '0' + day;
            this.endMDdata = this.endMDdata.substring(0,2) + day
        }
    },
    methods:{
        formReset(){
            this.scheduleName = ""
            this.startDate = new Date(2021, 0, 1)
            this.endDate = new Date(2021, 11, 31)
            this.startTime = "00:00"
            this.endTime = "23:59"
            this.startday = "1일"
            this.endday = "31일"
            this.startM = "1월"
            this.startD = "1일"
            this.endM = "12월"
            this.endD = "1일"
            this.dayLimit1 = 31
            this.dayLimit2 = 31
            this.week1 = "page-item active"
            this.week2 = "page-item active"
            this.week3 = "page-item active"
            this.week4 = "page-item active"
            this.week5 = "page-item active"
            this.week6 = "page-item active"
            this.week7 = "page-item active"
            this.weekData = "1111111"
        },
        typeChange(value){
            this.type1 = "page-item"
            this.type2 = "page-item"
            this.type3 = "page-item"
            this.type1view = false
            this.type2view = false
            this.type3view = false
            switch(value){
                case 1: 
                    this.type1 = "page-item active"; 
                    this.type1view = true;
                    break;
                case 2: 
                    this.type2 = "page-item active"; 
                    this.type2view = true;
                    break;
                case 3: 
                    this.type3 = "page-item active"; 
                    this.type3view = true;
                    break;
            }
        },
        weekChange(value){
            let weekData = "";
            switch(value){
                case 1: 
                    this.week1 = this.week1 == "page-item" ? "page-item active" : "page-item";
                    break;
                case 2:
                    this.week2 = this.week2 == "page-item" ? "page-item active" : "page-item";
                    break;
                case 3:
                    this.week3 = this.week3 == "page-item" ? "page-item active" : "page-item";
                    break;
                case 4:
                    this.week4 = this.week4 == "page-item" ? "page-item active" : "page-item";
                    break;
                case 5:
                    this.week5 = this.week5 == "page-item" ? "page-item active" : "page-item";
                    break;
                case 6:
                    this.week6 = this.week6 == "page-item" ? "page-item active" : "page-item";
                    break;
                case 7:
                    this.week7 = this.week7 == "page-item" ? "page-item active" : "page-item";
                    break;
            }
            weekData = "" + weekData + (this.week1 == "page-item" ? "0" : "1");
            weekData = "" + weekData + (this.week2 == "page-item" ? "0" : "1");
            weekData = "" + weekData + (this.week3 == "page-item" ? "0" : "1");
            weekData = "" + weekData + (this.week4 == "page-item" ? "0" : "1");
            weekData = "" + weekData + (this.week5 == "page-item" ? "0" : "1");
            weekData = "" + weekData + (this.week6 == "page-item" ? "0" : "1");
            weekData = "" + weekData + (this.week7 == "page-item" ? "0" : "1");
            this.weekData = weekData;
        },
        scheduleInput(){
            if(this.updating){
                this.scheduleUpdate();
                return;
            }
            if(this.scheduleName.length == 0){
                alert('스케줄 이름을 입력해주세요.')
                this.$refs.nameRef.focus();
            } else if(Number(this.startDateData) >  Number(this.endDateData)
            || Number(this.startMDdata) > Number(this.endMDdata)){
                alert('시작일이 종료일보다 빨라야 합니다.')
            } else if(this.startTimeData == this.endTimeData){
                alert('시간시간과 종료시간이 같을 수 없습니다.')
            } else if(this.weekData == '0000000'){
                alert('요일을 하나라도 선택해주세요.')
            } else {
                let message = {}
                if(this.type1view){
                    message = {
                        "userId":this.$cookies.get('userId'),
                        "loginMarker":this.$cookies.get('loginMarker'),
                        "clientCode":this.$cookies.get('clientCode'),
                        "clientCodeType":"1",
                        "scheduleName":encodeURIComponent(this.scheduleName),
                        "scheduleType":"1",
                        "startDate":this.startDateData,
                        "endDate":this.endDateData,
                        "startTime":this.startTimeData,
                        "endTime":this.endTimeData,
                        "weekType":this.weekData
                    }
                } else if(this.type2view){
                    let day = this.startday.replace("일", "")
                    day = day >= 10 ? day : '0' + day;
                    let day2 = this.endDateData.replace("일", "")
                    day2 = day2 >= 10 ? day2 : '0' + day2;
                    message = {
                        "userId":this.$cookies.get('userId'),
                        "loginMarker":this.$cookies.get('loginMarker'),
                        "clientCode":this.$cookies.get('clientCode'),
                        "clientCodeType":"1",
                        "scheduleName":encodeURIComponent(this.scheduleName),
                        "scheduleType":"2",
                        "startDate":day,
                        "endDate":day2,
                        "startTime":this.startTimeData,
                        "endTime":this.endTimeData,
                        "weekType":this.weekData
                    }
                } else if(this.type3view){
                    message = {
                        "userId":this.$cookies.get('userId'),
                        "loginMarker":this.$cookies.get('loginMarker'),
                        "clientCode":this.$cookies.get('clientCode'),
                        "clientCodeType":"1",
                        "scheduleName":encodeURIComponent(this.scheduleName),
                        "scheduleType":"3",
                        "startDate":this.startMDdata,
                        "endDate":this.endMDdata,
                        "startTime":this.startTimeData,
                        "endTime":this.endTimeData,
                        "weekType":this.weekData
                    }
                }

                this.$store.commit('autoSequence');
                const sequence = this.$store.state.login.sequence;
                this.$http.post('/schedule/insert?sequence='+ sequence +'&responseType=json', message)
                .then(res => {
                    if(res.data.result.resultCode == '00'){
                        alert(res.data.result.resultMessage);
                        // 이벤트 버스 요청
                        EventBus.$emit('reSelectSchedule');
                        this.formReset();
                    } else {
                        alert(res.data.result.resultMessage);
                    }
                    
                });

            }
            
            
        },
        scheduleUpdating(schedule){
            this.formReset();
            this.updating = true;
            this.updatingIdx = schedule.scheduleIdx;
            this.typeChange(Number(schedule.scheduleType))
            this.scheduleName = schedule.scheduleName
            if(schedule.scheduleType == "1"){
                this.startDate = new Date(schedule.startDate.substring(0,4), Number(schedule.startDate.substring(4,6))-1, Number(schedule.startDate.substring(6,8)))
                this.endDate = new Date(schedule.endDate.substring(0,4), Number(schedule.endDate.substring(4,6))-1, Number(schedule.endDate.substring(6,8)))
            } else if(schedule.scheduleType == "2"){
                this.startday = Number(schedule.startDate.substring(6,8)) + "일"
                this.endday = Number(schedule.endDate.substring(6,8)) + "일"
            } else if(schedule.scheduleType == "3"){
                this.startM = Number(schedule.startDate.substring(4,6)) + "월"
                this.endM = Number(schedule.endDate.substring(4,6)) + "월"
                setTimeout(()=>{
                    this.startD = Number(schedule.startDate.substring(6,8)) + "일"
                    this.endD = Number(schedule.endDate.substring(6,8)) + "일"
                }, 100)
            }
            this.startTime = schedule.startTime.substring(0,2) + ":" + schedule.startTime.substring(2,4)
            this.endTime = schedule.endTime.substring(0,2) + ":" + schedule.endTime.substring(2,4)
            if(schedule.weekType.charAt(0) == 0){
                this.weekChange(1);
            }
            if(schedule.weekType.charAt(1) == 0){
                this.weekChange(2);
            }
            if(schedule.weekType.charAt(2) == 0){
                this.weekChange(3);
            }
            if(schedule.weekType.charAt(3) == 0){
                this.weekChange(4);
            }
            if(schedule.weekType.charAt(4) == 0){
                this.weekChange(5);
            }
            if(schedule.weekType.charAt(5) == 0){
                this.weekChange(6);
            }
            if(schedule.weekType.charAt(6) == 0){
                this.weekChange(7);
            }
            window.scrollTo(0,0);
        },
        cancelUpdating(){
            this.updating = false;
            this.updatingIdx = "";
            this.formReset();
        },
        scheduleUpdate(){
            if(this.scheduleName.length == 0){
                alert('스케줄 이름을 입력해주세요.')
            } else if(Number(this.startDateData) >  Number(this.endDateData)
            || Number(this.startMDdata) > Number(this.endMDdata)){
                alert('시작일이 종료일보다 빨라야 합니다.')
            } else if(this.startTimeData == this.endTimeData){
                alert('시간시간과 종료시간이 같을 수 없습니다.')
            } else if(this.weekData == '0000000'){
                alert('요일을 하나라도 선택해주세요.')
            } else {
                let message = {}
                if(this.type1view){
                    message = {
                        "userId":this.$cookies.get('userId'),
                        "loginMarker":this.$cookies.get('loginMarker'),
                        "clientCode":this.$cookies.get('clientCode'),
                        "clientCodeType":"1",
                        "scheduleIdx":this.updatingIdx,
                        "scheduleName":encodeURIComponent(this.scheduleName),
                        "scheduleType":"1",
                        "startDate":this.startDateData,
                        "endDate":this.endDateData,
                        "startTime":this.startTimeData,
                        "endTime":this.endTimeData,
                        "weekType":this.weekData
                    }
                } else if(this.type2view){
                    let day = this.startday.replace("일", "")
                    day = day >= 10 ? day : '0' + day;
                    let day2 = this.endDateData.replace("일", "")
                    day2 = day2 >= 10 ? day2 : '0' + day2;
                    message = {
                        "userId":this.$cookies.get('userId'),
                        "loginMarker":this.$cookies.get('loginMarker'),
                        "clientCode":this.$cookies.get('clientCode'),
                        "clientCodeType":"1",
                        "scheduleIdx":this.updatingIdx,
                        "scheduleName":encodeURIComponent(this.scheduleName),
                        "scheduleType":"2",
                        "startDate":day,
                        "endDate":day2,
                        "startTime":this.startTimeData,
                        "endTime":this.endTimeData,
                        "weekType":this.weekData
                    }
                } else if(this.type3view){
                    message = {
                        "userId":this.$cookies.get('userId'),
                        "loginMarker":this.$cookies.get('loginMarker'),
                        "clientCode":this.$cookies.get('clientCode'),
                        "clientCodeType":"1",
                        "scheduleIdx":this.updatingIdx,
                        "scheduleName":encodeURIComponent(this.scheduleName),
                        "scheduleType":"3",
                        "startDate":this.startMDdata,
                        "endDate":this.endMDdata,
                        "startTime":this.startTimeData,
                        "endTime":this.endTimeData,
                        "weekType":this.weekData
                    }
                }

                this.$store.commit('autoSequence');
                const sequence = this.$store.state.login.sequence;
                this.$http.post('/schedule/update?sequence='+ sequence +'&responseType=json', message)
                .then(res => {
                    if(res.data.result.resultCode == '00'){
                        alert(res.data.result.resultMessage);
                        // 이벤트 버스 요청
                        EventBus.$emit('reSelectSchedule');
                        this.formReset();
                        this.updating = false;
                        this.updatingIdx = "";
                    } else {
                        alert(res.data.result.resultMessage);
                    }
                    
                });

            }
        }
    },
}
</script>

<style scoped>
</style>
