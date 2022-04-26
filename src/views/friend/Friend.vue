<template>
  <div class="page-container">
    <el-card class="search-container" shadow="never" style="margin-bottom: 20px">
      <el-row>
        <el-col :span="15">
          <el-input placeholder="搜索用户名添加好友" v-model="friendName" @keyup.enter.native="searchFriend" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchFriend"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8" style="text-align: right">
          <el-button type="primary" @click="this.openFriendRequestDialog">我的好友请求</el-button>
        </el-col>
      </el-row>
    </el-card>
    <div class="data-container">
      <el-table ref="userTable" :data="friendList" v-loading="listLoading" style="width:100%" border stripe>
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="好友" align="center">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">{{ scope.row.email }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip effect="dark" content="分享" placement="top">
                <el-button type="primary" icon="el-icon-share"
                           @click="handleShare(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button type="danger" icon="el-icon-delete"
                           @click="handleDelete(scope.$index,scope.row)"></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination background layout="total,sizes,prev,pager,next,jumper"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page.sync="queryInfo.pageNum"
                   :page-sizes="[5,10,15]"
                   :total="total">
    </el-pagination>
    <el-dialog title="搜索结果" :visible.sync="searchDialogVisible" :fullscreen=false width="30%">
      <el-form label-position="right" v-if="isNull">
        <el-form-item label="用户：">
          <el-input v-model="searchResult.username" style="width: 75%" readonly></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="searchResult.email" style="width: 75%" readonly></el-input>
        </el-form-item>
      </el-form>
      <h2 v-else style="text-align: center">用户不存在</h2>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddFriend" size="small" v-show="isNull">添 加</el-button>
        <el-button @click="handleCancel('searchDialog')" size="small">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分享" :visible.sync="shareDialogVisible" :fullscreen=false>
      <el-form ref="shareForm" label-width="100px" :model="shareForm" :rules="rules">
        <el-form-item label="分享笔记:" prop="articleSelectValue">
          <el-select v-model="shareForm.articleSelectValue" placeholder="请选择笔记" style="width: 75%">
            <el-option v-for="item in shareForm.articleOptions" :key="item.value" :label="item.label" :value=item.value>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分享期限" prop="validDaySelectValue">
          <el-select v-model="shareForm.validDaySelectValue" placeholder="请选择期限" style="width: 75%">
            <el-option v-for="item in shareForm.validDayOptions" :key="item.value" :label="item.label"
                       :value=item.value>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="能否编辑" prop="isRevisableSelectValue">
          <el-select v-model="shareForm.isRevisableSelectValue" placeholder="请选择是否允许编辑" style="width: 75%">
            <el-option v-for="item in shareForm.isRevisableOptions" :key="item.value" :label="item.label"
                       :value=item.value>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('shareDialog')" size="small">取 消</el-button>
        <el-button type="primary" @click="handleShareDialogConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="好友请求列表" :visible.sync="friendRequestDialogVisible" :fullscreen=false>
      <el-table :data="friendRequestList" border style="width: 100%">
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">{{ scope.row.email }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">已发送</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFriendList,
  deleteFriend,
  searchFriend,
  addFriend,
  addFriendRequest,
  getFriendRequestList, getFriendRequestResult
} from "@/api/friend";
import {getArticleList} from "@/api/article";
import {addArticleShare} from "@/api/share";
import {addNewMessage} from "@/api/message";

export default {
  name: "Friend",
  data() {
    const MESSAGE_TYPE_FRIEND_REQUEST = 0;
    const MESSAGE_TYPE_ARTICLE_SHARE = 1;
    return {
      shareForm: {
        articleSelectValue: '',
        articleOptions: [],
        validDaySelectValue: '',
        validDayOptions: [
          {value: 1, label: '1 天'},
          {value: 3, label: '3 天'},
          {value: 7, label: '7 天'},
          {value: 30, label: '30 天'},
        ],
        isRevisableSelectValue: '',
        isRevisableOptions: [
          {value: 1, label: '是'},
          {value: 0, label: '否'}],
      },
      friendRequestList: null,
      rules: {
        articleSelectValue: [{required: true, message: '请选择好友', trigger: blur}],
        validDaySelectValue: [{required: true, message: '请选择天数', trigger: blur}],
        isRevisableSelectValue: [{required: true, message: '请选择能否编辑', trigger: blur}]
      },
      shareDialogVisible: false,
      friendRequestDialogVisible: false,
      queryInfo: {
        pageNum: 1,
        pageSize: 5,
      },
      friendList: null,
      total: 0,
      listLoading: false,
      friend: {},
      searchResult: {
        id: null,
        username: null,
        email: null
      },
      searchDialogVisible: false,
      friendName: null,
      isNull: false
    }
  },
  created() {
    this.getList();
    this.getArticleList();
    this.getFriendRequestList();
  },
  methods: {
    getArticleList() {
      getArticleList(JSON.parse(sessionStorage.userInfo).id, 1000, 1, "")
        .then(response => {
            for (let i = 0; i < response.articles.length; i++) {
              this.shareForm.articleOptions.push({value: response.articles[i].id, label: response.articles[i].title})
            }
          }
        )
    },
    handleShare(index, row) {
      this.shareDialogVisible = true;
      this.friend = Object.assign({}, row);
    },
    getList() {
      this.listLoading = true;
      getFriendList(JSON.parse(sessionStorage.userInfo).id, this.queryInfo.pageSize, this.queryInfo.pageNum)
        .then(response => {
          this.listLoading = false;
          this.friendList = response;
          this.total = this.friendList.length;
        })

    },
    getFriendRequestList() {
      getFriendRequestList(JSON.parse(sessionStorage.userInfo).id)
        .then(response => {
          this.friendRequestList = response;
        })
    },
    handleSizeChange(value) {
      this.queryInfo.pageNum = 1;
      this.queryInfo.pageSize = value;
      this.getList();
    },
    handleCurrentChange(value) {
      this.queryInfo.pageNum = value;
      this.getList();
    },
    handleDelete(index, row) {
      this.$confirm('是否删除？', '提示',
        {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          deleteFriend(JSON.parse(sessionStorage.userInfo).id, row.id)
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.getList()
            })
        }
      )
    },
    handleCancel(dialog) {
      if (dialog === 'searchDialog') {
        this.searchDialogVisible = false;
      } else {
        this.shareDialogVisible = false;
      }
    },
    searchFriend() {
      this.searchDialogVisible = true;
      searchFriend(this.friendName)
        .then(response => {
          this.searchResult = response;
          if (this.searchResult.id != null) {
            this.isNull = true;
          }
        })
    },
    handleAddFriend() {
      if (parseInt(JSON.parse(sessionStorage.userInfo).id) === parseInt(this.searchResult.id)) {
        this.$message.error("不可添加自己为好友")
        this.searchDialogVisible = false;
      } else {
        addFriendRequest(JSON.parse(sessionStorage.userInfo).id, this.searchResult.id)
          .then(response => {
            if (response === 100000) {
              addNewMessage(JSON.parse(sessionStorage.userInfo).id, this.searchResult.id,
                0, JSON.parse(sessionStorage.userInfo).username + "请求加为好友", 0)
                .then(response => {
                  if (response === 100000) {
                    this.$message.success("好友请求发送成功")
                    this.searchDialogVisible = false;
                    this.getList();
                  } else {
                    this.$message.info("好友请求发送成功，消息推送失败！")
                  }
                })
            } else if(response === -400002){
              this.$message.info("该用户已添加为好友");
              this.searchDialogVisible = false;
            }else{
              this.$message.error("请求错误！")
              this.searchDialogVisible = false;
            }
          })
      }
    },
    handleShareDialogConfirm() {
      this.$refs['shareForm'].validate(valid => {
        if (!valid) {
          this.$message.error("请选择提示内容!");
        } else {
          addArticleShare(JSON.parse(sessionStorage.userInfo).id,
            this.friend.id,
            this.shareForm.articleSelectValue,
            this.shareForm.validDaySelectValue,
            this.shareForm.isRevisableSelectValue)
            .then(response => {
              if (response === 100000) {
                addNewMessage(JSON.parse(sessionStorage.userInfo).id, this.friend.id, 1, "好友分享了笔记", 0)
                  .then(response => {
                    if (response === 100000) {
                      this.$message({
                        message: '分享成功！',
                        type: 'success'
                      });
                      this.shareDialogVisible = false;
                    }
                  })

              }
            })
        }
      })
    },
    openFriendRequestDialog() {
      this.friendRequestDialogVisible = true;
      this.getFriendRequestList();
    },
  }
}
</script>

<style scoped>

</style>
