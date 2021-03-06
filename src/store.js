import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    project_id:-1,
    request_id:-1,
    token:null,
    user_id:-1,
    privilege:null
  },
  mutations: {
    setProjectID(state,projectId){
      console.log("HEllo"+projectId);
      state.project_id = projectId;
    },
    setRequestID(state,requestID){
      console.log("HEllo"+requestID);
      state.request_id = requestID;
    },
    setAuthToken(state,token){
      console.log("setting token: "+token);
      state.token = token;
    },
    setUserId(state,userId){
      state.user_id = userId
    },
    setPrivilege(state,privilege){
      state.privilege = privilege
    }
  },
  actions: {

  },
  plugins:[createPersistedState()]
})
