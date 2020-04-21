<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:100px;">
                    <div class="user-info">
                        <el-avatar :size="70"
                                   src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        <div class="user-info-cont">
                            <div class="user-info-name">名字</div>
                            <div>角色</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="icon-backrenshu iconfont grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{todayVisitCount}}</div>
                                    <div>今日访问量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="iconfont icon-backrenshu1 grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{totalVisisCount}}</div>
                                    <div>总访问量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="iconfont icon-back16 grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{articleCount}}</div>
                                    <div>总文章数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-card shadow="hover" style="height: 400px">
                    <histogram :data="chartData" :settings="chartSettings"></histogram>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import histogram from 'v-charts/lib/histogram.common.min';
    import {getIndex} from '@/api/user';
    import moment from 'moment';

    moment.locale('zh-cn');
    export default {
        name: 'dashboard',
        data() {
            return {
                chartSettings: {
                    labelMap: {
                        visit: '访问用户',
                        article: '新增文章'
                    }
                },
                totalVisisCount: 0,
                todayVisitCount: 0,
                articleCount: 0,
                chartData: {
                    columns: ['date', 'visit', 'article'],
                    rows: []
                },

            };
        },
        components: {
            histogram
        },
        computed: {},
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                getIndex().then(res => {
                    if (res.data.status == 0) {
                        this.totalVisisCount = res.data.data.totalVisisCount;
                        this.todayVisitCount = res.data.data.todayVisitCount;
                        this.articleCount = res.data.data.articleCount;
                        for (let i = 6; i >= 0; i--) {
                            let time = moment().subtract(i, 'days').format('MM-DD');
                            let contain = false;
                            let contain2 = false;
                            let p = new Object();
                            p = {};
                            for (let o of res.data.data.totalVisit) {
                                if (o.days === time) {
                                    contain = true;
                                    p.date = time;
                                    p.visit = o.count;
                                }
                            }
                            if (!contain) {
                                p.date = time;
                                p.visit = 0;
                            }
                            for (let s of res.data.data.newArticle) {
                                if (s.days === time) {
                                    contain2 = true;
                                    p.article = s.count;
                                }
                            }
                            if (!contain2) {
                                p.article = 0;
                            }
                            this.chartData.rows.push(p);
                            console.log(1111);
                        }
                    }
                })
            }
        }
    };
</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }


    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }


    .mgb20 {
        margin: 0;
        padding: 0;
    }


</style>
