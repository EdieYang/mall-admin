<template>
    <d2-container better-scroll >
        <div style="width:100%;">
            <el-form ref="form" :model="form" label-width="90px" label-position="left" :rules="formRules"
                     style="width:640px;display: inline-block;">
                <el-divider content-position="left">上传宠物照片</el-divider>
                <el-form-item label="照片" prop="mediaList" >
                    <el-upload
                            :action="actionUrl"
                            list-type="picture-card"
                            :data="ossData"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :before-upload="handleBefore"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                    <el-input v-model="form.mediaList" v-show="false" ></el-input>
                </el-form-item>

                <el-divider content-position="left">宠物信息</el-divider>
                <el-form-item label="昵称" prop="petName">
                    <el-input v-model="form.petName" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="petAge">
                    <el-select v-model="form.petAge" placeholder="请选择年龄" value="" style="width:100%;" >
                        <el-option v-for="value in ageRange" :label="value" :value="value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类别" prop="petType">
                    <el-radio-group v-model="form.petType" size="small">
                        <el-radio label="1" border>狗狗</el-radio>
                        <el-radio label="2" border>猫咪</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="性别" prop="petSex">
                    <el-radio-group v-model="form.petSex" size="small">
                        <el-radio label="1" border>未知</el-radio>
                        <el-radio label="2" border>男孩</el-radio>
                        <el-radio label="3" border>女孩</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-divider content-position="left">宠物现状</el-divider>
                <el-form-item label="绝育" prop="petSterilization">
                    <el-radio-group v-model="form.petSterilization" size="small">
                        <el-radio label="3" border>不详</el-radio>
                        <el-radio label="1" border>已绝育</el-radio>
                        <el-radio label="2" border>未绝育</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="疫苗" prop="petVaccine">
                    <el-radio-group v-model="form.petVaccine" size="small">
                        <el-radio label="3" border>不详</el-radio>
                        <el-radio label="1" border>已接种</el-radio>
                        <el-radio label="2" border>未接种</el-radio>
                        <el-radio label="4" border>接种中</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="驱虫" prop="petParasite">
                    <el-radio-group v-model="form.petParasite" size="small">
                        <el-radio label="3" border>不详</el-radio>
                        <el-radio label="1" border>已驱</el-radio>
                        <el-radio label="2" border>未驱</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="体型" prop="petSomatotype">
                    <el-radio-group v-model="form.petSomatotype" size="small">
                        <el-radio label="4" border>大型</el-radio>
                        <el-radio label="3" border>中型</el-radio>
                        <el-radio label="2" border>小型</el-radio>
                        <el-radio label="1" border>迷你</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="毛发" prop="petHair">
                    <el-radio-group v-model="form.petHair" size="small">
                        <el-radio label="1" border>无毛</el-radio>
                        <el-radio label="2" border>短毛</el-radio>
                        <el-radio label="3" border>长毛</el-radio>
                        <el-radio label="4" border>卷毛</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-divider content-position="left">宠物特点<span class="divider-remarks">（最多选择3个选项）</span></el-divider>
                <el-form-item label="特点" prop="petCharacteristic">
                    <el-checkbox-group v-model="form.petCharacteristic" :max="3" size="small" >
                        <el-checkbox v-for="item in petCharacteristic" :label="item.value" :key="item.value" border >{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-divider content-position="left">领养要求</el-divider>
                <el-form-item label="要求" prop="adoptRequirements">
                    <el-checkbox-group v-model="form.adoptRequirements">
                        <div v-for="item in adoptRequirements">
                            <el-checkbox  :label="item.value" :key="item.value">{{item.name}}</el-checkbox><br>
                        </div>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="" >
                    <el-input
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="requirementsText"
                            maxlength="200"
                            rows="5"
                            show-word-limit
                    ></el-input>
                </el-form-item>

                <el-divider content-position="left">送养故事</el-divider>
                <el-form-item label="故事" prop="story">
                    <el-input
                            type="textarea"
                            placeholder="请描述宠物饮食偏好、行为习惯、运动量等，以及送养原因、宠物过往经历、情感故事等。"
                            v-model="form.story"
                            maxlength="200"
                            rows="5"
                            show-word-limit
                    ></el-input>
                </el-form-item>

                <el-divider content-position="left">联系方式</el-divider>
                <el-form-item label="所在地" prop="address">
                    <el-select v-model="form.address" placeholder="请选择所在地（仅限上海市）" value="" style="width:100%;" >
                        <el-option v-for="value in addressRange" :label="value" :value="value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="微信号" prop="wxId">
                    <el-input v-model="form.wxId" placeholder="请输入微信号"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobilePhone">
                    <el-input v-model="form.mobilePhone" placeholder="请输入手机号"></el-input>
                </el-form-item>

                <el-button class="form-sumbit" type="primary" @click="adoptNew">提 交</el-button>
            </el-form>
            <br>
        </div>

    </d2-container>
</template>

<script>
    import {adoptDetail} from "@/api/adoptRelease/adoptReleaseApi"
    import util from '@/libs/util'
    export default {
        name: "check",
        data () {
            return {
                petId:"",
                actionUrl:"https://www.linchongpets.com/lpCmsTest/oss/image"
            }
        },
        mounted(){
            this.petId = this.$route.query.petId;
            this.adoptDetail()
        },
        methods:{
            adoptDetail(){
                let data={
                    petId: this.petId,
                    userId: util.cookies.get("userId")
                };
                adoptDetail(data).then(res => {
                    console.log(res)
                });
            }
        }
    }
</script>

<style scoped>

</style>
