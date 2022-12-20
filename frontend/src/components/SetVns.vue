<template>
    <div class="setVns">

        <div class="main-content">
            <div class="page-content">
                <div class="row">
                    <h2 v-if="vnsNumberObject.zeroList" style="text-align:center;">유저의 050번호가 없습니다.</h2>
                    <table v-if="!vnsNumberObject.zeroList" class="table table-striped table-bordered table-hover" id="acsSetTable">
                        <thead>
                            <tr>
                                <th width="10%">050Idx</th>
                                <th width="30%">050번호</th>
                                <th width="20%">defaultSetIdx</th>
                                <th width="20%">defaultSetName</th>
                                <th width="20%"></th>
                            </tr>
                        </thead>
                        <tbody v-for="(vnsNumber, index) in vnsNumberObject.vnsNumberList" :key="index">
                            <SetVnsUnit :vnsNumber="vnsNumber" :idx="idx" @picker="picker"/>
                        </tbody>
                    </table>
                    <div class="modal-footer no-margin-top" id="acsSetPageSelectorDiv"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import EventBus from '@/eventBus/event-bus'
import SetVnsUnit from '@/components/SetVnsUnit'

export default {
    props:['vnsNumberObject'],
    data(){
        return{
            idx:"",
        }
    },
    created(){
        // 스케줄 리셋
        EventBus.$on('VnsNumberReset', () => {
            this.idx = "";
        });
    },
    beforeDestroy(){
        EventBus.$off('VnsNumberReset');
    },
    components:{
        SetVnsUnit
    },
    methods:{
        picker(value){
            if(this.idx == value){
                this.idx = "";
            } else {
                this.idx = value;
            }
        }
    }
}
</script>

<style>

</style>
