export const loding = {
    state: {
        LoadingStatus: false,
    },
    mutations: {
        startSpinner(state){
            state.LoadingStatus = true;
        },
        endSpinner(state){
            state.LoadingStatus = false;
        }
    },
    getters: {
        getLodingStatus(state){
            return state.LoadingStatus;
        }
    }
}