<template>
  <div style="margin-top:30px;margin-left:20%;width:50%;">
    <h1>About request</h1>
    <hr>
    <div class="main">
      <span>File No :</span>
      <span>{{file_no}}</span>
    </div>
    <br>
    <div class="main">
      <span>Project :</span>
      <span>{{project_name}}</span>
    </div>
    <br>
    <div class="main">
      <span>Principal Investigator :</span>
      <span>{{pi_name}}</span>
    </div>
    <div class="row">
      <div class="column remark">
        <h2>Remark</h2>
        <p>{{remark}}</p>
      </div>
      <div class="column summary">
        <div class="sub">
          <h3>Head : {{head_name}}</h3>
        </div>
        <div v-for="param in parameters" v-bind:key="param.parameter_id" class="sub">
          <h3>{{param.parameter_name}} - {{param.parameter_value}}</h3>
        </div>
      </div>
    </div>
    <div id="estimate">
      <h3>Total Estimate :{{amount_request}}</h3>
    </div>
    <br>
    <button
      @click="approveProposal"
      class="btn"
      v-if="privilege === 'Clerk'"
      id="btnApprove"
    >APPROVE</button>
    <button class="btn" v-if="privilege === 'Clerk'" id="btnReject" @click="rejectProposal">REJECT</button>
  </div>
</template>


<style>
.remark {
  overflow: wrap;
}
#btnApprove {
  background-color: #4caf50;
}
#btnReject {
  background-color: #c82333;
}
.summary {
  padding-top: 60px;
  text-align: right;
}
#estimate {
  margin-left: 5%;
}
.main {
  font-size: 20px;
  text-align: left;
  margin-left: 5%;
}
.sub {
  margin-left: 10%;
  line-height: 10px;
}
.column {
  float: left;
  width: 50%;
}

.column p {
  word-break: break-word;
}
.row {
  margin-left: 5%;
}
/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
.btn {
  border-radius: 5px;
  margin-left: 5%;
  display: inline-block;
  clear: both;
  color: white;
  padding: 10px;
  width: auto;
  height: auto;
  border: none;
  text-align: center;
}
</style>


<script>
var file_no,
  pi_name,
  project_name,
  head_name,
  parameters = [],
  remark,
  amount_request,
  project_id,
  head_id,
  pi_id,
  privilege;

export default {
  data() {
    return {
      file_no,
      pi_name,
      project_name,
      head_name,
      parameters: [],
      amount_request,
      privilege,
      remark
    };
  },
  methods: {
    approveProposal() {
      const self = this;
      const request_id = this.$store.state.request_id;
      const url = "http://localhost:3000/request/approveRequest";
      window
        .axios({ url: url, method: "POST", data: { request_id: request_id } })
        .then(function(res) {
          console.log(JSON.stringify(res) + "hello");
          if (res.data.success === true) {
            self.$router.push("/requestDashboard");
          } else {
            alert("Sorry couldnt update");
            self.$router.push("/requestDashboard");
          }
        })
        .catch(function(err) {
          alert("Some error occured");
          self.$router.push("/requestDashboard");
        });
    },
    rejectProposal() {
      const self = this;
      const request_id = this.$store.state.request_id;
      const url = "http://localhost:3000/request/rejectRequest";
      window
        .axios({ url: url, method: "POST", data: { request_id: request_id } })
        .then(function(res) {
          console.log(JSON.stringify(res) + "hello");
          if (res.data.success === true) self.$router.push("/requestDashboard");
          else {
            alert("Sorry couldnt update");
            self.$router.push("/requestDashboard");
          }
        })
        .catch(function(err) {
          alert("Some error occured");
          self.$router.push("/requestDashboard");
        });
    },

    requestData() {
      var token = this.$store.state.token;
      var self = this;
      const request_options = {};
      const request_id = this.$store.state.request_id;
      request_options.request_id = request_id;
      const url = "http://localhost:3000/request/getRequest";
      window
        .axios({ url: url, method: "POST", data: request_options })
        .then(res => {
          console.log("Got request data");
          //console.log(res)
          const request = res.data.status[0];
          console.log("data:" + request);
          // console.log(request.description)
          self.parameters = request.description.parameter;
          project_id = request.project_id;
          self.amount_request = request.estimated_amount;
          head_id = request.head_id;
          console.log("req amount:" + self.amount_request);
          self.remark = request.description.remark;
          console.log("req remark:" + self.remark);

          const url = "http://localhost:3000/proposal/findByID";
          return window.axios({
            url: url,
            method: "POST",
            data: { project_id: project_id }
          });
        })
        .then(result => {
          console.log("Got Proposal data:" + result);
          console.log("name:" + result.data.Status[0].name);

          self.file_no = result.data.Status[0].file_no;
          self.project_name = result.data.Status[0].name;
          pi_id = result.data.Status[0].principal_investigator_id;

          const url = "http://localhost:3000/people/findByID";
          return window.axios({
            url: url,
            method: "POST",
            data: { people_id: pi_id }
          });
        })
        .then(pi_result => {
          console.log("Got PI data");
          self.pi_name = pi_result.data.Status[0].name;
          const url = "http://localhost:3000/heads/getMultipleHeads";
          return window.axios({
            url: url,
            method: "POST",
            data: { head_ids: [head_id], token: token }
          });
        })
        .then(head_data => {
          console.log("Got head data");
          console.log(head_data.data.Status[0].name);
          self.head_name = head_data.data.Status[0].name;
        })
        .catch(err => {
          console.log("Error:" + err);
        });
    }
  },
  created: function() {
    this.privilege = this.$store.state.privilege;
    this.requestData();
  }
};
</script>
