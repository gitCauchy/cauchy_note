<template>
  <div class="page-container">
    <el-card class="search-container" shadow="never">
      <el-row>
        <el-col :span="15">
          <el-input placeholder="标题" v-model="queryInfo.searchWord" @keyup.enter.native="handleSearchList" clearable>
            <el-button slot="append" icon="el-icon-search" @click="handleSearchList"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
    <el-form class="operation-container" shadow="never">
      <i class="el-icon-tickets"/>
      <span>笔记列表</span>
      <el-button size="mini" type="primary" class="btn-add" @click="handleAdd" style="margin:20px">添加</el-button>
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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip effect="dark" content="编辑" placement="top">
                <el-button type="primary" icon="el-icon-edit"
                           @click="handleUpdate(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="分享" placement="top">
                <el-button type="primary" icon="el-icon-share"
                           @click="handleShare(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="导出" placement="top">
                <el-button type="primary" icon="el-icon-download"
                           @click="exportArticle(scope.$index,scope.row)"></el-button>
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
    <el-dialog :title="isEdit?'编辑':'添加'" :visible.sync="dialogVisible"
               :fullscreen=true
               @close="closeDialog">
      <el-form :model="article" ref="articleForm" label-width="100px">
        <el-form-item>
          <el-input v-model="article.title" style="width: 85%"/>
        </el-form-item>
        <el-form-item>
          <WangEditor ref="textEditor" :parent-content="article.content" @input="handleEditorInput"
                      style="width: 85%"></WangEditor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('editDialog')" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分享" :visible.sync="shareDialogVisible" :fullscreen=false>
      <el-form ref="shareForm" label-width="100px" :model="shareForm" :rules="rules">
        <el-form-item label="分享好友:" prop="friendSelectValue">
          <el-select v-model="shareForm.friendSelectValue" placeholder="请选择好友" style="width: 75%">
            <el-option v-for="item in shareForm.friendOptions" :key="item.value" :label="item.label" :value=item.value>
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
        <el-button type="primary" @click="handleShareDialogConfirm" size="small">分 享</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {deleteArticle, modifyArticle, addArticle, getArticleList, exportWord} from "@/api/article";
import {addArticleShare} from "@/api/share";
import {getFriendList} from "@/api/friend";
import WangEditor from "@/components/wangeditor";
import {addNewMessage} from "@/api/message";
import {SystemStatusCode} from "@/common/const";

export default {
  name: "Article",
  components: {WangEditor},
  data() {
    return {
      shareForm: {
        friendOptions: [],
        friendSelectValue: '',
        validDaySelectValue: '',
        validDayOptions: [
          {value: 1, label: '1 天'},
          {value: 3, label: '3 天'},
          {value: 7, label: '7 天'},
          {value: 30, label: '30 天'},
          {value: 180, label: '180 天'}
        ],
        isRevisableSelectValue: '',
        isRevisableOptions: [
          {value: 0, label: '是'},
          {value: 1, label: '否'}
        ],
      },
      rules: {
        friendSelectValue: [{required: true, message: '请选择好友', trigger: blur}],
        validDaySelectValue: [{required: true, message: '请选择天数', trigger: blur}],
        isRevisableSelectValue: [{required: true, message: '请选择能否编辑', trigger: blur}]
      },
      shareDialogVisible: false,
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        searchWord: ""
      },
      articleList: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      article: {},
      share: {},
    }
  },
  created() {
    this.getList();
    this.getFriendList();
  },
  methods: {
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
    getFriendList() {
      getFriendList(
        JSON.parse(sessionStorage.userInfo).id,
        1000,
        1
      )
        .then(response => {
          for (let i = 0; i < response.length; i++) {
            this.shareForm.friendOptions.push({
              value: response[i].id, label:
                response[i].remarkName === null ? response[i].username : response[i].remarkName
            })
          }
        })

    },
    getList() {
      this.listLoading = true;
      getArticleList(
        JSON.parse(sessionStorage.userInfo).id,
        this.queryInfo.pageSize,
        this.queryInfo.pageNum,
        this.queryInfo.searchWord)
        .then(response => {
          this.listLoading = false;
          this.articleList = response.articles;
          this.total = response.total;
        })
    },
    closeDialog() {
      this.$refs.textEditor.editor.clear();
    },

    handleDelete(index, row) {
      this.$confirm('是否删除？', '提示',
        {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
            deleteArticle(row.id)
              .then(response => {
                if (response === SystemStatusCode.SUCCESS) {
                  this.$message.success("删除成功！")
                  this.getList()
                } else {
                  this.$message.error("删除失败")
                }
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
        modifyArticle(this.article.id, this.article.title, this.article.content)
          .then(response => {
            if (response === SystemStatusCode.SUCCESS) {
              this.$message.success("修改成功");
              this.dialogVisible = false;
              this.getList();
            } else {
              this.$message.error("修改失败")
              this.dialogVisible = false;
            }
          })
      } else { // 如果是新增窗口
        addArticle(this.article.title, this.article.content, JSON.parse(sessionStorage.userInfo).id)
          .then(response => {
            if (response === SystemStatusCode.SUCCESS) {
              this.$message.success("添加成功！");
              this.dialogVisible = false;
              this.getList();
            } else {
              this.$message.error("添加失败！");
              this.dialogVisible = false;
            }
          })
      }
    },
    handleCancel(dialog) {
      if (dialog === 'editDialog') {
        this.dialogVisible = false;
      } else {
        this.shareDialogVisible = false;
      }
    },
    handleAdd() {
      this.article = {}
      this.dialogVisible = true;
      this.isEdit = false;
    },

    handleSearchList() {
      this.queryInfo.pageNum = 1;
      this.getList();
    },
    handleShare(index, row) {
      this.article = Object.assign({}, row);
      this.shareDialogVisible = true;
    },
    handleShareDialogConfirm() {
      this.$refs['shareForm'].validate(valid => {
        if (!valid) {
          this.$message.error("请选择必选内容!");
        } else {
          addArticleShare(JSON.parse(sessionStorage.userInfo).id, this.shareForm.friendSelectValue, this.article.id,
            this.shareForm.validDaySelectValue, this.shareForm.isRevisableSelectValue)
            .then(response => {
              if (response === SystemStatusCode.SUCCESS) {
                addNewMessage(JSON.parse(sessionStorage.userInfo).id, this.shareForm.friendSelectValue, 1,
                  "收到了好友的分享", 0)
                  .then(response => {
                    if (response === SystemStatusCode.SUCCESS) {
                      this.$message({
                        message: '分享成功！',
                        type: 'success'
                      });
                      this.shareDialogVisible = false;
                    }
                  })
              } else if (response === SystemStatusCode.ARTICLE_HAS_SHARED_ALREADY) {
                this.$message.info("已经存在同一用户有效期限内的分享!");
              } else {
                this.$message.error("分享失败!");
              }
            })
        }
      })
    },
    exportArticle(index, row) {
      exportWord(row.id)
        .then((response) => {
          const blob = new Blob([response]);
          let a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = row.title + ".doc";
          a.click();
        });
    }
  }
}
</script>

<style scoped>

</style>
