<template>
    <div class="setList">

        <div class="main-content">
            <div class="page-content">
                <div class="row">
                    <h2 v-if="setObject.zeroList" style="text-align:center;">유저의 설정이 없습니다.</h2>
                    <table v-if="!setObject.zeroList" class="table table-striped table-bordered table-hover" id="acsSetTable">
                        <thead>
                            <tr>
                                <th width="6%">설정Idx</th>
                                <th width="6%">이름</th>
                                <th width="7%">WEIGHT</th>
                                <th width="7%">설정타입</th>
                                <th width="8%">스케줄</th>
                                <th width="10%">VNS번호</th>
                                <th width="18%">착신번호</th>
                                <th width="18%">멘트</th>
                                <th width="20%"></th>
                            </tr>
                        </thead>
                        <tbody v-for="(set, index) in setObject.setList" :key="index">
                            <SetUnit :set="set" :updateSetIdx="updateSetIdx" @setUpdateForm="setUpdateForm"/>
                        </tbody>
                    </table>
                    <div class="modal-footer no-margin-top" id="acsSetPageSelectorDiv"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import SetUnit from '@/components/SetUnit'

export default {
    props:['setObject', 'updateSetIdx'],
    data(){
        return{
        }
    },
    created(){
    },
    components:{
        SetUnit
    },
    methods:{
       setUpdateForm(set){
          this.$emit('setUpdateForm', set);
       } 
    }
}
</script>
