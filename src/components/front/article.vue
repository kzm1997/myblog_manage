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
                <el-input v-model="query.nickname" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableDatas"
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" block class="demo-table-expand">
                            <el-form-item label="文章名">
                                <div>{{ props.row.title }}</div>
                            </el-form-item>
                            <el-form-item label="文章摘要">
                                <p class="mesummary">{{ props.row.description}}</p>
                            </el-form-item>
                            <el-form-item label="标签">
                                <el-tag class="metag" v-for="s in props.row.categorys" :key="s.id" type="info">
                                    {{s.categoryName}}
                                </el-tag>
                            </el-form-item>
                            <el-form-item label="阅读数">
                                <span>{{ props.row.readNum}}</span>
                            </el-form-item>
                            <el-form-item label="评论数">
                                <span>{{ props.row.commentNum}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column label="文章名">
                    <template slot-scope="scope">
                        <p class="metitle">{{scope.row.title}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="作者" align="center">
                    <template slot-scope="scope">{{scope.row.nickname}}</template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.publish===1?'success':(scope.row.publish==0?'danger':'')"
                        >{{scope.row.publish===1?'已审核':(scope.row.publish==0?'未审核':'')}}
                        </el-tag>
                    </template>
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
                        >审核内容
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index,scope.row)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="推荐" width="180" align="center">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.recommend"
                                @change="mychange(scope.row)"
                                :active-value=1
                                :inactive-value=0
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
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
        <el-dialog title="文章内容" :visible.sync="editVisible" width="60%">
            <div v-html="content" class="markdown-body">
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">审核通过</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getAll, recommend, deleteArticle, publish} from '@/api/article'
    import 'github-markdown-css/github-markdown.css';
    import marked from 'marked'
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
                tableDatas: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                content: '',
                category: [],
                categoryId: '',
                tags: [],
                tagId: '',
                clearable: true,
                publishId: ''
            };
        },
        created() {
            this.getCategory();
            this.getData();
        },
        methods: {
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
            mychange(item) {
                if (item.recommend == 0) {
                    recommend(item.id, 0).then(res => {
                        if (res.data.status == 0) {

                        }
                    })
                } else if (item.recommend == 1) {
                    recommend(item.id, 1).then(res => {
                        if (res.data.status == 0) {
                        }
                    })
                }
            },
            getData() {
                getAll(this.query).then(res => {
                    this.tableDatas = res.data.data.list;
                    this.pageTotal = res.data.data.totalCount;
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageNum', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(index, item) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteArticle(item.id).then(res => {
                        if (res.data.status == 0) {
                            this.pageTotal = this.pageTotal - 1;
                            this.$message.success('删除成功');
                            this.tableDatas.splice(index, 1);
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
            // 审核内容
            handleEdit(item) {
                this.publishId = item.id;
                this.content = marked(item.content);
                this.editVisible = true;
            },
            // 保存
            saveEdit() {
                let flag = true;
                this.tableDatas.forEach(item => {
                    if (item.id == this.publishId && item.publish == 1) {
                        this.$message({
                            message: '该文章已审核',
                            type: 'warning'
                        })
                        flag = false;
                        this.editVisible = false;
                    }
                })
                if (flag) {
                    publish(this.publishId).then(res => {
                        if (res.data.status == 0) {
                            this.$message({
                                message: '审核成功',
                                type: 'success'
                            })
                            this.tableDatas.forEach((item, index) => {
                                if (item.id == this.publishId) {
                                    this.tableDatas[index].publish = 1;
                                }
                            })
                            this.editVisible = false;
                        }
                    })
                }
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNum', val);
                this.getData();
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
