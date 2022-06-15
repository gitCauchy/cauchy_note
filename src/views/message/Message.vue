<template>
  <div class="page-container" style="margin-top: 20px">
    <div class="data-container">
      <el-table ref="userTable" :data="messageList" v-loading="listLoading" style="width:100%" border stripe>
        <el-table-column label="#" align="center" type="index"/>

        <el-table-column label="消息类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.messageType===0">好友验证</span>
            <span v-if="scope.row.messageType===1">笔记分享</span>
            <span v-if="scope.row.messageType===2">站内邮件</span>
            <span v-if="scope.row.messageType===3">好友反馈</span>
          </template>
        </el-table-column>

        <el-table-column label="消息内容" align="center">
          <template slot-scope="scope">{{ scope.row.messageInfo }}</template>
        </el-table-column>
        <el-table-column label="发送时间" align="center">
          <template slot-scope="scope">{{ scope.row.sendDate.substr(0, 10) }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button-group
              v-if="scope.row.messageType===1 || scope.row.messageType === 3">
              <el-tooltip effect="dark" content="标记为已读" placement="top">
                <el-button type="primary" icon="el-icon-check"
                           @click="handleReadMessage(scope.row.id)"/>
              </el-tooltip>
            </el-button-group>
            <el-button-group v-if="scope.row.messageType===2">
              <el-tooltip effect="dark" content="标记为已读" placement="top">
                <el-button type="primary" icon="el-icon-check"
                           @click="handleReadMessage(scope.row.id)"/>
              </el-tooltip>
              <el-tooltip effect="dark" content="消息详情" placement="top">
                <el-button type="primary" icon="el-icon-more"
                           @click="readMessageDetail(scope.$index,scope.row)"/>
              </el-tooltip>
            </el-button-group>
            <el-button-group v-if="scope.row.messageType===0">
              <el-tooltip effect="dark" content="同意" placement="top">
                <el-button type="success" icon="el-icon-circle-plus"
                           @click="handleAgreeFriendRequest(scope.row.id,scope.row.senderId,scope.row.receiverId)"/>
              </el-tooltip>
              <el-tooltip effect="dark" content="拒绝" placement="top">
                <el-button type="info" icon="el-icon-error"
                           @click="handleRejectFriendRequest(scope.row.id,scope.row.senderId,scope.row.receiverId)"/>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="消息详情" :visible.sync="messageDialogVisible" :fullscreen=false width="30%">
      <el-form label-position="right" label-width="100px">
        <el-form-item label="发件人：">
          <el-input v-model="message.senderRemarkName" style="width: 80%" readonly></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input type="textarea" rows="5" v-model="message.messageInfo" style="width: 80%" readonly></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel" size="small">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getMessageList, readMessage} from "@/api/message";
import {agreeFriendRequest, rejectFriendRequest} from "@/api/friend";
import {SystemStatusCode} from "@/common/const";

export default {
  name: "Message",
  data() {
    return {
      messageDialogVisible: false,
      messageList: null,
      listLoading: false,
      message: {},
    }
  },
  created() {
    this.getList();
  },
  methods: {

    getList() {
      this.listLoading = true;
      getMessageList(JSON.parse(sessionStorage.userInfo).id)
        .then(response => {
          this.listLoading = false;
          this.messageList = response;
        })
    },

    handleReadMessage(id) {
      readMessage(id).then(response => {
        if (response === SystemStatusCode.SUCCESS) {
          this.getList();
          this.refreshMessageTips();
        }
      })
    },
    handleAgreeFriendRequest(id, senderId, receiverId) {
      agreeFriendRequest(id, senderId, receiverId)
        .then(response => {
          if (response === SystemStatusCode.SUCCESS) {
            this.$message.success("添加成功！");
            this.getList();
            this.refreshMessageTips();
          }
        })
    },
    handleRejectFriendRequest(id, senderId, receiverId) {
      rejectFriendRequest(id, senderId, receiverId)
        .then(response => {
          if (response === SystemStatusCode.SUCCESS) {
            this.getList();
            this.refreshMessageTips();
          }
        })
    },
    readMessageDetail(index, row) {
      this.message = Object.assign({}, row);
      this.messageDialogVisible = true;
    },
    handleCancel() {
      this.messageDialogVisible = false;
    },
    refreshMessageTips() {
      let messageStatus = this.$store.state.messageStatus;
      this.$store.commit('changeMessageStatus', !messageStatus);
    }
  }
}
</script>

<style scoped>

</style>

