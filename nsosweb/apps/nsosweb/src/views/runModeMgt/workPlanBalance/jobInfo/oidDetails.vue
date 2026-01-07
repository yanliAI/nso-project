<template>
  <div style="width: 100%; height: 100%" class="bg-white">
    <div>
      <el-card shadow="never" style="margin-bottom: 20px">
        <el-form ref="formRef" :inline="true" label-position="right" label-width="200px" :model="data">
          <!-- 基础信息 -->
          <div class="primary flex items-center title-box" style="margin-bottom: 20px">
            <div class="title-icon"></div>
            <div class="ml-1 font-bold">基础信息</div>
          </div>
          <el-row :gutter="80">
            <el-col :span="12">
              <el-form-item label="工单号:" required style="width: 100%">
                <span v-if="data.oid">{{ data.oid }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="关联工作计划:" required style="width: 100%">
                <span style="color: #3184fc; cursor: pointer" v-if="data.workPlanOid" @click="returnWorkDeatil()">{{ data.workPlanOid }}</span>
                <span style="color: #a6aebe" v-else>未关联</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="信息两票标题:" required style="width: 100%">
                <el-input v-model="data.title" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="8">
              <el-form-item label="计划来源:" required style="width: 100%">
                <el-select v-model="data.planSrc" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['planSrc']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工作地点:" required style="width: 100%">
                <el-input v-model="data.workPlace" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否发布类作业:" style="width: 100%">
                <el-select v-model="data.isPublishJob" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['isPublishJob']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="8">
              <el-form-item label="是否重保:" style="width: 100%">
                <el-select v-model="data.isFloodPeriod" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['isFloodPeriod']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="重保名称:" style="width: 100%">
                <el-input v-model="data.heavyName" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工作票类型:" style="width: 100%">
                <el-select v-model="data.operationType" :disabled="true">
                  <el-option v-for="item in AllDicts['operationType']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="8">
              <el-form-item label="涉及网省协同:" style="width: 100%">
                <el-select v-model="data.involveSynergy" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['involveSynergy']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="作业环境:" style="width: 100%" required>
                <el-select v-model="data.networkenv" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['networkenv']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="作业计划类型:" style="width: 100%">
                <el-select v-model="data.planType" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['planType']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="关联工单:" style="width: 100%">
                <span style="color: #3184fc" v-if="data.otherOid">{{ data.otherOid }}</span>
                <span style="color: #a6aebe" v-else>未关联</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="涉及运行变更:" style="width: 100%" required>
                <el-switch v-model="data.runChange" inline-prompt active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="运行方式变更情况:" style="width: 100%" required>
                <el-input v-model="data.isChangeRunModel" :disabled="true" type="textarea" :rows="4" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="工作任务:" style="width: 100%" required>
                <el-input v-model="data.operationContent" :disabled="true" type="textarea" :rows="4" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="堡垒机敏感命令:" style="width: 100%">
                <el-input :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="作业单位:" style="width: 100%" required>
                <el-input v-model="data.unitName" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="业务部门:" style="width: 100%" required>
                <el-input v-model="data.workDeptName" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="影响单位:" style="width: 100%" required>
                <el-input v-model="data.influenceUnitsName" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="8">
              <el-form-item label="是否需要使用Windows跳板机:" style="width: 100%" required v-if="showWindowsHost">
                <el-select v-model="data.isWindowsHost" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['isWindowsHost']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="8">
              <el-form-item label="元数据变更(库表或字段变更即涉及):" style="width: 100%" required>
                <el-select v-model="data.metadataChange" :disabled="true" placeholder="">
                  <el-option label="涉及" :value="1"></el-option>
                  <el-option label="不涉及" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="关联元数据变更申请:" style="width: 100%" required v-if="safeParseAttachInfo(data?.metadataMessage) && safeParseAttachInfo(data?.metadataMessage).length > 0">
                <div v-for="item in safeParseAttachInfo(data.metadataMessage)">
                  <span>{{ item.orderCode }}( {{ item.orderStateName }} )</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="工作条件:" style="width: 100%" required>
                <el-input v-model="data.workCondition" type="textarea" :rows="4" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="工作要求的安全措施:" style="width: 100%" required>
                <el-input v-model="data.otherMatters" type="textarea" :rows="4" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="作业公告内容:" style="width: 100%">
                <el-input v-model="data.workNotice" type="textarea" :rows="4" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="备注:" style="width: 100%">
                <el-input type="textarea" :rows="4" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <span style="color: red; margin: 20px 100px">请点击“风险评估”按钮维护作业基准风险、作业人员、作业系统、作业对象、作业时段、影响范围等作业风险相关信息。</span>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="作业风险:" style="width: 100%" required>
                <div style="display: flex; align-items: center">
                  <el-button type="primary" style="margin-right: 10px" @click="dialogVisible.riskInfo = true"> 风险评估 </el-button>
                  <el-input v-model="riskVal" :disabled="true" style="width: 880px;"  :class="{ 'high-light': riskVal && riskVal.includes('高') }" > </el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="8">
              <el-form-item label="影响业务:" style="width: 100%">
                <el-select v-model="data.affectBusiness" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['affectBusiness']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预授权作业:" style="width: 100%">
                <el-select v-model="data.preAuthorizeTasks" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['preAuthorizeTasks']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="作业对象类型:" style="width: 100%">
                <el-input v-model="objType" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="工作票签发人:" style="width: 100%">
                <el-input v-model="data.signerUser" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="工作负责人(监护人):" style="width: 100%">
                <el-input v-model="data.workLeader" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="专责监护人:" style="width: 100%">
                <el-input v-model="data.guardian" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="工作班成员:" style="width: 100%" required>
                <el-input v-model="data.workMember" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="堡垒机账号:" style="width: 100%" required>
                <el-input v-model="data.fortressAccounts" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 作业台账清单 -->
          <div class="primary flex items-center title-box" style="margin: 20px 0">
            <div class="title-icon"></div>
            <div class="ml-1 font-bold">作业台账清单</div>
          </div>

          <el-row :gutter="80">
            <el-col :span="8">
              <el-form-item label="作业计划开始时间:" style="width: 100%">
                <el-date-picker v-model="data.workStartTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" style="width: 100%" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="作业计划结束时间:" style="width: 100%">
                <el-date-picker v-model="data.workEndTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" style="width: 100%" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="作业计划总时长:" style="width: 100%">
                <span v-if="data.workStartTime && data.workEndTime">{{ calculateDuration(data.workStartTime, data.workEndTime) }}</span>
                <span v-else>0小时0分钟</span>
                <span class="delay-icon" v-if="isDelayed(data.workStartTime, data.workEndTime, data.startTime, data.endTime)">延期</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="8">
              <el-form-item label="作业实际开始时间:" style="width: 100%">
                <el-date-picker v-model="data.startTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" style="width: 100%" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="作业实际结束时间:" style="width: 100%">
                <el-date-picker v-model="data.endTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" style="width: 100%" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="作业总时长:" style="width: 100%">
                <span v-if="data.startTime && data.endTime">{{ calculateDuration(data.startTime, data.endTime) }}</span>
                <span v-else>0小时0分钟</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="8">
              <el-form-item label="停机总时长:" style="width: 100%">
                <span v-if="data.timeList">{{ calculateServiceDowntime(data.timeList)?.isHalt?.duration }}</span>
                <span v-else>0小时0分钟</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="停服总时长:" style="width: 100%">
                <span v-if="data.timeList">{{ calculateServiceDowntime(data.timeList)?.isServe?.duration }}</span>
                <span v-else>0小时0分钟</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="非停机停服导致的服务降级时长:" style="width: 100%">
                <span v-if="data.timeList">{{ calculateServiceDowntime(data.timeList)?.noHaltServe?.duration }}</span>
                <span v-else>0小时0分钟</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="8">
              <el-form-item label="作业台账清单:" style="width: 100%">
                <el-button size="small" type="primary" @click="openJobLedgerList"> 查看</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 作业系统 -->
          <div class="primary flex items-center title-box" style="margin: 20px 0">
            <div class="title-icon"></div>
            <div class="ml-1 font-bold">作业系统</div>
          </div>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="作业系统:" style="width: 100%">
                <el-table border stripe ref="tableRef" :data="data.operationPlansItemList" max-height="300">
                  <el-table-column label="操作" align="center" width="120" fixed>
                    <template #default="{ row, $index }">
                      <el-button size="small" type="primary" @click="openJobSysList(row)">查看</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="系统名称" prop="appName" align="center" show-overflow-tooltip />
                  <el-table-column label="实例ID" prop="ciCode" align="center" />
                  <el-table-column label="系统设备主人" prop="equipmentName" align="center" />
                  <el-table-column label="系统设备主人数认账号" prop="equipmentId" align="center" />
                  <el-table-column label="业务负责人" prop="workUserName" align="center" />
                  <el-table-column label="业务负责人数认账号" prop="workUserId" align="center" />
                  <el-table-column label="影响用户数" prop="influenceCount" align="center" />
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 关联信息系统清单 -->
          <div class="primary flex items-center title-box" style="margin: 20px 0">
            <div class="title-icon"></div>
            <div class="ml-1 font-bold">关联信息系统清单</div>
          </div>

          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="关联信息系统清单:" style="width: 100%">
                <el-table border stripe :data="data.operationPlansAppList" max-height="300">
                  <el-table-column label="系统名称" prop="appName" align="center" show-overflow-tooltip />
                  <el-table-column label="系统设备主人" prop="equipmentName" align="center" />
                  <el-table-column label="系统设备主人数认账号" prop="equipmentId" align="center" />
                  <el-table-column label="业务负责人" prop="workUserName" align="center" />
                  <el-table-column label="业务负责人数认账号" prop="workUserId" align="center" />
                  <el-table-column label="影响开始时间" prop="startTime" align="center" />
                  <el-table-column label="影响结束时间" prop="endTime" align="center" />
                  <el-table-column label="影响用户数" prop="influenceCount" align="center" />
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 作业安排 -->
          <div class="primary flex items-center title-box" style="margin: 20px 0">
            <div class="title-icon"></div>
            <div class="ml-1 font-bold">作业安排</div>
          </div>

          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="作业安排:" style="width: 100%">
                <el-table border stripe :data="data.imWorkPlanList" max-height="300">
                  <el-table-column label="对象名称" prop="ciName" align="center" show-overflow-tooltip />
                  <el-table-column label="影响功能模块" prop="influenceModuleName" align="center" show-overflow-tooltip />
                  <el-table-column label="对象类型" prop="objectTypeName" align="center" show-overflow-tooltip />
                  <el-table-column label="ip" prop="ip" align="center" show-overflow-tooltip />
                  <el-table-column label="开始时间" prop="startTime" align="center" show-overflow-tooltip />
                  <el-table-column label="结束时间" prop="endTime" align="center" show-overflow-tooltip />
                  <el-table-column label="时长" align="center" show-overflow-tooltip>
                    <template #default="{ row, $index }">
                      <span>{{ calculateDuration(row.startTime, row.endTime) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="类型" align="center" show-overflow-tooltip>
                    <template #default="{ row, $index }">
                      <span v-if="row.type === 1" style="color: red">停机</span>
                      <span v-if="row.type === 2" style="color: red">停服</span>
                      <span v-if="row.type === 3" style="color: red">服务降级</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="系统服务质量降级" align="center">
                    <template #default="{ row, $index }">
                      <span v-if="row.isSystemDemotion === 1">是</span>
                      <span v-else>否</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <div style="padding-left: 100px">
            <el-row>
              <span style="font-weight: 500; margin: 20px">附件:</span>
            </el-row>
            <el-row :gutter="20">
              <el-col v-for="(file, index) in attachList" :key="file.id" :span="12" style="height: 45px; line-height: 45px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; color: black; font-size: 14px; font-weight: 400">
                <div class="file-name" :title="file.name" style="background-color: #f6f6f8; height: 45px; padding-left: 20px">
                  <el-icon color="grey" style="margin-right: 10px"><Document /></el-icon>{{ file.name }}
                </div>
                <div style="width: 100px; background-color: #f6f6f8; height: 45px">
                  {{ formatFileSize(file.size) }} <el-icon color="grey" class="download-icon" @click="downloadAttach(file.name, file.fileId, JSON.stringify(file.iDate), data.oid)"><Download /></el-icon>
                </div>
              </el-col>
            </el-row>
          </div> -->

          <!-- 填报材料 -->
          <div class="primary flex items-center title-box" style="margin: 20px 0">
            <div class="title-icon"></div>
            <div class="ml-1 font-bold">工作票填报资料清单</div>
          </div>

          <el-row :gutter="20" style="padding: 0 20px 0 100px; color: 14px; line-height: 1.5">
            <el-col v-for="(file, index) in AttachmentTitleName" :key="file.id" :span="12" style="margin-bottom: 20px; font-size: 14px; display: flex; align-items: center; justify-content: space-between">
              <div style="width: 150px; text-align: right; padding-right: 15px">{{ file.label }}</div>
              <div class="file-name1" style="max-height: 150px; overflow-y: auto">
                <div v-if="data[file.key] && file.key !== 'attach' && data[file.key] !== '[]'" v-for="(file, index) in JSON.parse(data[file.key])" style="display: flex; align-items: center">
                  <div class="file-list" :title="file.name" @click="downloadAttach(file.name, file.fileId, JSON.stringify(file.iDate), data.oid)">
                    <span
                      ><el-icon color="grey" style="margin-right: 10px"><Document /></el-icon> {{ file.name }}</span
                    >
                  </div>
                  <span style="width: 100px; background-color: #f6f6f8; height: 25px; padding: 5px; margin-bottom: 5px">
                    {{ formatFileSize(file.size) }} <el-icon color="grey" class="download-icon" @click="downloadAttach(file.name, file.fileId, JSON.stringify(file.iDate), data.oid)"><Download /></el-icon>
                  </span>
                </div>
                <div v-else-if="data[file.key] && file.key === 'attach' && data[file.key] !== '[]'" v-for="(file, index) in attachList" style="display: flex; align-items: center">
                  <div class="file-list" :title="file.name" @click="downloadAttach(file.name, file.fileId, JSON.stringify(file.iDate), data.oid)">
                    <span
                      ><el-icon color="grey" style="margin-right: 10px"><Document /></el-icon>{{ file.name }}</span
                    >
                  </div>
                  <span style="width: 100px; background-color: #f6f6f8; height: 25px; padding: 5px; margin-bottom: 5px">
                    {{ formatFileSize(file.size) }} <el-icon color="grey" class="download-icon" @click="downloadAttach(file.name, file.fileId, JSON.stringify(file.iDate), data.oid)"><Download /></el-icon>
                  </span>
                </div>
                <div v-else style="color: #a6aebe">暂无附件</div>
              </div>
            </el-col>
          </el-row>

          <!-- 信息操作票 -->
          <div class="primary flex items-center title-box" style="margin: 20px 0">
            <div class="title-icon"></div>
            <div class="ml-1 font-bold">信息操作票</div>
          </div>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="信息操作票:" style="width: 100%" required>
                <el-table border stripe :data="data.operationTicketsList" max-height="300">
                  <el-table-column label="序号" type="index" width="60" align="center" />
                  <el-table-column label="操作项" prop="operationItem" align="center" show-overflow-tooltip />
                  <el-table-column label="操作人员" prop="operationUser" align="center" width="150" show-overflow-tooltip />
                  <el-table-column label="操作开始时间" prop="operationStartTime" width="150" align="center" show-overflow-tooltip />
                  <el-table-column label="操作结束时间" prop="operationEndTime" width="150" align="center" show-overflow-tooltip />
                  <el-table-column label="操作" align="center" width="100" show-overflow-tooltip>
                    <template #default="{ row, $index }">
                      <el-button type="primary" size="small" @click="openOperatingTicket(row)"> 查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="基准风险管控措施:" style="width: 100%">
                <el-table border stripe :data="data?.riskAssessObj?.typeBasicRisks" max-height="300">
                  <el-table-column label="所属单位" prop="applyUnitName" align="center" />
                  <el-table-column label="作业类型" prop="type" align="center" />
                  <el-table-column label="作业内容" prop="content" align="center" />
                  <el-table-column label="预授权作业" prop="content" align="center">
                    <template #default="{ row, $index }">
                      <span v-if="row.preAuthorizeTasks === 0">否</span>
                      <span v-else>是</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="风险描述" prop="riskDescription" align="center" />
                  <el-table-column label="作业风险管控措施" prop="controlMeasure" align="center" />
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 流程及工单附件汇总 -->
          <div class="primary flex items-center title-box" style="margin: 20px 0">
            <div class="title-icon"></div>
            <div class="ml-1 font-bold">流程及工单附件汇总</div>
          </div>

          <div style="padding-left: 100px">
            <!-- <el-row>
            <el-button type="primary">全部下载</el-button>
          </el-row> -->
            <el-row>
              <span style="font-weight: 500; margin: 20px">附件:</span>
            </el-row>
            <el-row :gutter="20">
              <el-col v-for="(file, index) in attachMergeList" :key="file.id" :span="12" style="height: 45px; line-height: 45px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; color: black; font-size: 14px; font-weight: 400">
                <div class="file-name" :title="file.name" style="background-color: #f6f6f8; height: 45px; padding-left: 20px" @click="downloadAttach(file.name, file.fileId, JSON.stringify(file.iDate), data.oid)">
                  <el-icon color="grey" style="margin-right: 10px"><Document /></el-icon>{{ file.name }}
                </div>
                <div style="width: 100px; background-color: #f6f6f8; height: 45px">
                  {{ formatFileSize(file.size) }}<el-icon color="grey" class="download-icon" @click="downloadAttach(file.name, file.fileId, JSON.stringify(file.iDate), data.oid)"><Download /></el-icon>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-card>
      <!-- v-if="taskId && sourceType === '2'"  -->
      <TaskConfig v-if="taskId && sourceType === '2'"  :taskName="taskName" :taskId="taskId" :oid="data.oid" :pid="data.pid" :tid="tid" :autoHandler="autoHandler" :signerUserId="data.signerUserId" :signerUser="data.signerUser"></TaskConfig>
    </div>
    <!-- 作业台账清单 -->
    <el-dialog v-model="dialogVisible.jobLedgerList" title="作业台账清单" width="80%">
      <el-table border stripe ref="tableRef" :data="itemApp?.operationPlansItemList?.filter((item) => item?.ip ?? '') || []" height="600">
        <el-table-column label="操作" align="center" width="120" fixed>
          <template #default="{ row, $index }">
            <el-button size="small" type="primary" @click="openJobLedgerDetail(row)"> 查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="所属信息系统名称" prop="appName" align="center" show-overflow-tooltip />
        <el-table-column label="实例ID" prop="ciCode" align="center" show-overflow-tooltip />
        <el-table-column label="配置项名称" prop="ciName" align="center" show-overflow-tooltip />
        <el-table-column label="IP" prop="ip" align="center" show-overflow-tooltip> </el-table-column>

        <el-table-column label="业务负责人" prop="workUserName" align="center" />
        <el-table-column label="业务负责人数认账号" prop="workUserId" align="center" />
        <el-table-column label="设备主人" prop="equipmentName" align="center" />
        <el-table-column label="设备主人数认账号" prop="equipmentId" align="center" />
        <el-table-column label="影响用户数" prop="influenceCount" align="center" />
      </el-table>

      <template #footer>
        <el-button @click="dialogVisible.jobLedgerList = false">关闭</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible.jobLedgerDetail" title="作业台账清单" width="70%">
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">配置项名称:</div>
            <el-input v-model="currentLedger.ciName" disabled></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">配置项类型:</div>
            <el-input v-model="currentLedger.ciType" disabled></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">所属的信息系统名称:</div>
            <el-input v-model="currentLedger.appName" disabled></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">IP:</div>
            <el-input v-model="currentLedger.ip" disabled></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">业务负责人:</div>
            <el-input v-model="currentLedger.workUserName" disabled></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">业务负责人数认账号:</div>
            <el-input v-model="currentLedger.workUserId" disabled></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">设备主人:</div>
            <el-input v-model="currentLedger.equipmentName" disabled></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">设备主人数认账号:</div>
            <el-input v-model="currentLedger.equipmentId" disabled></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">影响用户数:</div>
            <el-input v-model="currentLedger.influenceCount" disabled></el-input>
          </div>
        </el-col>
      </el-row>

      <template #footer>
        <el-button @click="dialogVisible.jobLedgerDetail = false">关闭</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible.jobSysList" title="作业系统" width="70%">
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">配置项名称:</div>
            <el-input v-model="currentSysInfo.ciName" disabled></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">配置项类型:</div>
            <el-input v-model="currentSysInfo.ciType" disabled></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">所属的信息系统名称:</div>
            <el-input v-model="currentSysInfo.appName" disabled></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">IP:</div>
            <el-input v-model="currentSysInfo.ip" disabled></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">业务负责人:</div>
            <el-input v-model="currentSysInfo.workUserName" disabled></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">业务负责人数认账号:</div>
            <el-input v-model="currentSysInfo.workUserId" disabled></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">设备主人:</div>
            <el-input v-model="currentSysInfo.equipmentName" disabled></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">设备主人数认账号:</div>
            <el-input v-model="currentSysInfo.equipmentId" disabled></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">影响用户数:</div>
            <el-input v-model="currentSysInfo.influenceCount" disabled></el-input>
          </div>
        </el-col>
      </el-row>

      <template #footer>
        <el-button @click="dialogVisible.jobSysList = false">关闭</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible.operatingTicket" title="操作票" width="70%">
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="24">
          <div class="flex items-center">
            <div class="dialog-title">操作项目:</div>
            <el-input v-model="currentOperatingTicket.operationItem" type="textarea" :rows="4" disabled></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="24">
          <div class="flex items-center">
            <div class="dialog-title">操作开始时间:</div>
            <el-date-picker v-model="currentOperatingTicket.operationStartTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" style="width: 100%" disabled />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="24">
          <div class="flex items-center">
            <div class="dialog-title">操作结束时间:</div>
            <el-date-picker v-model="currentOperatingTicket.operationEndTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" style="width: 100%" disabled />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="24">
          <div class="flex items-center">
            <div class="dialog-title">操作人:</div>
            <el-input v-model="currentOperatingTicket.operationUser" disabled></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="24">
          <div class="flex items-center">
            <div class="dialog-title">备注:</div>
            <el-input v-model="currentOperatingTicket.notes" type="textarea" :rows="4" disabled></el-input>
          </div>
        </el-col>
      </el-row>

      <template #footer>
        <el-button @click="dialogVisible.operatingTicket = false">关闭</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible.riskInfo" title="风险评估详情" width="80%">
      <div style="height: 600px; overflow-y: auto">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="风险评估" name="first">
            <el-row class="box1">
              <span>作业风险评估模型</span>
            </el-row>
            <el-row>
              <el-col :span="6" class="box1">作业风险值</el-col>
              <el-col :span="6" class="box1">{{ data.riskLevelSum }}</el-col>
              <el-col :span="6" class="box1">作业类型基准风险值A</el-col>
              <el-col :span="6" class="box1">{{ riskBaseA }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="box1">计算风险等级</el-col>
              <el-col :span="6" class="box1">{{ getLabelByValue('riskLevel', data.riskLevel) }}({{ data.riskLevelSum }})</el-col>
              <el-col :span="6" class="box1">作业类型基准风险值B</el-col>
              <el-col :span="6" class="box1">{{ riskBaseB }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="box1">自评风险值</el-col>
              <el-col :span="6" class="box1">{{ data.riskLevelSum }}</el-col>
              <el-col :span="6" class="box1">作业环境和时段风险值C</el-col>
              <el-col :span="6" class="box1">{{ riskBaseC }}</el-col>
            </el-row>

            <el-row>
              <el-col :span="6" class="box1">风险类别</el-col>
              <el-col :span="6" class="box1"></el-col>
              <el-col :span="6" class="box1">风险类型</el-col>
              <el-col :span="6" class="box1">风险值</el-col>
            </el-row>

            <el-row>
              <el-col :span="6" class="box1">作业类型基准风险值A</el-col>
              <el-col :span="6" class="box1">详细作业类型基准风险</el-col>
              <el-col :span="6" class="box1"></el-col>
              <el-col :span="6" class="box1">{{ riskBaseA }}</el-col>
            </el-row>

            <el-row>
              <el-col :span="6" class="box2">作业人员能力风险值B</el-col>
              <el-col :span="6">
                <div class="box3">B1工作负责人（含小组工作负责人）安全意识评估</div>
                <div class="box3">B2主要工作班成员（辅助工除外）安全意识评估</div>
                <div class="box3">B3监护人（含专职监护人）安全意识评估</div>
                <div class="box3">B4作业总人数评分</div>
                <div class="box3">B5作业人员临时变更评分</div>
                <div class="box3">B6人员性质</div>
              </el-col>
              <el-col :span="6">
                <div class="box3">3 年内累计1 次以下 C 类违章</div>
                <div class="box3">3 年内无违章</div>
                <div class="box3">3 年内无违章</div>
                <div class="box3">不超过 5 人</div>
                <div class="box3">工作负责人在作业前 1 日确认</div>
                <div class="box3">本单位</div>
              </el-col>
              <el-col :span="6">
                <div class="box3">{{ data.riskAssessObj.bScore1 }}</div>
                <div class="box3">{{ data.riskAssessObj.bScore2 }}</div>
                <div class="box3">{{ data.riskAssessObj.bScore3 }}</div>
                <div class="box3">{{ data.riskAssessObj.bScore4 }}</div>
                <div class="box3">{{ data.riskAssessObj.bScore5 }}</div>
                <div class="box3">{{ data.riskAssessObj.bScore6 }}</div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="6" class="box2">作业环境和时段风险值C</el-col>
              <el-col :span="6">
                <div class="box3">C1-1作业环境</div>
                <div class="box3">C1-2作业系统</div>
                <div class="box3">C2-1作业时段(业务、非业务）</div>
                <div class="box3">C2-2作业时段(重保等级）</div>
                <div class="box3">C3系统停服情</div>
                <div class="box3">C4-1影响范围（单位）</div>
                <div class="box3">C4-2影响范围（用户性质）</div>
                <div class="box3">C5单日持续作业时长（疲劳度）</div>
                <div class="box3">C6计划性质</div>
              </el-col>
              <el-col :span="6">
                <div class="box3">生产环境</div>
                <div class="box3">二类关键信息系统</div>
                <div class="box3">业务时段</div>
                <div class="box3">非重保时段</div>
                <div class="box3">系统部分停服，不涉及核心功能模块</div>
                <div class="box3">不影响用户</div>
                <div class="box3">影响重要生产用户</div>
                <div class="box3">大于12 h</div>
                <div class="box3">计划性工作</div>
              </el-col>
              <el-col :span="6">
                <div class="box3">{{ data.riskAssessObj.cScore11 }}</div>
                <div class="box3">{{ data.riskAssessObj.cScore12 }}</div>
                <div class="box3">{{ data.riskAssessObj.cScore21 }}</div>
                <div class="box3">{{ data.riskAssessObj.cScore22 }}</div>
                <div class="box3">{{ data.riskAssessObj.cScore41 }}</div>
                <div class="box3">{{ data.riskAssessObj.cScore42 }}</div>
                <div class="box3">{{ data.riskAssessObj.cScore5 }}</div>
                <div class="box3">{{ data.riskAssessObj.cScore6 }}</div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="作业类型基准风险" name="second">
            <el-table :data="data?.riskAssessObj?.typeBasicRisks" style="width: 100%">
              <el-table-column label="作业类型风险基准A">
                <el-table-column label="典型作业内容">
                  <el-table-column prop="applyUnitName" label="所属单位" />
                  <el-table-column prop="type" label="作业类型" />
                  <el-table-column prop="content" label="作业内容" />
                  <el-table-column label="预授权作业">
                    <template #default="scope">
                      <span v-if="scope.row.preAuthorizeTasks === 1">是</span>
                      <span v-else>否</span>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="风险值">
                  <el-table-column prop="score" label="分值" />
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="作业饱和度" name="third">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column label="用户名" />
              <el-table-column label="账号" />
              <el-table-column label="手机号码" />
              <el-table-column label="分值" />
              <el-table-column label="作业风险">
                <el-table-column label="高" />
                <el-table-column prop="type" label="中" />
                <el-table-column prop="content" label="低" />
                <el-table-column prop="content" label="可接受" />
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>

      <template #footer>
        <el-button @click="dialogVisible.riskInfo = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ElTable, ElAffix, ElTableColumn, ElRow, ElCard, ElCol, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElContainer, ElAside, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElCollapse, ElCollapseItem, ElTag } from 'element-plus'
import { Search, Download, Monitor, Operation, Document, Back, CircleCheck } from '@element-plus/icons-vue'
import { Page } from '@vben/common-ui'
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { calculateDuration } from '#/utils/commonUtil.ts'
import { downloadFile } from '#/utils/download.ts'
import dictMap from './dictMap.js'
import { getworkPlanTaskDetailApi, getydTodoTasksApi, getworkPlanTaskApi, getydTaskRecodsApi } from '#/api'
import { useRoute, useRouter } from 'vue-router'
import calculateServiceDowntime from './calDurations.js'
import TaskConfig from './taskConfig.vue'
const emit = defineEmits(['custom-event', 'sendPid'])
const router = useRouter()
const oid = defineModel('oid')
const tid = defineModel('tid')
const sourceType = defineModel('sourceType')
const showWindowsHost = ref(false)
const taskId = ref('')
const taskName = ref('方式审核')
const dialogVisible = reactive({
  jobLedgerList: false, // 作业台账清单
  jobSysList: false, // 作业系统
  operatingTicket: false, // 作业安排 操作票
  jobLedgerDetail: false, // // 作业台账清单-详情
  riskInfo: false // 风险评估信息详情
})
const objType = ref('') // 作业对象类型
const attachList = ref([]) // 信息两票工单详情信息中的附件
const attachMergeList = ref([]) // 信息两票工单详情信息中的附件 与 工单流程信息中的附件
const data = ref({}) // 信息两票工单详情信息
const flowData = ref('') // 工单流程信息
const activeName = ref('first')
const riskVal = ref('') // 拼接风险等级和得分
const AllDicts = ref({}) // 获取字典值
const tableData = ref([]) // 作业饱和度
const riskBaseA = ref(0) // 作业类型基准风险值A
const riskBaseB = ref(0) // 作业类型基准风险值B
const riskBaseC = ref(0) // 作业类型基准风险值C

const itemApp = ref([]) // 作业台账清单

// 附件字典
const AttachmentTitleName = [
  {
    label: '其他:',
    key: 'attach'
  },
  {
    label: '现场勘测及安全技术交底单:',
    key: 'attachRecon'
  },
  {
    label: '发布功能清单:',
    key: 'attachFunction'
  },
  {
    label: '配置变更清单:',
    key: 'attachChange'
  },
  {
    label: '发布测试报告(含功能、性能、安全测试):',
    key: 'attachTest'
  },
  {
    label: '出厂功能、性能、安全测试报告(未上线投运系统)',
    key: 'attachNoLine'
  },
  {
    label: '第三方功能、性能、安全测试报告(已上线投运系统)',
    key: 'attachLine'
  },
  {
    label: '拓扑图(调整前):',
    key: 'attachGplot'
  },
  {
    label: '拓扑图(调整后)',
    key: 'attachGplotBack'
  }
]

const autoHandler = ref({})
AllDicts.value = getAllDicts()

onMounted(() => {
  // if(oid.value){
  //   query()
  // }
  query()
  getworkPlanTask()
})

watch(oid, (newVal) => {
  query()
})
watch(tid, (newVal) => {
  getworkPlanTask()
})

//切换到工作计划详情页面
function returnWorkDeatil() {
  emit('custom-event')
}

// 获取taskId的接口
async function getworkPlanTask() {
  try {
    if (!tid.value) return
    const res = await getworkPlanTaskApi({
      data: {
        id: tid.value
      }
    })
    taskId.value = res.data.data.taskid
    taskName.value = res.data.data.taskname
  } catch (error) {}
}

const res = {
        "adminUnitCode": "00",
        "adminUnitName": "南网总部",
        "affectBusiness": 0,
        "attach": "{\"1\":[{\"createdtime\":\"2025-09-21 21:05:48\",\"fileId\":\"21_liuxi_210548_9631338\",\"iDate\":20250921,\"id\":9631338,\"isread\":0,\"name\":\"9月第四周-调度指挥系统V1.0生产部署作业实施方案.pdf\",\"objId\":0,\"objType\":0,\"pid\":0,\"purpose\":0,\"ref\":0,\"size\":731049,\"status\":\"finished\",\"tId\":21,\"userId\":\"liuxi@csg.cn\",\"userName\":\"刘溪\",\"percentage\":100,\"uid\":1758510485466},{\"createdtime\":\"2025-09-21 21:05:48\",\"fileId\":\"21_liuxi_210548_9631333\",\"iDate\":20250921,\"id\":9631333,\"isread\":0,\"name\":\"9月第四周-调度指挥系统V1.0生产部署作业实施方案.docx\",\"objId\":0,\"objType\":0,\"pid\":0,\"purpose\":0,\"ref\":0,\"size\":467597,\"status\":\"finished\",\"tId\":21,\"userId\":\"liuxi@csg.cn\",\"userName\":\"刘溪\",\"percentage\":100,\"uid\":1758510485467}]}",
        "attachChange": "",
        "attachFunction": "",
        "attachGplot": "",
        "attachLine": "",
        "attachNoLine": "[{\"createdtime\":\"2025-09-21 21:05:15\",\"fileId\":\"21_liuxi_210515_9651321\",\"iDate\":20250921,\"id\":9651321,\"isread\":0,\"name\":\"【签章版】DGRIETCST202507024+云盾平台（网络安全运行调度控制智能指挥应用V1.0）+出厂测试报告_部分2.pdf\",\"objId\":0,\"objType\":0,\"pid\":0,\"purpose\":0,\"ref\":0,\"size\":14798041,\"status\":\"finished\",\"tId\":21,\"userId\":\"liuxi@csg.cn\",\"userName\":\"刘溪\",\"sign\":1758459524847,\"percentage\":100,\"uid\":1758510482364},{\"createdtime\":\"2025-09-21 21:05:15\",\"fileId\":\"21_liuxi_210515_9651326\",\"iDate\":20250921,\"id\":9651326,\"isread\":0,\"name\":\"【签章版】DGRIETCST202507024+云盾平台（网络安全运行调度控制智能指挥应用V1.0）+出厂测试报告_部分1.pdf\",\"objId\":0,\"objType\":0,\"pid\":0,\"purpose\":0,\"ref\":0,\"size\":16015884,\"status\":\"finished\",\"tId\":21,\"userId\":\"liuxi@csg.cn\",\"userName\":\"刘溪\",\"sign\":1758459524847,\"percentage\":100,\"uid\":1758510482365}]",
        "attachRecon": "",
        "attachTest": "",
        "autoHandler": "{\"departmentAuto\":[{\"nid\":342875,\"userid\":\"liuxi@csg.cn\",\"type\":1}],\"implement\":[{\"nid\":342274,\"userid\":\"liuxi@csg.cn\",\"type\":1}],\"workLeaderAuto\":[{\"nid\":342255,\"userid\":\"liuxi@csg.cn\",\"type\":1}],\"workEquipmentAuto\":[{\"nid\":342258,\"userid\":\"liuxi@csg.cn\",\"type\":1}],\"signerUserAuto\":[{\"nid\":342267,\"userid\":\"shews@csg.cn\",\"type\":1}]}",
        "autoWork": 0,
        "bastionBlackList": "",
        "configItems": "[{\"objectTypeText\":\"数据库实例 / DM数据库实例\",\"ci_code\":\"6352b0fe14d39\",\"bk_obj_id\":\"DM@ONEMODEL\",\"bk_host_innerip\":\"10.9.73.157\",\"access_port\":5237,\"listen_port\":[\"5237\"],\"instanceId\":\"6352b0fe14d39\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"DM@ONEMODEL\"},{\"objectTypeText\":\"数据库实例 / DM数据库实例\",\"ci_code\":\"6352b1175534d\",\"bk_obj_id\":\"DM@ONEMODEL\",\"bk_host_innerip\":\"10.9.73.158\",\"access_port\":5237,\"listen_port\":[\"5237\"],\"instanceId\":\"6352b1175534d\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"DM@ONEMODEL\"},{\"objectTypeText\":\"数据库实例 / DM数据库实例\",\"ci_code\":\"6352b11e70781\",\"bk_obj_id\":\"DM@ONEMODEL\",\"bk_host_innerip\":\"10.9.73.159\",\"access_port\":5237,\"listen_port\":[\"5237\"],\"instanceId\":\"6352b11e70781\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"DM@ONEMODEL\"},{\"objectTypeText\":\"数据库实例 / DM数据库实例\",\"ci_code\":\"6352b125d41e9\",\"bk_obj_id\":\"DM@ONEMODEL\",\"bk_host_innerip\":\"10.9.73.160\",\"access_port\":5237,\"listen_port\":[\"5237\"],\"instanceId\":\"6352b125d41e9\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"DM@ONEMODEL\"},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b2a4daeee1\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"10.9.73.157\",\"instanceId\":\"634b2a4daeee1\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b2ade72739\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"10.9.73.158\",\"instanceId\":\"634b2ade72739\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b2b32b9671\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"10.9.73.159\",\"instanceId\":\"634b2b32b9671\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b2b847c625\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"10.9.73.160\",\"instanceId\":\"634b2b847c625\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"63486cd43ba8d\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"10.9.57.127\",\"instanceId\":\"63486cd43ba8d\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"63486d31e8e8d\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"10.9.57.128\",\"instanceId\":\"63486d31e8e8d\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"63486d89ccfb9\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"10.9.57.129\",\"instanceId\":\"63486d89ccfb9\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"63486dd528701\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"10.9.57.130\",\"instanceId\":\"63486dd528701\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"63486e1175dd5\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"10.9.57.131\",\"instanceId\":\"63486e1175dd5\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"63486e4c753bd\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"10.9.57.132\",\"instanceId\":\"63486e4c753bd\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"ci_code\":\"62ac8031228ed\",\"ci_name\":\"网络安全运行调度控制系统\",\"bk_obj_id\":\"BUSINESS\",\"instanceId\":\"62ac8031228ed\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"BUSINESS\",\"objectTypeText\":\"应用系统 / 应用系统\"},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b232c981a5\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:e7b:e890\",\"instanceId\":\"634b232c981a5\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b2342c7921\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9c9:6ef0\",\"instanceId\":\"634b2342c7921\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b238fa37f9\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9cb:62f0\",\"instanceId\":\"634b238fa37f9\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b23a5f1ba5\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9db:6c68\",\"instanceId\":\"634b23a5f1ba5\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b23bc9b121\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9db:6c68\",\"instanceId\":\"634b23bc9b121\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b23c1015d5\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9db:6c68\",\"instanceId\":\"634b23c1015d5\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b2541885a9\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:a09:20e0\",\"instanceId\":\"634b2541885a9\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188671\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:931:8d60\",\"instanceId\":\"634b254188671\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188739\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:97f:1af1\",\"instanceId\":\"634b254188739\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188801\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:945:868\",\"instanceId\":\"634b254188801\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188865\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:944:92bc\",\"instanceId\":\"634b254188865\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b25418892d\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:951:c1bc\",\"instanceId\":\"634b25418892d\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188991\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:925:3538\",\"instanceId\":\"634b254188991\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188a59\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:908:2678\",\"instanceId\":\"634b254188a59\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188abd\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9a2:dc2\",\"instanceId\":\"634b254188abd\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188b85\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:991:a5ad\",\"instanceId\":\"634b254188b85\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188c4d\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:8fd:1670\",\"instanceId\":\"634b254188c4d\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188cb1\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:341a:cc64\",\"instanceId\":\"634b254188cb1\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188d79\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9e5:4008\",\"instanceId\":\"634b254188d79\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188ddd\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:972:c4b0\",\"instanceId\":\"634b254188ddd\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188ea5\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:94b:6168\",\"instanceId\":\"634b254188ea5\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188f09\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:98b:f890\",\"instanceId\":\"634b254188f09\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254188fd1\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:985:aacc\",\"instanceId\":\"634b254188fd1\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189035\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:930:4018\",\"instanceId\":\"634b254189035\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b2541890fd\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:342e:4f50\",\"instanceId\":\"634b2541890fd\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189161\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:918:33d8\",\"instanceId\":\"634b254189161\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189229\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9d5:51e8\",\"instanceId\":\"634b254189229\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b25418928d\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:904:984d\",\"instanceId\":\"634b25418928d\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189355\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:8f8:b940\",\"instanceId\":\"634b254189355\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b25418941d\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:969:9b34\",\"instanceId\":\"634b25418941d\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189481\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:3428:bc5c\",\"instanceId\":\"634b254189481\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189549\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:924:ca04\",\"instanceId\":\"634b254189549\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b2541895ad\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:f006:2f67\",\"instanceId\":\"634b2541895ad\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189675\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:a88:e2a8\",\"instanceId\":\"634b254189675\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b2541896d9\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:970:8678\",\"instanceId\":\"634b2541896d9\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b2541897a1\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:954:3720\",\"instanceId\":\"634b2541897a1\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189805\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9b4:9bc2\",\"instanceId\":\"634b254189805\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b2541898cd\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9ad:764c\",\"instanceId\":\"634b2541898cd\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189931\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:f03b:b880\",\"instanceId\":\"634b254189931\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b2541899f9\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9d5:1c12\",\"instanceId\":\"634b2541899f9\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189a5d\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:8e9:4190\",\"instanceId\":\"634b254189a5d\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189b25\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:970:7595\",\"instanceId\":\"634b254189b25\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189b89\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:961:fbd0\",\"instanceId\":\"634b254189b89\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189c51\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:97d:9cc5\",\"instanceId\":\"634b254189c51\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189cb5\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:f005:12f8\",\"instanceId\":\"634b254189cb5\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189d7d\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9ab:1950\",\"instanceId\":\"634b254189d7d\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189de1\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:97d:a1f0\",\"instanceId\":\"634b254189de1\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189ea9\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9df:3095\",\"instanceId\":\"634b254189ea9\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189f0d\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:955:5830\",\"instanceId\":\"634b254189f0d\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b254189fd5\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:954:8495\",\"instanceId\":\"634b254189fd5\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b25418a039\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:926:8725\",\"instanceId\":\"634b25418a039\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b25418a101\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9d1:de9c\",\"instanceId\":\"634b25418a101\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b25418a165\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9c9:f642\",\"instanceId\":\"634b25418a165\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b25418a22d\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:97e:fc58\",\"instanceId\":\"634b25418a22d\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b25418a2f5\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9a0:d004\",\"instanceId\":\"634b25418a2f5\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b25418a359\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9b3:6e20\",\"instanceId\":\"634b25418a359\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b25418a421\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:9a1:f00\",\"instanceId\":\"634b25418a421\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b25418a485\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:91e:74bd\",\"instanceId\":\"634b25418a485\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b25418a54d\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:342a:f5e4\",\"instanceId\":\"634b25418a54d\",\"objectTypeIds\":\"HOST\",\"service\":[]},{\"objectTypeText\":\"主机管理 / 主机\",\"ci_code\":\"634b25418a5b1\",\"bk_obj_id\":\"HOST\",\"bk_host_innerip\":\"fc00:305:200:500a:b:0:3426:6204\",\"instanceId\":\"634b25418a5b1\",\"objectTypeIds\":\"HOST\",\"service\":[]}]",
        "createTime": "2025-09-21 21:04:15",
        "creatorId": "liuxi@csg.cn",
        "creatorName": "刘溪",
        "dept": 189414,
        "deptId": "2133-0002",
        "deptName": "运行调度分部",
        "draft": 0,
        "effectApp": 0,
        "endTime": "2025-09-28 23:59:00",
        "flowUnitCode": "00",
        "flowUnitId": 2,
        "fortressAccounts": "wx_sunlx@csg.cn,wx_liangjz@csg.cn,liuxi@csg.cn",
        "gapTimesList": [],
        "guardian": "",
        "guardianId": "",
        "haltDuration": "0",
        "heavyLevel": 1,
        "heavyName": "",
        "huserId": "liuxi@csg.cn",
        "huserName": "刘溪",
        "id": 61787,
        "idate": 20250921,
        "imRunChange": {
            "changeBack": "",
            "changeFront": "",
            "changeTypeId": "",
            "changeTypeName": "",
            "createTime": "2025-09-22 11:08:14",
            "creatorId": "liuxi@csg.cn",
            "creatorName": "刘溪",
            "functionId": "",
            "functionName": "",
            "id": 6093,
            "oid": "CMWT-00-20250921-00014-eumqd",
            "runStatusId": "",
            "runStatusName": "",
            "status": 1
        },
        "imWorkPlanList": [],
        "implementArriveTime": "2025-09-22 12:09:50",
        "implementUnit": "南方电网数字电网集团有限公司\\运调中心",
        "implementUnitCode": "2133",
        "implementUnitId": "189412",
        "influenceUnits": "189412",
        "influenceUnitsName": "南方电网数字电网集团有限公司\\运调中心",
        "involveAdjust": 0,
        "involveAdjustMessage": 0,
        "involveBasicsApp": 0,
        "involveDefineChange": 0,
        "involveSynergy": 1,
        "involveSystem": 0,
        "isAdjust": 0,
        "isChangeRunModel": "不涉及",
        "isCompliance": 1,
        "isFloodPeriod": 0,
        "isHalt": 0,
        "isSatisfyWork": 1,
        "isServe": 0,
        "isWorkGplot": 0,
        "kernelModule": 0,
        "memo": "",
        "metadataChange": 2,
        "metadataMessage": "[]",
        "networkenv": 2,
        "noHaltServe": 0,
        "noHaltServeDuration": "0",
        "objectType": "1,2,4",
        "oid": "CMWT-00-20250921-00014-eumqd",
        "operationContent": "2025年9月22日-2025年9月28日：每天10：00-23：59\n实施步骤：\n1、TSF部署作业\n2、新系统各模块功能依据测试情况进行部署和调试实施步骤：",
        "operationDuration": 0,
        "operationPlansAppList": [],
        "operationPlansItemList": [
            {
                "appName": "网络安全运行调度控制系统",
                "ciCode": "62ac8031228ed",
                "ciName": "网络安全运行调度控制系统",
                "ciType": "BUSINESS",
                "configItems": "[{\"ci_code\":\"62ac8031228ed\",\"ci_name\":\"网络安全运行调度控制系统\",\"bk_obj_id\":\"BUSINESS\",\"instanceId\":\"62ac8031228ed\",\"biz_manage_4a\":\"liuxi@csg.cn\",\"objectTypeIds\":\"BUSINESS\",\"objectTypeText\":\"应用系统 / 应用系统\"}]",
                "createTime": "2025-09-22 11:08:14",
                "creatorId": "liuxi@csg.cn",
                "creatorName": "刘溪",
                "elapsedTime": "",
                "endTime": "2025-09-28 23:59:00",
                "equipmentId": "liuxi@csg.cn",
                "equipmentName": "刘溪",
                "id": 16905094,
                "influenceCount": 0,
                "oid": "CMWT-00-20250921-00014-eumqd",
                "startTime": "2025-09-22 10:00:00",
                "status": 1,
                "updatePlan": "",
                "versionNumber": 1,
                "workUserId": "liuxi@csg.cn",
                "workUserName": "刘溪"
            }
        ],
        "operationTicketsList": [
            {
                "createTime": "2025-09-22 11:08:14",
                "creatorId": "liuxi@csg.cn",
                "creatorName": "刘溪",
                "id": 112434,
                "notes": "",
                "oid": "CMWT-00-20250921-00014-eumqd",
                "operationEndTime": "2025-09-28 23:59:00",
                "operationItem": "步骤一  环境准备：ping命令服务器连接测试\n#服务器资源状态：\nuptime && top -bn1 | grep \"Cpu(s)\"\n服务端口检查\nnc -zv\n关键服务进程检查:ps aux | grep -E \"nginx|java\"\n检查是服务资源是否正常。\n步骤二  服务器巡检：巡检服务器资源使用情况，包括cpu使用率uptime，内存使用率free -h，df -Th磁盘空间、网络流量等。\n步骤三  实施部署：\n1、上传需要发布的应用包，登录服务器，将应用包打包成镜像，推送至TSF;\n登录TSF微服务平台，进行应用发布，发布后进行测试或者回滚。\n2、对需要部署的中间件（nginx），登录服务器，整改相关配置nginx，数据备份工作\n3、开始部署各应用模块功能、调试功能使用情况。\n本次所有作业完成后现场留守观察。\nwatch -n 2 'uptime && free -h && df -h'  # 每2秒刷新系统负载、内存、磁盘\nwatch -n 2 'ps aux | grep -E \"nginx|java\"'  # 监控指定服务进程\nwhile true; do ping -c 1 192.168.1.* && date; sleep 5; done  # 每5秒Ping一次并记录时间\n监听服务端口状态",
                "operationStartTime": "2025-09-22 10:00:00",
                "operationUser": "孙林鑫,张文河,梁锦钊",
                "operationUserId": "15919978430,wx_zhangwh1@csg.cn,wx_liangjz@csg.cn",
                "status": 1
            }
        ],
        "operationType": 2,
        "operatorCount": 0,
        "otherMatters": "1、新系统-应用系统生产部署\n（1）提前准备好部署相关代码和部署包工具\n（2）严格按照实施步骤进行，相关应用部署包、中间件等安装调试部署。\n（3）作业前必须做详细的作业实施步骤、风险评估及回退应急措施，对涉及设备重启的作业需提前准备备品备件，以防设备宕机无法启动。",
        "otherOid": "",
        "permissionUserArriveTime": "2025-09-22 11:08:33",
        "permissionUserTime": "2025-09-22 12:09:50",
        "pid": 14334391,
        "planSrc": 1,
        "planType": 3,
        "preAuthorizeTasks": 0,
        "replenishTicket": 0,
        "reserveLink": "implement",
        "riskAssessObj": {
            "appraiseAdjust": "",
            "appraiseRiskLevel": 2,
            "appraiseWorkRiskSum": 85.0,
            "bRisk1": 1,
            "bRisk2": 1,
            "bRisk3": 1,
            "bRisk4": 1,
            "bRisk5": 1,
            "bRisk6": 3,
            "bScore1": 0.0,
            "bScore2": 0.0,
            "bScore3": 0.0,
            "bScore4": 0.0,
            "bScore5": 0.0,
            "bScore6": 5.0,
            "cRisk11": 2,
            "cRisk12": 1,
            "cRisk21": 1,
            "cRisk22": 1,
            "cRisk3": 1,
            "cRisk41": 1,
            "cRisk42": 1,
            "cRisk5": 4,
            "cRisk6": 1,
            "cScore11": 30.0,
            "cScore12": 0.0,
            "cScore21": 0.0,
            "cScore22": 0.0,
            "cScore3": 0.0,
            "cScore41": 0.0,
            "cScore42": 0.0,
            "cScore5": 20.0,
            "cScore6": 0.0,
            "createTime": "2025-09-22 11:08:14",
            "creatorId": "liuxi@csg.cn",
            "creatorName": "刘溪",
            "id": 128195,
            "oid": "CMWT-00-20250921-00014-eumqd",
            "status": 1,
            "typeBasicRisks": "[{\"applyUnit\":\"2\",\"applyUnitId\":\"00\",\"applyUnitName\":\"南网总部\",\"content\":\"应用系统部署\",\"controlMeasure\":\"（1）作业前必须做详细的作业实施步骤、风险评估及回退应急措施。\\r\\n（2）检查配置并修复配置参数，重新启动相应服务。\",\"id\":22,\"preAuthorizeTasks\":0,\"riskDescription\":\"（1）应用系统服务安装部署失败，业务无法访问。\\r\\n（2）应用系统高可用服务（集群或多节点）部署失败，导致业务单点运行。\",\"riskE\":4,\"riskP\":3,\"riskS\":18,\"score\":30,\"status\":0,\"type\":\"安装部署\",\"typeId\":5,\"unit\":2,\"unitId\":\"00\",\"unitName\":\"南网总部\",\"_checked\":false}]",
            "versionNumber": 1
        },
        "riskLevel": 2,
        "riskLevelSum": 85.0,
        "runChange": 0,
        "safetyChange": 0,
        "serveDuration": "0",
        "signerUser": "佘文生",
        "signerUserId": "shews@csg.cn",
        "startTime": "2025-09-22 10:00:00",
        "status": 31,
        "taskId": 45696984,
        "taskLink": 4,
        "taskName": "工作实施",
        "testVerify": 0,
        "ticketOid": "",
        "tid": 21,
        "timeList": "",
        "title": "9月第四周-调度指挥系统V1.0生产部署",
        "unit": 189412,
        "unitId": "2133",
        "unitName": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
        "userKind": 1,
        "versionTag": 1,
        "wfid": 20185,
        "workAppNames": "",
        "workChangeList": [],
        "workCondition": "1、作业人员具备作业资质\n2、监护人现场监护\n3、向值长申请作业许可",
        "workDeptId": "189414",
        "workDeptName": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
        "workEndTime": "2025-09-28 23:59:00",
        "workLeader": "刘溪",
        "workLeaderId": "liuxi@csg.cn",
        "workMember": "孙林鑫,张文河,梁锦钊",
        "workMemberId": "15919978430,wx_liangjz@csg.cn,wx_zhangwh1@csg.cn",
        "workNotice": "",
        "workPlace": "总部基地一号楼202",
        "workPlanOid": "TPM-00-20250918-00577-kZ3sb",
        "workStartTime": "2025-09-22 10:00:00",
        "workTaskId": "",
        "workTypeId": "5",
        "workTypeName": "安装部署"
    }
// 查询信息两票详情
async function query() {
  try {
    // if (!oid.value) return
    // const res = await getworkPlanTaskDetailApi({
    //   data: { oid: oid.value }
    // })
    data.value = res
    if (!data.value.riskAssessObj.typeBasicRisks) {
      data.value.riskAssessObj.typeBasicRisks = []
    } else {
      data.value.riskAssessObj.typeBasicRisks = JSON.parse(data.value.riskAssessObj.typeBasicRisks)
    }

    data.value.attach = JSON.parse(data.value.attach)
    if (data.value.attach['1']) {
      attachList.value = data.value.attach['1']
    }
    // 拼接风险值
    riskVal.value = '计算:' + getLabelByValue('riskLevel', data.value?.riskLevel) + `(${data.value?.riskLevelSum || 0})`

    // 计算作业类型基准风险值
    riskBaseB.value = (data?.value?.riskAssessObj?.bScore1 || 0) + (data?.value?.riskAssessObj?.bScore2 || 0) + (data?.value?.riskAssessObj?.bScore3 || 0) + (data?.value?.riskAssessObj?.bScore4 || 0) + (data?.value?.riskAssessObj?.bScore5 || 0) + (data?.value?.riskAssessObj?.bScore6 || 0)

    riskBaseC.value = (data?.value?.riskAssessObj?.cScore11 || 0) + (data?.value?.riskAssessObj?.cScore12 || 0) + (data?.value?.riskAssessObj?.cScore21 || 0) + (data?.value?.riskAssessObj?.cScore22 || 0) + (data?.value?.riskAssessObj?.cScore3 || 0) + (data?.value?.riskAssessObj?.cScore41 || 0) + (data?.value?.riskAssessObj?.cScore42 || 0) + (data?.value?.riskAssessObj?.cScore5 || 0) + (data?.value?.riskAssessObj?.cScore6 || 0)
    riskBaseA.value = (data?.value?.riskAssessObj?.appraiseWorkRiskSum || 0) - riskBaseB.value - riskBaseC.value
    autoHandler.value = JSON.parse(data?.value?.autoHandler)

    const objectTypes = AllDicts.value['objectType']
    objType.value = getObjectTypeLabels(data?.value?.objectType, objectTypes)
    if(!data.value.isFloodPeriod) data.value.isFloodPeriod = 0
    if (data.value.isWindowsHost != null && data.value.isWindowsHost !== '') {
      showWindowsHost.value = true
    }
    emit('sendPid', { pid: data.value?.pid, wid: data.value?.workPlanOid })
    await getFlowDetail()
    await getydTaskRecods()
  } catch (err) {}
}

// 获取作业台账清单
async function getydTaskRecods() {
  try {
    const res = await getydTaskRecodsApi({
      data: {
        oid: oid.value
      }
    })
    itemApp.value = res
  } catch (error) {}
}

// 获取作业对象类型
function getObjectTypeLabels(objectType, options) {
  if (!objectType || !options?.length) return ''

  return String(objectType)
    .split(',')
    .map((val) => {
      const item = options.find((opt) => opt.value === parseInt(val.trim()))
      return item?.label || ''
    })
    .filter(Boolean)
    .join('，')
}

// 查询流程信息   详情附件总和 =  详情页附件 + 流程接口返回中的附件
async function getFlowDetail() {
  try {
    attachMergeList.value = attachList.value
    const res = await getydTodoTasksApi({
      data: {
        paramList: [
          {
            key: 'oid',
            type: 'eq',
            value: oid.value
          },
          {
            key: 'status',
            type: 'in',
            value: '3,7'
          }
        ],
        orderList: [
          {
            key: 'closetime',
            order: 'asc'
          }
        ],
        paramMap: {
          keywork: ''
        }
      }
    })
    flowData.value = res.data.data

    flowData.value.forEach((item) => {
      if (item.extinfoJson.attach && item.extinfoJson.attach['1']) {
        attachMergeList.value = [...new Set([...attachMergeList.value, ...item.extinfoJson.attach['1']])]
      }
    })
  } catch (error) {}
}

// 下载附件
async function downloadAttach(name: string, fileId: string, iDate: string, oid: string) {
  try {
    console.log('sss1')
    await downloadFile(import.meta.env.VITE_NSOSFS + `/ydCommon/downloadFile`, { fileId: fileId, idate: iDate, oid: oid,bkUsername: data.value.creatorId }, name, 'post')
  } catch {}
}

// 判断是否延期
function isDelayed(planStartTime, planEndTime, actualStartTime, actualEndTime) {
  if (!planStartTime || !planEndTime || !actualStartTime || !actualEndTime) return false
  // 将时间统一转换为Date对象
  const planStart = new Date(planStartTime)
  const planEnd = new Date(planEndTime)
  const actualStart = new Date(actualStartTime)
  const actualEnd = new Date(actualEndTime)

  // 检查实际开始时间是否晚于计划开始时间
  const isStartDelayed = actualStart > planStart

  // 检查实际结束时间是否晚于计划结束时间
  const isEndDelayed = actualEnd > planEnd

  // 只要有一个延期就返回true
  return isStartDelayed || isEndDelayed
}

/**
 * 获取所有字典键值对
 * @returns {Object} 以key为键的字典对象
 */
function getAllDicts() {
  return dictMap.reduce((acc, cur) => {
    if (cur.dictMap) {
      acc[cur.key] = cur.dictMap
    }
    return acc
  }, {})
}

/**
 * 根据key获取字典项
 * @param {string} key 字典key
 * @returns {Array} 字典项数组
 */
function getDictByKey(key) {
  const item = dictMap.find((d) => d.key === key)
  return item?.dictMap || []
}

/**
 * 根据key和value获取label
 * @param {string} key 字典key
 * @param {*} value 要查找的值
 * @returns {string} 对应的label
 */
function getLabelByValue(key, value) {
  const dict = getDictByKey(key)
  const item = dict.find((d) => d.value === value)
  return item?.label || ''
}

// 打开作业系统台账清单
function openJobLedgerList() {
  dialogVisible.jobLedgerList = true
}

// 打开作业清单详情
const currentLedger = ref('')
function openJobLedgerDetail(row) {
  dialogVisible.jobLedgerDetail = true
  currentLedger.value = row
}

// 打开作业系统弹窗
const currentSysInfo = ref('')
function openJobSysList(config: any) {
  dialogVisible.jobSysList = true
  currentSysInfo.value = config
}

// 打开操作票弹窗
const currentOperatingTicket = ref({})
function openOperatingTicket(row) {
  dialogVisible.operatingTicket = true
  currentOperatingTicket.value = row
}



// 转换附件的大小
function formatFileSize(size) {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return Math.round(size / 1024) + ' KB'
  return Math.round(size / (1024 * 1024)) + ' MB'
}

// 解析字符串
function safeParseAttachInfo(jsonString) {
  if (!jsonString) return []

  try {
    const parsed = JSON.parse(jsonString)
    if (!Array.isArray(parsed)) {
      console.warn('附件信息不是数组格式:', jsonString)
      return []
    }
    return parsed
  } catch (e) {
    console.error('解析附件信息失败:', {
      error: e,
      jsonString: jsonString
    })
    return []
  }
}
</script>
<style scoped lang="less">

.high-light :deep(.el-input__inner) {
  color: red !important;
  -webkit-text-fill-color: red !important;
}

.delay-icon {
  margin-left: 20px;
  background-color: #ffd0d0;
  color: red;
  width: 50px;
  text-align: center;
  height: 25px;
  line-height: 25px;
}
.main-card {
  :deep(.el-card__body) {
    padding-top: 0;
  }
}
:deep(.el-form-item__label) {
  align-items: center; /* 修改为居中 */
  box-sizing: border-box;
  color: var(--el-text-color-regular);
  display: inline-flex;
  flex: 0 0 auto;
  font-size: var(--el-form-label-font-size);
  height: auto; /* 改为自动高度以适应多行 */
  justify-content: flex-end;
  line-height: 1.2; /* 设置行间距为1 */
  padding: 0 12px 0 0;
  white-space: normal; /* 允许换行 */
  word-break: break-word; /* 单词换行 */
  min-height: 32px; /* 最小高度保持32px */
  text-align: right;
}
.title-box {
  padding: 20px;
  height: 20px;
  width: 100%;
  background-color: #f4f4f5;
}
.title-icon {
  width: 4px;
  background-color: rgb(169, 162, 162);
  height: 20px;
  margin-right: 5px;
}

.file-name {
  flex: 1;
  min-width: 0; /* 关键：允许内容收缩 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-name:hover {
  color: var(--el-color-primary);
}
.file-name1 {
  flex: 1;
  min-width: 0; /* 关键：允许内容收缩 */
}

.file-list:hover {
  color: var(--el-color-primary);
  cursor: pointer;
}
.file-list {
  width: calc(100% - 150px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block; /* 确保块级元素特性 */
  background-color: #f6f6f8;
  height: 25px;
  padding: 5px;
  margin-bottom: 5px;
}
.dialog-title {
  width: 150px;
  text-align: right;
  padding-right: 15px;
}
.box1 {
  border: 1px solid #eeeeee;
  height: 40px;
  line-height: 40px;
  font-weight: 500;
  padding: 0 20px;
  background-color: #fafafa;
}
.box2 {
  border: 1px solid #eeeeee;
  padding: 0 20px;
  height: auto;
  background-color: #fafafa;
  display: flex;
  align-items: center;
}
.box3 {
  border: 1px solid #eeeeee;
  padding: 0 20px;
  height: auto;
  height: 40px;
  background-color: #fafafa;
  display: flex;
  align-items: center;
}
.download-icon {
  margin-left: 10px;
  vertical-align: middle;
  color: #606266; /* 默认灰色 */
  transition: color 0.3s ease; /* 添加过渡效果 */
}

.download-icon:hover {
  color: #409eff; /* Element Plus 的蓝色 */
  cursor: pointer; /* 鼠标悬停时显示手型指针 */
}
</style>
