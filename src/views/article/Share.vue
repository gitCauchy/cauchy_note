<template>
  <div class="page-container">
    <el-card class="search-container" shadow="never" style="margin-bottom: 20px">
      <el-row>
        <el-col :span="15">
          <el-input placeholder="标题" v-model="queryInfo.searchWord" clearable>
            <el-button slot="append" icon="el-icon-search" @click="handleSearchList()"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
    <div class="data-container">
      <el-table ref="userTable" :data="articleList" v-loading="listLoading" style="width:100%" border stripe>
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="标题" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{ scope.row.createTime.substr(0, 10) }}</template>
        </el-table-column>
        <el-table-column label="分享人" align="center">
          <template slot-scope="scope">{{ scope.row.shareUsername }}</template>
        </el-table-column>
        <el-table-column label="分享时间" align="center">
          <template slot-scope="scope">{{ scope.row.shareDate.substr(0, 10) }}</template>
        </el-table-column>
        <el-table-column label="有效期限" align="center">
          <template slot-scope="scope">{{ scope.row.validDay }} 天</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" :disabled="scope.row.isRevisable === 0"
                         @click="handleUpdate(scope.$index,scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      layout="total,sizes,prev,pager,next,jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sycn="queryInfo.pageNum"
      :page-size="queryInfo.pageSize"
      :page-sizes="[10,15,20]"
      :total="total">
    </el-pagination>
    <el-dialog title="编辑" :visible.sync="dialogVisible" :fullscreen=true>
      <el-form :model="article" ref="articleForm" label-width="100px">
        <el-form-item>
          <el-input v-model="article.title" style="width: 85%"/>
        </el-form-item>
        <el-form-item>
          <TinymceEditor :parent-content="article.content" @input="handleTinymceInput"></TinymceEditor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {request} from "@/network/request";
import TinymceEditor from "@/components/tinymce-editor";

const defaultSharedArticle = {
  id: null,
  title: '',
  content: '',
  createTime: null,
  shareUsername: null,
  shareDate: null,
  authorId: sessionStorage.getItem("user_id"),
  modifyTime: null,
  status: 0,
  isRevisable:null,
}

export default {
  name: "Share",
  components: {TinymceEditor},
  data() {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        searchWord: ""
      },
      articleList: null,
      total: null,
      validDay: null,
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      article: Object.assign({}, defaultSharedArticle),
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleTinymceInput(value) {
      this.article.content = value;
    },
    handleDisplay(content) {
      if (content.length <= 10) {
        return content;
      } else {
        return content.substr(0, 10) + "......"
      }
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
    getList() {
      this.listLoading = true;
      request({
        url: '/share/getSharedArticleList',
        method: 'get',
        params: {
          "receiverId": sessionStorage.getItem("user_id"),
          "pageSize": this.queryInfo.pageSize,
          "pageNum": this.queryInfo.pageNum,
          "keyword": this.queryInfo.searchWord
        }
      }, (response) => {
        this.listLoading = false;
        this.articleList = response.data;
        this.total = response.data.total;
      }, (failure) => {
        console.log(failure);
      })
    },

    handleDelete(index, row) {
      this.$confirm('是否删除？', '提示',
        {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          request({
            url: '/article/deleteArticle',
            method: "get",
            params: {
              'id': row.id
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
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.article = Object.assign({}, row)
    },
    handleDialogConfirm() {
      if (this.isEdit) {
        request({
          url: '/article/modifyArticle',
          method: 'post',
          data: this.article
        }, (response) => {
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          this.dialogVisible = false;
          this.getList();
        }, failure => {
          console.log(failure);
        })
      } else { // 如果是新增窗口
        request({
          url: '/article/addArticle',
          method: 'post',
          data: this.article
        }, (response) => {
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
          this.dialogVisible = false;
          this.getList();
        }, (failure) => {
          console.log(failure);
        })
      }
      this.$router.go(0)
    },
    handleCancel() {
      this.dialogVisible = false;
      this.$router.go(0);
    },
    handleAdd() {
      this.article = Object.assign({}, defaultSharedArticle)
      this.dialogVisible = true;
      this.isEdit = false;
    },

    handleSearchList() {
      this.queryInfo.pageNum = 1;
      this.getList();
    },
    handleSearchReset() {
      this.queryInfo = Object.assign({}, defaultQueryInfo)
    },
  }
}
</script>

<style scoped>

</style>
