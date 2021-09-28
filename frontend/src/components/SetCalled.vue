<template>
    <div class="setCalled">

        <div class="main-content">
            <div class="page-content">
                <div class="row">
                    <h2 v-if="calledNumberObject.zeroList" style="text-align:center;">유저의 착신번호가 없습니다.</h2>
                    <table v-if="!calledNumberObject.zeroList" class="table table-striped table-bordered table-hover" id="acsSetTable">
                        <thead>
                            <tr>
                                <th width="20%">착신Idx</th>
                                <th width="60%">착신번호</th>
                                <th width="20%"></th>
                            </tr>
                        </thead>
                        <tbody v-for="(calledNumber, index) in calledNumberObject.calledNumberList" :key="index">
                            <SetCalledUnit :calledNumber="calledNumber"/>
                        </tbody>
                    </table>
                    <div class="modal-footer no-margin-top" id="acsSetPageSelectorDiv"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import SetCalledUnit from '@/components/SetCalledUnit'

export default {
    props:['calledNumberObject'],
    data(){
        return{
        }
    },
    created(){
    },
    components:{
        SetCalledUnit
    },
    methods:{

    }
}
</script>
