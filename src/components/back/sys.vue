<template>
    <div class="container">
        <el-row>
            <el-col :span="12">
                <h2>分类</h2>
            </el-col>
            <el-col :span="12">
                <h2>每日评论</h2>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <vepie :data="chartDataPie" :settings="chartSettingPie"></vepie>
            </el-col>
            <el-col :span="12">
                <ve-line :data="chartDataLine" :settings="chartSettingLine"></ve-line>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Vepie from 'v-charts/lib/pie.common.min'
    import VeLine from 'v-charts/lib/line.common.min'
    import {categoryPie, commentLine} from "../../api/sys";
    import moment from 'moment';

    moment.locale('zh-cn');

    export default {
        name: "sys",
        data() {
            return {
                chartSettingPie: {
                    labelMap: {
                        visit: '分类名',
                        article: '文章数'
                    }
                },
                chartDataPie: {
                    columns: ['categoryName', 'count'],
                    rows: []
                },
                chartSettingLine: {
                    labelMap: {
                        date: '日期',
                        count: '评论数'
                    }
                },
                chartDataLine: {
                    columns: ['date', 'count'],
                    rows: []
                }
            }
        },
        created() {
            this.getCategoryPie();
            this.getLine();
        },
        methods: {
            getCategoryPie() {
                categoryPie().then(res => {
                    if (res.data.status == 0) {
                        this.chartDataPie.rows = res.data.data;
                    }
                })
            },
            getLine() {
                commentLine().then(res => {
                    if (res.data.status == 0) {
                        for (let i = 6; i >= 0; i--) {
                            let time = moment().subtract(i, 'days').format('MM-DD');
                            let p = new Object();
                            let contain = false;
                            for (let o of res.data.data) {
                                if (o.days === time) {
                                    contain = true;
                                    p.date = time;
                                    p.count = o.count;
                                }
                            }
                            if (!contain) {
                                p.date = time;
                                p.count = 0;
                            }
                            this.chartDataLine.rows.push(p);
                        }
                    }
                })
            }

        },
        components: {
            Vepie,
            VeLine
        }
    }
</script>

<style scoped>
    .container {

    }
</style>