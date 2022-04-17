<template>
  <div class="page-container">
    <el-card class="search-container" shadow="never" style="margin-bottom: 20px">
      <el-row>
        <el-col :span="15">
          <el-input placeholder="搜索用户名添加好友" v-model="friendName" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchFriend"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
    <div class="data-container">
      <el-table ref="userTable" :data="friendList" v-loading="listLoading" style="width:100%" border stripe>
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="用户名" align="center">
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
        <el-form-item label="用户名：">
          <el-input v-model="searchResult.username" style="width: 75%" readonly></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="searchResult.email" style="width: 75%" readonly></el-input>
        </el-form-item>
      </el-form>
      <h2 v-else style="text-align: center">用户不存在</h2>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddFriend()" size="small" v-show="isNull">添 加</el-button>
        <el-button @click="handleCancel" size="small">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分享" :visible.sync="shareDialogVisible" :fullscreen=false>
      <el-form ref="shareForm" label-width="100px">
        <el-form-item label="分享笔记:">
          <el-select v-model="articleSelectValue" placeholder="请选择笔记" style="width: 75%">
            <el-option v-for="item in articleOptions" :key="item.value" :label="item.label" :value=item.value>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分享期限">
          <el-select v-model="validDaySelectValue" placeholder="请选择期限" style="width: 75%">
            <el-option v-for="item in validDayOptions" :key="item.value" :label="item.label" :value=item.value>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="能否编辑">
          <el-select v-model="isRevisableSelectValue" placeholder="请选择是否允许编辑" style="width: 75%">
            <el-option v-for="item in isRevisableOptions" :key="item.value" :label="item.label" :value=item.value>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel" size="small">取 消</el-button>
        <el-button type="primary" @click="handleShareDialogConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {request} from "@/network/request";

const defaultFriend = {
  id: null,
  username: null,
  email: null
}

export default {
  name: "Friend",
  components: {},
  data() {
    return {
      articleSelectValue: '',
      articleOptions: [],
      validDaySelectValue: '',
      validDayOptions: [
        {value: 1, label: '1 天'},
        {value: 3, label: '3 天'},
        {value: 7, label: '7 天'},
        {value: 30, label: '30 天'},
        {value: 180, label: '180 天'},
      ],
      isRevisableSelectValue: '',
      isRevisableOptions: [
        {value: 1, label: '是'},
        {value: 0, label: '否'}],
      shareDialogVisible: false,
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
      },
      friendList: null,
      total: 0,
      listLoading: false,
      friend: Object.assign({}, defaultFriend),
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
  },
  methods: {
    getArticleList() {
      request({
        url: '/article/getArticleList',
        method: 'get',
        params: {
          "authorId": sessionStorage.getItem("user_id"),
          "pageSize": 1000,
          "pageNum": 1,
          "keyword": ''
        }
      }, (response) => {

        for (let i = 0; i < response.data.articles.length; i++) {
          this.articleOptions.push({value: response.data.articles[i].id, label: response.data.articles[i].title})
        }

      }, (failure) => {
        console.log(failure);
      })
    },
    handleShare(index, row) {
      this.shareDialogVisible = true;
      this.friend = Object.assign({}, row);
    },
    getList() {
      this.listLoading = true;
      request({
        url: '/friend/getFriendList',
        method: 'get',
        params: {
          "userId": sessionStorage.getItem("user_id")
        }
      }, (response) => {
        this.listLoading = false;
        this.friendList = response.data;
        this.total = this.friendList.length;
      }, (failure) => {
        console.log(failure);
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
          request({
            url: '/friend/deleteFriend',
            method: "get",
            params: {
              'userId': sessionStorage.getItem("user_id"),
              'friendId': row.id
            }
          }, (response) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getList()
          }, (failure) => {
            console.log(failure);
          })
        }
      )
    },
    handleCancel() {
      this.searchDialogVisible = false;
    },
    searchFriend() {
      this.searchDialogVisible = true;
      request({
        url: '/friend/searchFriend',
        method: 'get',
        params: {
          'friendName': this.friendName,
        }
      }, (response) => {
        console.log(response.data);
        this.searchResult = response.data;
        if (this.searchResult.id != null) {
          this.isNull = true;
        }

      }, (failure) => {
        console.log(failure);
      })
    },
    handleAddFriend() {
      if (parseInt(sessionStorage.getItem("user_id")) === parseInt(this.searchResult.id)) {
        this.$message.error("不可添加自己为好友")
        this.searchDialogVisible = false;
      } else {
        request({
            url: '/friend/addFriend',
            method: 'get',
            params: {
              'userId': sessionStorage.getItem("user_id"),
              'friendId': this.searchResult.id
            }
          },
          (response) => {
            if (response.data === 100000) {
              this.$message.success("添加成功")
              this.searchDialogVisible = false;
              this.getList();
            } else {
              this.$message.error("添加失败")
            }
          }, (failure) => {
            console.log(failure);
            this.$message.error("网络错误")
          })
      }
    },
    handleShareDialogConfirm() {
      request({
          url: '/share/addArticleShare',
          method: 'post',
          data: {
            "shareUserId": sessionStorage.getItem("user_id"),
            "receiveUserId": this.friend.id.toString(),
            "articleId": this.articleSelectValue.toString(),
            "validDay": this.validDaySelectValue,
            "isRevisable": this.isRevisableSelectValue,
          }
        },
        (repsponse) => {
          if (repsponse.data === 100000) {
            this.$message({
              message: '分享成功！',
              type: 'success'
            });
            this.shareDialogVisible = false;
          }

        }, (failure) => {
          console.log(failure);
        }
      )
    }
  },


}
</script>

<style scoped>

</style>
