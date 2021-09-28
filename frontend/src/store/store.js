import Vue from 'vue'
import Vuex from 'vuex'

import { login } from './module/login';
import { loding } from './module/loding';

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {
        login,
        loding
    },
    plugins: [

    ]
})