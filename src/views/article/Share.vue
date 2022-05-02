<template>
  <div class="page-container">
    <el-card class="search-container" shadow="never" style="margin-bottom: 20px">
      <el-row>
        <el-col :span="15">
          <el-input placeholder="标题" v-model="queryInfo.searchWord" @keyup.enter.native="handleSearchList" clearable>
            <el-button slot="append" icon="el-icon-search" @click="handleSearchList"></el-button>
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
              <el-button type="primary" :icon="scope.row.isRevisable ===0?'el-icon-edit':'el-icon-tickets'"
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
    <el-dialog title="编辑" :visible.sync="dialogVisible" :fullscreen=true @close="closeDialog">
      <el-form :model="article" ref="modifyForm" label-width="100px">
        <el-form-item>
          <el-input v-model="article.title" style="width: 85%"/>
        </el-form-item>
        <el-form-item>
          <WangEditor :can-edit="article.isRevisable === 0" :parent-content="article.content"
                      @input="handleEditorInput" style="width: 85%"
                      ref="textEditor"></WangEditor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel" size="small">取 消</el-button>
        <el-button type="primary" :disabled="article.isRevisable===1" @click="handleDialogConfirm()" size="small">确
          定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {modifyArticle} from "@/api/article";
import {getSharedArticleList} from "@/api/share";
import WangEditor from "@/components/wangeditor";
import {SystemStatusCode} from "@/common/const";

export default {
  name: "Share",
  components: {WangEditor},
  data() {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 5,
        searchWord: ""
      },
      articleList: null,
      total: null,
      validDay: null,
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      article: {},
    }
  },
  created() {
    this.getList();
  },
  methods: {
    closeDialog() {
      this.$refs.textEditor.editor.clear();
    },
    handleEditorInput(value) {
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
      getSharedArticleList(JSON.parse(sessionStorage.userInfo).id,
        this.queryInfo.pageSize,
        this.queryInfo.pageNum,
        this.queryInfo.searchWord
      )
        .then(response => {
          this.listLoading = false;
          this.articleList = response;
          this.total = response.length;
        })
    },

    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.article = Object.assign({}, row)
    },
    handleDialogConfirm() {
      modifyArticle(this.article.id, this.article.title, this.article.content)
        .then(response => {
          if(response === SystemStatusCode.SUCCESS){
            this.$message.success("修改成功！");
            this.getList();
          }else{
            this.$message.error("修改失败！")
          }
          this.dialogVisible = false;
        })
    },
    handleCancel() {
      this.dialogVisible = false;
    },
    handleAdd() {
      this.article = {};
      this.dialogVisible = true;
      this.isEdit = false;
    },

    handleSearchList() {
      this.queryInfo.pageNum = 1;
      this.getList();
    },
  }
}
</script>

<style scoped>

</style>
