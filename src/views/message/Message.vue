<template>
  <div class="page-container" style="margin-top: 20px">
    <div class="data-container">
      <el-table ref="userTable" :data="messageList" v-loading="listLoading" style="width:100%" border stripe>
        <el-table-column label="#" align="center" type="index"/>

        <el-table-column label="消息类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.messageType===0">好友验证</span>
            <span v-if="scope.row.messageType===1">笔记分享</span>
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
            <el-button-group v-if="scope.row.messageType===1 || scope.row.messageType === 3">
              <el-tooltip effect="dark" content="标记为已读" placement="top">
                <el-button type="primary" icon="el-icon-check"
                           @click="handleReadMessage(scope.row.id)"/>
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
  </div>
</template>

<script>
import {
  deleteUser,
} from "@/api/admin";
import {addNewMessage, getMessageList, readMessage} from "@/api/message";
import {addFriend, deleteFriendRequest} from "@/api/friend";

export default {
  name: "Message",
  data() {
    return {
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
        if (response === 100000) {
          this.getList();
          this.refreshMessageTips();
        }
      })
    },
    handleAgreeFriendRequest(id, senderId, receiverId) {
      addFriend(senderId, receiverId)
        .then(response => {
          if (response === 100000) {
            addFriend(receiverId, senderId)
              .then(response => {
                if (response === 100000) {
                  readMessage(id).then(response => {
                    if (response === 100000) {
                      deleteFriendRequest(senderId, receiverId)
                        .then(response => {
                          if (response === 100000) {
                            this.$message.success("添加成功！");
                            this.getList();
                            this.refreshMessageTips();
                          }
                        })
                    }
                  })
                }
              })
          }
        })
    },
    handleRejectFriendRequest(id, senderId, receiverId) {
      deleteFriendRequest(senderId, receiverId)
        .then(response => {
          if (response === 100000) {
            addNewMessage(receiverId, senderId, 3, "您的好友请求被拒绝", 0)
              .then(response => {
                if (response === 100000) {
                  readMessage(id)
                    .then(response => {
                      if (response === 100000) {
                        this.getList();
                        this.refreshMessageTips();
                      }
                    })
                }
              })
          }
        })

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

