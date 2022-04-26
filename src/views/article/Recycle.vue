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
    <div class="button-container" style="margin-top: 20px;text-align:right;margin-right:20px">
      <el-button type="success" round @click="this.restoreAll">恢复所有</el-button>
      <el-button type="danger" round @click="this.clearAll">清空所有</el-button>
    </div>
    <div class="data-container" style="margin-top: 20px">
      <el-table ref="userTable" :data="recycleArticleList" v-loading="listLoading" style="width:100%" border stripe>
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
              <el-tooltip effect="dark" content="恢复,可在笔记管理中查看" placement="top">
                <el-button type="primary" icon="el-icon-check"
                           @click="handleRestore(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="清理,不可找回！" placement="top">
                <el-button type="danger" icon="el-icon-close"
                           @click="handleClearArticle(scope.$index, scope.row)"></el-button>
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
  </div>
</template>

<script>
import {
  deleteAllArticlePhysical,
  deleteArticlePhysical,
  getRecycleArticleList,
  restoreAllArticle,
  restoreArticle
} from "@/api/recycle";

export default {
  name: "Recycle",
  data() {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        searchWord: ""
      },
      recycleArticleList: null,
      total: null,
      listLoading: false,
      recycleArticle: {},
    }
  },
  created() {
    this.getList();
  },
  methods: {
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
      getRecycleArticleList(
        JSON.parse(sessionStorage.userInfo).id,
        this.queryInfo.pageSize,
        this.queryInfo.pageNum,
        this.queryInfo.searchWord)
        .then(response => {
          this.listLoading = false;
          this.recycleArticleList = response.recycleArticle;
          this.total = response.total;
        })
    },

    handleCancel(dialog) {
      if (dialog === 'editDialog') {
        this.dialogVisible = false;
      } else {
        this.shareDialogVisible = false;
      }
    },

    handleSearchList() {
      this.queryInfo.pageNum = 1;
      this.getList();
    },

    handleClearArticle(index, row) {
      this.$confirm('是否彻底清除？清除后不可恢复', '提示',
        {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          deleteArticlePhysical(row.id)
            .then(response => {
              if (response === 100000) {
                this.$message.success("清理成功！");
                this.getList();
              } else {
                this.$message.error("清理失败！");
              }
            })
        })
    },
    handleRestore(index,row){
      restoreArticle(row.id)
      .then(response=>{
        if(response === 100000){
          this.$message.success("恢复成功！")
          this.getList();
        }else {
          this.$message.error("恢复失败！");
        }
      })
    },
    restoreAll() {
      restoreAllArticle(JSON.parse(sessionStorage.userInfo).id)
        .then(response => {
          if (response === 100000) {
            this.$message.success("恢复成功！");
            this.getList();
          } else {
            this.$message.error("恢复失败！");
          }
        })
    },
    clearAll() {
      this.$confirm('是否彻底清除所有内容？清除后不可恢复', '提示',
        {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          deleteAllArticlePhysical(JSON.parse(sessionStorage.userInfo).id)
            .then(response => {
              if (response === 100000) {
                this.$message.success("清理成功！");
                this.getList();
              } else {
                this.$message.error("清理失败！");
              }
            })
        })
    },
  }
}
</script>

<style scoped>

</style>

