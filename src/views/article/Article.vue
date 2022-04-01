<template>
  <div class="page-container">
    <el-card class="search-container" shadow="never">
      <el-row>
        <el-col :span="15">
          <el-input placeholder="标题" v-model="queryInfo.searchWord" clearable>
            <el-button slot="append" icon="el-icon-search" @click="handleSearchList()"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
    <el-form class="operation-container" shadow="never">
      <i class="el-icon-tickets"/>
      <span>笔记列表</span>
      <el-button size="mini" type="primary" class="btn-add" @click="handleAdd()" style="margin:20px">添加</el-button>
    </el-form>
    <div class="data-container">
      <el-table ref="userTable" :data="articleList" v-loading="listLoading" style="width:100%" border stripe>
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="标题" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{ scope.row.createTime.substr(0, 10) }}</template>
        </el-table-column>
        <el-table-column label="修改时间" align="center">
          <template slot-scope="scope">{{ scope.row.modifyTime.substr(0, 10) }}</template>
        </el-table-column>
        <el-table-column label="内容" align="center">
          <template slot-scope="scope">{{ handleDisplay(scope.row.content) }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip effect="dark" content="编辑" placement="top">
                <el-button type="primary" icon="el-icon-edit"
                           @click="handleUpdate(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button type="danger" icon="el-icon-delete"
                           @click="handleDelete(scope.$index, scope.row)"></el-button>
              </el-tooltip>
            </el-button-group>
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
    <el-dialog :title="isEdit?'编辑':'添加'" :visible.sync="dialogVisible" :fullscreen=true>
      <el-form :model="article" ref="articleForm" label-width="100px">
        <el-form-item>
          <el-input v-model="article.title" style="width: 85%"/>
        </el-form-item>
        <el-form-item>
          <TinymceEditor :parent-content="article.content" @input="handleTinymceInput"
                         :key="tinymceKey"></TinymceEditor>
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

const defaultQueryInfo = {
  pageNum: 1,
  pageSize: 10,
  searchWord: ""
};

const defaultArticle = {
  id: null,
  title: '',
  content: '',
  createTime: null,
  authorId: sessionStorage.getItem("user_id"),
  modifyTime: null,
  status: 0
}

export default {
  name: "articleList",
  components: {TinymceEditor},
  data() {
    return {
      queryInfo: Object.assign({}, defaultQueryInfo),
      articleList: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      readDialogVisible: false,
      isEdit: false,
      article: Object.assign({}, defaultArticle),
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
        url: '/article/getArticleList',
        method: 'get',
        params: {
          "authorId": sessionStorage.getItem("user_id"),
          "pageSize": this.queryInfo.pageSize,
          "pageNum": this.queryInfo.pageNum,
          "keyword": this.queryInfo.searchWord
        }
      }, (response) => {
        this.listLoading = false;
        this.articleList = response.data.articles;
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
    handleCancel(){
      this.dialogVisible=false;
      this.$router.go(0);
    },
    handleAdd() {
      this.article = Object.assign({}, defaultArticle)
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
