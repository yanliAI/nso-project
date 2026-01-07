<template>
  <div style="width:100%; height: 100%" class="bg-white">
    <div>
      <el-card shadow="never" style="margin-bottom: 20px">
        <el-form ref="formRef" :inline="true" label-position="right" label-width="200px" :model="data">
          <!-- 基础信息 -->
          <div class="primary flex items-center title-box" style="margin-bottom: 20px">
            <div class="title-icon"></div>
            <div class="ml-1 font-bold">基础信息</div>
          </div>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="工单号:" required style="width: 100%">
                <el-input v-model="data.oid" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="作业计划标题:" required style="width: 100%">
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
          <!-- <el-row :gutter="80">
            <el-col :span="8">
              <el-form-item label="是否重保:" style="width: 100%">
                <el-select v-model="data.isFloodPeriod" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['isFloodPeriod']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="重保名称:" style="width: 100%">
                <el-input v-model="heavyName" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工作票类型:" style="width: 100%">
                <el-select v-model="data.operationType" :disabled="true">
                  <el-option v-for="item in AllDicts['operationType']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row> -->
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
                <el-switch v-model="data.runChange" inline-prompt active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否"  disabled />
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
              <el-form-item label="工作要求的安全措施:" style="width: 100%" required>
                <el-input v-model="data.otherMatters" type="textarea" :rows="4" :disabled="true"> </el-input>
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
              <el-form-item label="影响单位:" style="width: 100%" required>
                <el-input v-model="data.influenceUnitsName" :disabled="true"> </el-input>
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
            <el-col :span="8">
              <el-form-item label="是否需要使用Windows跳板机:" style="width: 100%" required>
                <el-select v-model="data.isWindowsHost" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['isWindowsHost']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="80">
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
              <el-form-item label="工作条件:" style="width: 100%" required>
                <el-input v-model="data.workCondition" type="textarea" :rows="4" :disabled="true"> </el-input>
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
          </el-row> -->
          <el-row>
            <span style="color: red; margin: 20px 100px">请点击“风险评估”按钮维护作业基准风险、作业人员、作业系统、作业对象、作业时段、影响范围等作业风险相关信息。</span>
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="作业风险:" style="width: 100%" required>
                <div style="display: flex; align-items: center">
                  <el-button type="primary" style="margin-right: 10px" @click="dialogVisible.riskInfo = true"> 风险评估 </el-button>
                  <el-input v-model="riskVal" :disabled="true" style="width: 880px"> </el-input>
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
          </el-row>
          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="作业对象类型:" style="width: 100%">
                <el-input :disabled="true" v-model="objType"> </el-input>
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
                <el-input   v-model="data.guardian" :disabled="true" />
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
                  <el-table-column label="对象类型" prop="objectTypeName"  align="center" show-overflow-tooltip />
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
          <div style="padding-left: 100px">
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
          </div>

          <!-- 填报材料 -->
          <!-- <div class="primary flex items-center title-box" style="margin: 20px 0">
            <div class="title-icon"></div>
            <div class="ml-1 font-bold">填报材料</div>
          </div>

          <el-row :gutter="20" style="padding: 0 20px 0 100px; color: 14px; line-height: 1.5">
            <el-col v-for="(file, index) in AttachmentTitleName" :key="file.id" :span="12" style="margin-bottom: 20px; font-size: 14px; display: flex; align-items: center; justify-content: space-between">
              <div style="width: 150px; text-align: right; padding-right: 15px">{{ file.label }}</div>
              <div  class="file-name1" style="max-height: 150px; overflow-y: auto;" >
                <div v-if="data[file.key]" v-for="(file, index) in JSON.parse(data[file.key])" >
                  <div class="file-list" :title="file.name"><el-icon color="grey" style="margin-right: 10px"><Document /></el-icon>{{file.name}}</div>
                </div>
                <div v-else style="color: #a6aebe">暂无附件</div>
              </div>
            </el-col>
          </el-row> -->

          <!-- 信息操作票 -->
          <div class="primary flex items-center title-box" style="margin: 20px 0">
            <div class="title-icon"></div>
            <div class="ml-1 font-bold">基准风险管控措施</div>
          </div>
          <!-- <el-row :gutter="80">
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
          </el-row> -->
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
                <div class="file-name" :title="file.name" style="background-color: #f6f6f8; height: 45px; padding-left: 20px; cursor: pointer;" @click="downloadAttach(file.name, file.fileId, JSON.stringify(file.iDate),data.oid)">
                  <el-icon color="grey" style="margin-right: 10px"><Document /></el-icon>{{ file.name }}
                </div>
                <div style="width: 100px; background-color: #f6f6f8; height: 45px">
                  {{ formatFileSize(file.size) }}<el-icon color="grey" class="download-icon" @click="downloadAttach(file.name, file.fileId, JSON.stringify(file.iDate),data.oid)"><Download /></el-icon>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-card>
      <!-- v-if="taskId && sourceType === '2'"   -->
    </div>
    <!-- 作业台账清单 -->
    <el-dialog v-model="dialogVisible.jobLedgerList" title="作业台账清单" width="80%">
      <el-table border stripe ref="tableRef" :data="JSON.parse(data.configItems)" max-height="600">
        <el-table-column label="操作" align="center" width="120" fixed>
          <template #default="{ row, $index }">
            <el-button size="small" type="primary" @click="openJobLedgerDetail(row)"> 查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="所属信息系统名称" prop="" align="center" show-overflow-tooltip />
        <el-table-column label="实例ID" prop="ci_code" align="center" show-overflow-tooltip />
        <el-table-column label="配置项名称" prop="ci_name" align="center" show-overflow-tooltip />
        <el-table-column label="IP" align="center" show-overflow-tooltip>
          <template #default="{ row, $index }">
            <span v-if="row.app_address_ip">{{ row.app_address_ip }}</span>
            <span v-else>{{ row.bk_host_innerip }}</span>
          </template>
        </el-table-column>

        <el-table-column label="业务负责人" prop="" align="center" />
        <el-table-column label="业务负责人数认账号" prop="biz_manage_4a" align="center" />
        <el-table-column label="设备主人" prop="" align="center" />
        <el-table-column label="设备主人数认账号" prop="" align="center" />
        <el-table-column label="影响用户数" prop="" align="center" />
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
            <el-input v-model="currentLedger.ci_name" disabled></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">配置项类型:</div>
            <el-input v-model="currentLedger.objectTypeIds" disabled></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">所属的信息系统名称:</div>
            <el-input disabled></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">IP:</div>
            <el-input v-if="currentLedger.app_address_ip" v-model="currentLedger.app_address_ip" disabled></el-input>
            <el-input v-else v-model="currentLedger.bk_host_innerip" disabled></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 20px 0">
        <el-col :span="12">
          <div class="flex items-center">
            <div class="dialog-title">业务负责人:</div>
            <el-input v-model="currentLedger.biz_manage_4a" disabled></el-input>
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
import { getWorkPlanDetailApi, getydTodoTasksApi } from '#/api'
import { useRoute, useRouter } from 'vue-router'
import calculateServiceDowntime from './calDurations.js'
const router = useRouter()
const workPlanOid = defineModel('workPlanOid')
const oid = defineModel('oid')
const dialogVisible = reactive({
  jobLedgerList: false, // 作业台账清单
  jobSysList: false, // 作业系统
  operatingTicket: false, // 作业安排 操作票
  jobLedgerDetail: false, // // 作业台账清单-详情
  riskInfo: false // 风险评估信息详情
})

const objType = ref('')  // 作业对象类型
const attachList = ref([]) // 信息两票工单详情信息中的附件
const attachMergeList = ref([]) // 信息两票工单详情信息中的附件 与 工单流程信息中的附件
const data = ref({}) // 作业工单详情信息
const flowData = ref('') // 工单流程信息
const activeName = ref('first')
const riskVal = ref('') // 拼接风险等级和得分
const AllDicts = ref({}) // 获取字典值
const tableData = ref([]) // 作业饱和度
const riskBaseA = ref(0) // 作业类型基准风险值A
const riskBaseB = ref(0) // 作业类型基准风险值B
const riskBaseC = ref(0) // 作业类型基准风险值C

const autoHandler = ref({})
AllDicts.value = getAllDicts()
onMounted(() => { 
  if(workPlanOid.value){
    queryPlan()
  }
})

watch(workPlanOid, (newVal) => {
  queryPlan()
});


// 查询信息两票详情
async function queryPlan() {
  try {
    if(!workPlanOid.value) return
    const res = await getWorkPlanDetailApi({
      data: { oid: workPlanOid.value }
    })
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
    objType.value = getObjectTypeLabels(data?.value?.objectType,objectTypes)
    await getFlowDetail()
  } catch (err) {}
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
            value: workPlanOid.value
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

// 获取作业对象类型
function getObjectTypeLabels(objectType, options) {
  if (!objectType || !options?.length) return '';
  
  return String(objectType)
    .split(',')
    .map(val => {
      const item = options.find(opt => opt.value === parseInt(val.trim()));
      return item?.label || '';
    })
    .filter(Boolean)
    .join('，');
}


// 下载附件
async function downloadAttach(name: string, fileId: string, iDate: string, oid: string) {
  try {
    await downloadFile(import.meta.env.VITE_NSOSFS + `/ydCommon/downloadFile`, { fileId: fileId, idate: iDate , oid: oid, bkUsername: data.value.creatorId}, name, 'post')
  } catch {}
}

// 判断是否延期
function isDelayed(planStartTime, planEndTime, actualStartTime, actualEndTime) {
  if(!planStartTime || !planEndTime || !actualStartTime || !actualEndTime) return false
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
  if (data.value.configItems) {
    dialogVisible.jobLedgerList = true
  } else {
    ElMessage.warning('无台账数据!')
  }
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


</script>
<style scoped>

.delay-icon{
  margin-left: 20px; 
  background-color: #FFD0D0; 
  color: red; 
  width:50px;
  text-align: center;
  height:25px;
  line-height: 25px;
}

.main-card{
  :deep(.el-card__body){
    padding-top:0
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
}
.file-list{
  width: calc(100% - 50px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block; /* 确保块级元素特性 */
  background-color: #F6F6F8;
  height:25px;
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
