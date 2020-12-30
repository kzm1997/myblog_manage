<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 文章管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">

                <el-select v-model="categoryId" clearable=clearable placeholder="分类" class="handle-select mr10"
                           @change="getTags">
                    <el-option v-for="item in category" :key="item.id" :label="item.categoryName"
                               :value="item.id"></el-option>
                </el-select>
                <el-select v-model="tagId" clearable=clearable @change="change" placeholder="标签"
                           class="handle-select mr10">
                    <el-option v-for="item in tags" :key="item.id" :label="item.categoryName"
                               :value="item.id"></el-option>
                </el-select>
            </div>
            <el-table
                    :data="tableData"
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column label="文章名">
                    <template slot-scope="scope">
                        <p class="metitle">{{scope.row.title}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="作者" align="center">
                    <template slot-scope="scope">
                        {{scope.row.nickname}}
                    </template>
                </el-table-column>
                <el-table-column label="评论数" align="center" prop="commentNum">
                </el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.updateTime | convertDatezhun }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.row)"
                        >管理评论
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="所有评论" :visible.sync="editVisible" width="60%">
            <el-table
                    :data="commentData"
                    style="width: 100%"
                    border
                    row-key="id"
                    :tree-props="{children: 'reply'}">
                <el-table-column
                        prop="fromName"
                        label="评论者"
                        align="center"
                        width="180">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row.fromName }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="被评论对象"
                        width="180" align="center">
                    <template slot-scope="scope">
                        <div>
                            {{getToName(scope.row)}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="content"
                        label="评论内容" align="center">
                </el-table-column>
                <el-table-column
                        label="时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.date | convertDatezhun }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDeleteComment(scope.$index,scope.row)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="queryComment.pageIndex"
                        :page-size="queryComment.pageSize"
                        :total="pageTotalCOmment"
                        @current-change="handlePageChangeCOmment"
                ></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getArticle, commentView, deleteComment} from "../../api/comment";
    import {getCategory, tagByCategory} from '@/api/category';

    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    nickname: '',
                    pageNum: 1,
                    pageSize: 5,
                    id: 0
                },
                queryComment: {
                    pageNum: 1,
                    pageSize: 5,
                    id: 0
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                commentData: [],
                editVisible: false,
                pageTotal: 0,
                pageTotalCOmment: 0,
                form: {},
                idx: -1,
                id: -1,
                content: '',
                category: [],
                categoryId: '',
                tags: [],
                tagId: '',
                clearable: true
            };
        },
        created() {
            this.getData();
            this.getCategory();
        },
        methods: {
            getToName(item) {
                if (item.reply && item.fromId == item.toId) {
                    return '文章'
                } else {
                    return item.toName;
                }
            },
            getCategory() {
                getCategory().then(res => {
                    if (res.data != null && res.data.status == 0) {
                        this.category = res.data.data;
                    }
                })
            },
            getTags(select) {
                if (select != '') {
                    this.query.id = this.categoryId;
                    this.getData();
                    tagByCategory(select).then(res => {
                        if (res.data != null && res.data.status == 0) {
                            this.tags = res.data.data;
                        }
                    })
                } else {
                    this.query.id = '';
                    this.tags = [];
                    this.tagId = '';
                    this.getData();
                }
            },
            change(select) {
                if (select != '') {
                    this.query.id = this.tagId;
                    this.getData();
                } else {
                    this.query.id = this.categoryId;
                    this.getData();
                }

            },
            getData() {
                getArticle(this.query).then(res => {
                    this.tableData = res.data.data.list;
                    this.pageTotal = res.data.data.totalCount;
                });
            },
            // 删除评论
            handleDeleteComment(index, item) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteComment(item.id).then(res => {
                        if (res.data.status == 0) {
                            if (item.reply==undefined) {
                                this.commentData.forEach((i,ind) => {
                                    if (i.reply.length>0) {
                                        i.reply.forEach((ii, index) => {
                                            if (ii.id=item.id){
                                                this.commentData[ind].reply.splice(index, 1);
                                            }
                                        })
                                    }
                                })
                            } else {
                                this.pageTotalCOmment = this.pageTotalCOmment - 1;
                                this.commentData.splice(index, 1);
                            }
                            this.$message.success('删除成功');
                            this.$forceUpdate();
                        }
                    })
                }).catch(() => {
                });
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error(`删除了${str}`);
                this.multipleSelection = [];
            },
            // 管理评论
            handleEdit(item) {
                this.queryComment.id = item.id;
                this.editVisible = true;
                this.getComments(this.queryComment);
            },
            getComments(query) {
                commentView(query).then(res => {
                    if (res.data.status == 0) {
                        this.commentData = res.data.data.list;
                        this.pageTotalCOmment = res.data.data.totalCount;
                    }
                })
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNum', val);
                this.getData();
            },
            handlePageChangeCOmment(val) {
                this.queryComment.pageNum = val;
                this.getComments(this.queryComment);
            }
        }
    };
</script>

<style lang="scss">
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 60%;
    }

    .metitle {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .metag {
        margin-right: 10px;
    }

    .mesummary {
        padding-left: 90px
    }

</style>
