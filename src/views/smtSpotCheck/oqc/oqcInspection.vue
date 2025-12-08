<template>
    <div class="p-2">
        <el-card :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="getForm" :inline="true" label-width="auto" size="small">
                <el-form-item :label="$t('oqcInspection.OQCNumber')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.OQCNumber" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.workerOrder')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.MfgOrderName" placeholder="" clearable></el-input>
                </el-form-item>

                <el-form-item :label="$t('oqcInspection.creatTime')" class="mb-2"><el-date-picker :shortcuts="shortcuts"
                        v-model="searchDate" value-format="YYYY-MM-DD" type="daterange" range-separator="-" size="small"
                        style="width: 200px" :clearable="false" :disabled-date="disabledDate" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.inspectionStatus')" class="mb-2">
                    <el-select v-model="getForm.InspectionStatus" placeholder="" style="width: 180px">
                        <el-option :label="t('oqcInspection.status1')" :value="0">
                        </el-option>
                        <el-option :label="t('oqcInspection.status2')" :value="1">
                        </el-option>
                        <el-option :label="t('oqcInspection.status3')" :value="2">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('oqcInspection.productCategory')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.ProductType" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.productName')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.ProductName" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerName')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.ToCustomerName" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerPO')" class="mb-2">
                    <el-input style="width: 200px" v-model="getForm.PartNo" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerPN')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.CustomerPN" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.LOtNO')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.LotNo" placeholder="" clearable></el-input>
                </el-form-item>

                <el-form-item class="mb-2">
                    <el-button type="primary" size="small" @click="getData">
                        {{ $t("publicText.query") }}
                    </el-button>
                    <el-button type="info" size="small">
                        {{ $t("publicText.reset") }}
                    </el-button>
                    <el-button type="warning" size="small" @click="openAdd">
                        {{ $t("publicText.add") }}
                    </el-button>
                    <el-button type="success" size="small" @click="testClick">
                        导出Excel
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " size="small" :style="{ width: '100%' }" ref="rawRef" :height="tableHeight" border fit
                highlight-current-row>
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="OQCNumber" :label="$t('oqcInspection.OQCNumber')" width="200">
                </el-table-column>
                <el-table-column prop="MfgOrder" :label="$t('oqcInspection.workerOrder')" />
                <el-table-column prop="Customer" :label="$t('oqcInspection.customerName')" />
                <el-table-column prop="ProductName" :label="$t('oqcInspection.productName')" width="130" />
                <el-table-column prop="ProductType" :label="$t('oqcInspection.productCategory')" />
                <el-table-column prop="CustomerPO" :label="$t('oqcInspection.customerPO')" width="130" />
                <el-table-column prop="CustomerPN" :label="$t('oqcInspection.customerPN')" width="130" />
                <el-table-column prop="LotNo" :label="$t('oqcInspection.LOtNO')" />
                <el-table-column prop="InspectionStatus" :label="$t('oqcInspection.inspectionStatus')" />
                <el-table-column prop="ApprovalStatus" :label="$t('oqcInspection.ApprovalStatus')" />
                <el-table-column prop="Date" :label="$t('oqcInspection.Date')" width="100" />
                <el-table-column prop="ShippingQty" :label="$t('oqcInspection.ShippingQty')" width="100" />
                <el-table-column prop="QtyShiped" :label="$t('oqcInspection.QtyShiped')" width="100" />
                <el-table-column prop="TotalEvaluation" :label="$t('oqcInspection.TotalEvaluation')" />
                <el-table-column prop="SpecificationNo" :label="$t('oqcInspection.SpecificationNo')" />
                <el-table-column prop="OrderTypeName" :label="$t('oqcInspection.OrderTypeName')" width="100" />
                <el-table-column prop="CreateUser" :label="$t('oqcInspection.CreateUser')" />
                <el-table-column prop="CreateTime" :label="$t('oqcInspection.CreateTime')" width="150" />
                <el-table-column prop="UpdateUser" :label="$t('oqcInspection.UpdateUser')" />
                <el-table-column prop="UpdateTime" :label="$t('oqcInspection.UpdateTime')" width="150" />
                <el-table-column :label="$t('publicText.operation')" width="120" fixed="right" align="center">
                    <template #default="scope">
                        <el-tooltip :content="$t('publicText.check')" placement="top">
                            <el-button type="primary" icon="EditPen" size="small"
                                @click.stop="handleEdit(scope.row)"></el-button>
                        </el-tooltip>
                        <!-- <el-tooltip :content="$t('publicText.look')" placement="top">
                            <el-button type="primary" icon="Reading" size="small"
                                @click.stop="handleEdit(scope.row)"></el-button>
                        </el-tooltip> -->
                    </template>
                </el-table-column>

                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="tableData.length">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog v-model="addVisible" align-center title="新增OQC" width="500px" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" @close="handleAddClose">
            <el-form ref="addFormRef" :model="addForm" label-width="auto" :size="'small'">
                <el-form-item :label="$t('oqcInspection.workerOrder')" prop="MfgOrderName">
                    <el-input v-model="addForm.MfgOrderName" placeholder="" style="width: 200px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.OrderQt')" prop="OrderQty">
                    <el-input v-model="addForm.OrderQty" placeholder="" style="width: 200px" type="number" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.ShippingQty')" prop="ShippingQty">
                    <el-input v-model="addForm.ShippingQty" placeholder="" style="width: 200px" type="number" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerPO')" prop="PartNo">
                    <el-input v-model="addForm.PartNo" placeholder="" style="width: 200px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.LOtNO')" prop="LotNo">
                    <el-input v-model="addForm.LotNo" placeholder="" style="width: 200px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.TotalEvaluation')" prop="TotalEvaluation">
                    <el-input v-model="addForm.TotalEvaluation" placeholder="" style="width: 200px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.productName')" prop="ProductName">
                    <el-input v-model="addForm.ProductName" placeholder="" style="width: 200px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.productCategory')" prop="ProductType">
                    <el-input v-model="addForm.ProductType" placeholder="" style="width: 200px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerName')" prop="ToCustomerName">
                    <el-input v-model="addForm.ToCustomerName" placeholder="" style="width: 200px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerPN')" prop="CustomerPN">
                    <el-input v-model="addForm.CustomerPN" placeholder="" style="width: 200px" />
                </el-form-item>
                <!-- <el-form-item :label="$t('oqcInspection.Date')" prop="Date">
                     <el-input v-model="addForm.Date" placeholder="" style="width: 200px"  />
                </el-form-item> -->
            </el-form>
            <template #footer>
                <el-button @click="handleAddClose">{{
                    $t("publicText.close")
                }}</el-button>
                <el-button @click="handleAddConfirm" type="primary">{{
                    $t("publicText.confirm")
                }}</el-button>
            </template>
        </el-dialog>

        <el-dialog v-model="inspectVisible" :title="'检验'" width="95%" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="handleInspectClose">
            <el-form ref="headerFormRef" :model="headerForm" label-width="auto" :inline="true" :size="'small'">
                <el-form-item :label="'OQC单号'" prop="OQCNumber">
                    <el-input v-model="headerForm.OQCNumber" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="'工单号'" prop="MfgOrderName">
                    <el-input v-model="headerForm.MfgOrderName" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="'产品名称'" prop="ProductName">
                    <el-input v-model="headerForm.ProductName" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="'产品名称'" prop="ProductName">
                    <el-input v-model="headerForm.ProductName" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="'客户名称'" prop="ToCustomerName">
                    <el-input v-model="headerForm.ToCustomerName" placeholder="" style="width: 200px"
                        :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerPN')" prop="PartNo">
                    <el-input v-model="headerForm.PartNo" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.LOtNO')" prop="LotNo">
                    <el-input v-model="headerForm.LotNo" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.materialSource')" prop="MaterialSource">
                    <el-input v-model="headerForm.MaterialSource" placeholder="" style="width: 200px"
                        :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.ShippingQty')" prop="QtyShiped">
                    <el-input v-model="headerForm.ShippingQty" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.QtyShiped')" prop="QtyShiped">
                    <el-input v-model="headerForm.QtyShiped" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.RemainingQty')" prop="RemainingQty">
                    <el-input v-model="headerForm.RemainingQty" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.OrderQty')" prop="OrderQty">
                    <el-input v-model="headerForm.OrderQty" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.TotalEvaluation')" prop="TotalEvaluation">
                    <el-input v-model="headerForm.TotalEvaluation" placeholder="" style="width: 200px"
                        :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Date')" prop="Date">
                    <el-input v-model="headerForm.Date" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
            </el-form>
            <el-form ref="headerFormRef" :model="testEqForm" label-width="auto" :inline="true" :size="'small'">
                <el-form-item :label="$t('oqcInspection.instrumentName')" prop="ResourceName">
                    <el-select v-model="testEqForm.ResourceName" placeholder="" style="width: 200px">
                        <el-option v-for="item in eqList" :key="item.instrumentName" :label="item.instrumentName"
                            :value="item.instrumentName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.instrumenStatus')" prop="Status">
                    <el-select v-model="testEqForm.Status" placeholder="" style="width: 200px">
                        <el-option label="Y" :value="0" />
                        <el-option label="N" :value="1" />
                    </el-select>
                </el-form-item>
            </el-form>
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane :label="'计数检验'" name="first">
                    <el-table :data="CountTable" border stripe style="width: 100%" size="small" :height="300">
                        <el-table-column prop="ProjectCategoryName" :label="$t('aqlrules.ProjectCategoryName')">
                        </el-table-column>
                        <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')">
                        </el-table-column>
                        <!-- <el-table-column prop="InspectionType" :label="$t('aqlrules.DBType')">
                        </el-table-column> -->
                        <el-table-column prop="CharacteristicGrade" :label="$t('aqlrules.CharaCteristicGrade')">
                        </el-table-column>
                        <el-table-column prop="InspectionToolName" :label="$t('aqlrules.ToolName')">
                        </el-table-column>
                        <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')">
                        </el-table-column>
                        <el-table-column prop="SampleSize" :label="$t('incomeSheet.numberOfSample')">
                            <template #default="scope">
                                <el-input v-model="scope.row.SampleSize" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectCount" :label="$t('incomeSheet.numberOfDefect')">
                            <template #default="scope">
                                <!-- {{ scope.row.DefectCount || calculateDefectCount(scope.row) }} -->
                                <el-input v-model="scope.row.DefectCount" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectDescription" :label="'缺陷描述'">
                            <template #default="scope">
                                <!-- {{ scope.row.DefectCount || calculateDefectCount(scope.row) }} -->
                                <el-input v-model="scope.row.DefectDescription" size="small"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="'计量检验'" name="second">
                    <el-table :data="MeasurTable" border stripe style="width: 100%" size="small" :height="300">
                        <el-table-column prop="ProjectCategoryName" :label="$t('aqlrules.ProjectCategoryName')">
                        </el-table-column>
                        <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')">
                        </el-table-column>
                        <!-- <el-table-column prop="InspectionType" :label="$t('aqlrules.DBType')">
                        </el-table-column> -->
                        <el-table-column prop="CharacteristicGrade" :label="$t('aqlrules.CharaCteristicGrade')">
                        </el-table-column>
                        <el-table-column prop="TargetValue" :label="$t('aqlrules.TargetValue')">
                        </el-table-column>

                        <el-table-column prop="MinValue" :label="$t('aqlrules.MinValue')">
                        </el-table-column>
                        <el-table-column prop="MaxValue" :label="$t('aqlrules.MaxValue')">
                        </el-table-column>
                        <el-table-column prop="InspectionToolName" :label="$t('aqlrules.ToolName')">
                        </el-table-column>
                        <el-table-column prop="uomname" :label="$t('aqlrules.uomname')">
                        </el-table-column>
                        <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')">
                        </el-table-column>
                        <el-table-column prop="SampleSize" :label="$t('incomeSheet.numberOfSample')">
                            <template #default="scope">
                                <el-input v-model="scope.row.SampleSize" size="small" type="number" min="1" max="10"
                                    @change="handleSampleSizeChange(scope.row)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectCount" :label="$t('incomeSheet.numberOfDefect')">
                            <template #default="scope">
                                {{ calculateDefectCount(scope.row) }}
                                <!-- <el-input v-model="scope.row.DefectCount" size="small" :disabled="scope.row.StatusText!==''"></el-input> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="MeasuredValue" :align="'center'"
                            :label="$t('incomeSheet.MeasurementNumber')">
                            <template #default="scope">
                                <span>{{ formatMeasuredValues(scope.row) }}</span>
                                <el-button type="primary" icon="Plus" :size="'small'"
                                    @click="openMeasurementDialog(scope.row, scope.$index)" />
                            </template>
                        </el-table-column>

                        <el-table-column prop="numberOfDefect" :label="'总和'">
                            <template #default="scope">
                                <span>{{ calculateSum(scope.row) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="numberOfDefect" :label="'平均数'">
                            <template #default="scope">
                                <span>{{ calculateAverage(scope.row) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="numberOfDefect" :label="'结果'">
                            <template #default="scope">
                                {{ getResultText(scope.row) }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <el-form class="mt-2" ref="DetailInfoFormRef" :model="DetailInfoForm" label-width="auto" :inline="true"
                :size="'small'">
                <el-form-item :label="$t('oqcInspection.SamplingPlan')" prop="SamplingPlan">
                    <el-input v-model="DetailInfoForm.SamplingPlan" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.TechnicalRequirements')" prop="TechnicalRequirements">
                    <el-input v-model="DetailInfoForm.TechnicalRequirements" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Severity')" prop="Severity">
                    <el-input v-model="DetailInfoForm.Severity" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.InspectionLevel')" prop="InspectionLevel">
                    <el-input v-model="DetailInfoForm.InspectionLevel" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.SampleSize')" prop="SampleSize">
                    <el-input v-model="DetailInfoForm.SampleSize" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.PinHole')" prop="PinHole">
                    <el-input v-model="DetailInfoForm.PinHole" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Dirt')" prop="Dirt">
                    <el-input v-model="DetailInfoForm.Dirt" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Flaw')" prop="Flaw">
                    <el-input v-model="DetailInfoForm.Flaw" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Result')" prop="Result">
                    <el-input v-model="DetailInfoForm.Result" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Reject')" prop="Reject">
                    <el-input v-model="DetailInfoForm.Reject" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.PinHoleDefectCount')" prop="PinHoleDefectCount">
                    <el-input v-model="DetailInfoForm.PinHoleDefectCount" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.DirtDefectCount')" prop="DirtDefectCount">
                    <el-input v-model="DetailInfoForm.DirtDefectCount" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.FlawDefectCount')" prop="FlawDefectCount">
                    <el-input v-model="DetailInfoForm.FlawDefectCount" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.ResultDefectCount')" prop="ResultDefectCount">
                    <el-input v-model="DetailInfoForm.ResultDefectCount" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="'Accept'" prop="Accept">
                    <el-input v-model="DetailInfoForm.Accept" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="'AC'" prop="AC">
                    <el-input v-model="DetailInfoForm.AC" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="'RE'" prop="RE">
                    <el-input v-model="DetailInfoForm.RE" placeholder="" style="width: 150px" />
                </el-form-item>
            </el-form>
            <el-table :data="CharactTable" border stripe style="width: 100%" size="small" :height="200">
                <el-table-column prop="OQCCharacteristicsName" :label="$t('oqcInspection.characteristicName')">
                    <template #default="scope">
                        <el-input v-model="scope.row.OQCCharacteristicsName" size="small"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="OQCCharacteristicsDesc" :label="$t('oqcInspection.characteristicDesc')">
                    <template #default="scope">
                        <el-input v-model="scope.row.OQCCharacteristicsDesc" size="small"></el-input>
                    </template></el-table-column>
                <el-table-column prop="MeasurementLocation" :label="$t('oqcInspection.measurementLocation')">
                    <template #default="scope">
                        <el-input v-model="scope.row.MeasurementLocation" size="small"></el-input>
                    </template></el-table-column>
                <el-table-column prop="MeasurementMethod" :label="$t('oqcInspection.measurementMethod')">
                    <template #default="scope">
                        <el-input v-model="scope.row.MeasurementMethod" size="small"></el-input>
                    </template></el-table-column>
            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleInspectClose">{{
                        $t("publicText.cancel")
                    }}</el-button>
                    <el-button type="warning" @click="handleInspectZCConfirm" :disabled="isDisable">
                        {{ "暂存" }}
                    </el-button>
                    <el-button type="primary" @click="handleInspectConfirm" :disabled="isDisable">
                        {{ $t("publicText.confirm") }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="testVisible" :title="'检验'" width="85%" :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false" align-center @close="handletestClose">
            <!-- <el-button type="primary" @click="exportToExcel">导出Excel</el-button> -->
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane :label="'计数检验'" name="first">
                    <el-table :data="tableData2" border stripe style="width: 100%" size="small" :height="400">
                        <el-table-column prop="ProjectCategoryName" :label="$t('aqlrules.ProjectCategoryName')">
                        </el-table-column>
                        <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')">
                        </el-table-column>
                        <!-- <el-table-column prop="InspectionType" :label="$t('aqlrules.DBType')">
                        </el-table-column> -->
                        <el-table-column prop="CharacteristicGrade" :label="$t('aqlrules.CharaCteristicGrade')">
                        </el-table-column>
                        <el-table-column prop="InspectionToolName" :label="$t('aqlrules.ToolName')">
                        </el-table-column>
                        <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')">
                        </el-table-column>
                        <el-table-column prop="SampleSize" :label="$t('incomeSheet.numberOfSample')">
                            <template #default="scope">
                                <el-input v-model="scope.row.SampleSize" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectCount" :label="$t('incomeSheet.numberOfDefect')">
                            <template #default="scope">
                                <!-- {{ scope.row.DefectCount || calculateDefectCount(scope.row) }} -->
                                <el-input v-model="scope.row.DefectCount" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectDescription" :label="'缺陷描述'">
                            <template #default="scope">
                                <!-- {{ scope.row.DefectCount || calculateDefectCount(scope.row) }} -->
                                <el-input v-model="scope.row.DefectDescription" size="small"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="'计量检验'" name="second">
                    <el-table :data="tableData1" border stripe style="width: 100%" size="small" :height="400">
                        <el-table-column prop="ProjectCategoryName" :label="$t('aqlrules.ProjectCategoryName')">
                        </el-table-column>
                        <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')">
                        </el-table-column>
                        <!-- <el-table-column prop="InspectionType" :label="$t('aqlrules.DBType')">
                        </el-table-column> -->
                        <el-table-column prop="CharacteristicGrade" :label="$t('aqlrules.CharaCteristicGrade')">
                        </el-table-column>
                        <el-table-column prop="TargetValue" :label="$t('aqlrules.TargetValue')">
                        </el-table-column>

                        <el-table-column prop="MinValue" :label="$t('aqlrules.MinValue')">
                        </el-table-column>
                        <el-table-column prop="MaxValue" :label="$t('aqlrules.MaxValue')">
                        </el-table-column>
                        <el-table-column prop="InspectionToolName" :label="$t('aqlrules.ToolName')">
                        </el-table-column>
                        <el-table-column prop="uomname" :label="$t('aqlrules.uomname')">
                        </el-table-column>
                        <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')">
                        </el-table-column>
                        <el-table-column prop="SampleSize" :label="$t('incomeSheet.numberOfSample')">
                            <template #default="scope">
                                <el-input v-model="scope.row.SampleSize" size="small" type="number" min="1" max="10"
                                    @change="handleSampleSizeChange(scope.row)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectCount" :label="$t('incomeSheet.numberOfDefect')">
                            <template #default="scope">
                                {{ calculateDefectCount(scope.row) }}
                                <!-- <el-input v-model="scope.row.DefectCount" size="small" :disabled="scope.row.StatusText!==''"></el-input> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="MeasuredValue" :align="'center'"
                            :label="$t('incomeSheet.MeasurementNumber')">
                            <template #default="scope">
                                <span>{{ formatMeasuredValues(scope.row) }}</span>
                                <el-button type="primary" icon="Plus" :size="'small'"
                                    @click="openMeasurementDialog(scope.row, scope.$index)" />
                            </template>
                        </el-table-column>

                        <el-table-column prop="numberOfDefect" :label="'总和'">
                            <template #default="scope">
                                <span>{{ calculateSum(scope.row) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="numberOfDefect" :label="'平均数'">
                            <template #default="scope">
                                <span>{{ calculateAverage(scope.row) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="numberOfDefect" :label="'结果'">
                            <template #default="scope">
                                {{ getResultText(scope.row) }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handletestClose">{{
                        $t("publicText.cancel")
                    }}</el-button>
                    <el-button type="warning" @click="handleZCConfirm" :disabled="isDisable">
                        {{ "暂存" }}
                    </el-button>
                    <el-button type="primary" @click="handletestConfirm" :disabled="isDisable">
                        {{ $t("publicText.confirm") }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="dialogVisible" :title="'输入测量值'" width="500px">
            <el-form ref="formRef" label-width="auto" size="small">
                <el-form-item :label="'样本值' + i" prop="name" v-for="i in currentSampleSize" :key="i">
                    <el-input v-model="measurementValues[i - 1]" placeholder="请输入测量值" style="width: 200px" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveMeasurements">保存</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    QueryOQCDocumentNumbersByCriteria,
    QueryOQCNewWorkOrderDetailsByWorkOrder,
    FTPSearchAndDownloadSpecificationDocumentFile,
    OQCDocumentExecution,
    GetOQCDetailInfo,
    SaveWithStatus,
    DownloadAndFillOQCFile,
    DownloadAndFillCOCFile,
    QueryOQCCorrelationIQCModelSpec,
} from "@/api/smtSpotCheck/oqc";
import {
    ref,
    watch,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
} from "vue";
import {
    shortcuts,
    setTodayDate,
    setLastDate,
    disabledDate,
} from "@/utils/dataMenu";
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useUserStoreWithOut } from "@/stores/modules/user";
import dayjs from "dayjs";
import router from "@/router";
const userStore = useUserStoreWithOut();
const getForm = ref({
    OQCName: "",
    OQCNumber: "",
    MfgOrderName: "",
    StartTime: "",
    EndTime: "",
    InspectionStatus: 0,
    ProductType: "",
    ProductName: "",
    ToCustomerName: "",
    PartNo: "",
    CustomerPN: "",
    LotNo: "",
    SpecificationNo: "",
    SpecName: "",
    OrderTypeName: "",
});
const searchDate = ref<any[]>([]);
const tableHeight = ref(0);
const tableData = ref([]);
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const addForm = ref({
    MfgOrderName: "",
    OrderQty: 0,
    ShippingQty: 0,
    PartNo: "",
    LotNo: "",
    TotalEvaluation: "",
    ProductName: "",
    ToCustomerName: "",
    ProductType: "",
    CustomerPN: "",
    MaterialSource: "",
    Date: "",
    DataStatus: 0,
    OperatorUser: userStore.getUserInfo,
    OperationType: "Add",
});
const addVisible = ref(false);
const addFormRef = ref("");
const activeName = ref("first");
const detailTableData = ref<any[]>([]);
const detailVisible = ref(false);
const testVisible = ref(false);
const isDisable = ref(false);
const tableData1 = ref<any[]>([]);
const tableData2 = ref<any[]>([]);
const dialogVisible = ref(false);
const currentRow = ref<any>(null);
const currentRowIndex = ref(-1);
const currentSampleSize = ref(0);
const measurementValues = ref<any[]>([]);
const lookFormRef = ref();
const lookVisible = ref(false);
const headerForm = ref({
    OQCName: "",
    OQCNumber: "",
    MfgOrderName: "",
    OrderQty: 0,
    ShippingQty: 0,
    PartNo: "",
    LotNo: "",
    TotalEvaluation: "",
    ProductName: "",
    ToCustomerName: "",
    ProductType: "",
    CustomerPN: "",
    Date: "",
    MaterialSource: "",
    RemainingQty: 0,
    QtyShiped: 0,
});

const testEqForm = ref({
    ResourceName: "",
    Status: 0,
});
const QCInspectDetail = ref<any[]>([]);
const DetailInfoForm = ref({
    SamplingPlan: "",
    TechnicalRequirements: "",
    Severity: "",
    InspectionLevel: "",
    SampleSize: 0,
    PinHole: 0,
    Dirt: 0,
    Flaw: 0,
    Result: 0,
    PinHoleDefectCount: 0,
    DirtDefectCount: 0,
    FlawDefectCount: 0,
    ResultDefectCount: 0,
    Reject: 0,
    Accept: 0,
    AC: 0,
    RE: 0,
});
const CharactTable = ref<any[]>([
    {
        OQCCharacteristicsName: "",
        OQCCharacteristicsDesc: "",
        MeasurementLocation: "",
        MeasurementMethod: "",
    },
]);
const MeasurTable = ref<any[]>([]);
const CountTable = ref<any[]>([]);
const eqList = ref<any[]>([]);
const inspectVisible = ref(false);
watch(
    () => searchDate.value,
    (newVal: any, oldVal: any) => {
        if (newVal === null) {
            getForm.value.StartTime = "";
            getForm.value.EndTime = "";
            // getForm.value.PageNumber = 1

            return;
        }
        if (newVal !== oldVal) {
            getForm.value.StartTime = newVal[0];
            getForm.value.EndTime = newVal[1];
            // getForm.value.PageNumber = 1
        }
    }
);

onBeforeMount(() => {
    getScreenHeight();
    let end: string = setTodayDate();
    let start: string = setLastDate();
    searchDate.value = [start, end];
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});
const testClick = () => {
    router.push({
        path: "/incomingManage/inspectSheet/1",
        query: { title: "IQC-来料检验单-审核1" },
    });
};
const getData = () => {
    QueryOQCDocumentNumbersByCriteria(getForm.value).then((res: any) => {
        tableData.value = res.content;
    });
};
const openAdd = () => {
    addVisible.value = true;
};
const handleAddClose = () => {
    addVisible.value = false;
    addForm.value = {
        MfgOrderName: "",
        OrderQty: 0,
        ShippingQty: 0,
        PartNo: "",
        LotNo: "",
        TotalEvaluation: "",
        ProductName: "",
        ToCustomerName: "",
        ProductType: "",
        CustomerPN: "",
        MaterialSource: "",
        Date: "",
        DataStatus: 0,
        OperatorUser: "",
        OperationType: "Add",
    };
};
const handleAddConfirm = () => {
    addForm.value.Date = dayjs().format("YYYY-MM-DD");
    OQCDocumentExecution(addForm.value).then((res: any) => {
        ElMessage({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        if (!res.success) {
            return;
        }
        addVisible.value = false;
        getData();
    });
};

const handleEdit = (row: any) => {

    GetOQCDetailInfo({ OQCName: row.OQCName }).then((res: any) => {
        let data = res.content;
        headerForm.value = {
            OQCName: data.OQCHead[0].oqcName,
            OQCNumber: data.OQCHead[0].oqcNumber,
            MfgOrderName: data.OQCHead[0].mfgOrderNo,
            OrderQty: data.OQCHead[0].orderQty,
            ShippingQty: data.OQCHead[0].shippingQty,
            PartNo: data.OQCHead[0].customerPartNo,
            LotNo: data.OQCHead[0].lotNo,
            TotalEvaluation: data.OQCHead[0].totalEvaluation,
            ProductName: data.OQCHead[0].productName,
            ToCustomerName: data.OQCHead[0].toCustomer,
            ProductType: data.OQCHead[0].productType,
            CustomerPN: data.OQCHead[0].customerPartNo,
            Date: data.OQCHead[0].inspectionDate,
            MaterialSource: data.OQCHead[0].materialSource,
            RemainingQty: data.OQCHead[0].remainingQty,
            QtyShiped: data.OQCHead[0].shippedQty,
        };
        DetailInfoForm.value = {
            SamplingPlan: data.OQCDetailInfo[0].samplingPlan,
            TechnicalRequirements: data.OQCDetailInfo[0].technicalRequirements,
            Severity: data.OQCDetailInfo[0].severity,
            InspectionLevel: data.OQCDetailInfo[0].inspectionLevel,
            SampleSize: data.OQCDetailInfo[0].sampleSize,
            PinHole: data.OQCDetailInfo[0].pinHole,
            Dirt: data.OQCDetailInfo[0].dirt,
            Flaw: data.OQCDetailInfo[0].flaw,
            Result: data.OQCDetailInfo[0].result,
            PinHoleDefectCount: data.OQCDetailInfo[0].pinHoleDefectCount,
            DirtDefectCount: data.OQCDetailInfo[0].dirtDefectCount,
            FlawDefectCount: data.OQCDetailInfo[0].flawDefectCount,
            ResultDefectCount: data.OQCDetailInfo[0].resultDefectCount,
            Reject: data.OQCDetailInfo[0].isRejected,
            Accept: data.OQCDetailInfo[0].isAccepted,
            AC: data.OQCDetailInfo[0].AC,
            RE: data.OQCDetailInfo[0].RE,
        };
        eqList.value = data.OQCInstrumentDetails;
        // console.log(eqList.value);
        if (data.OQCCharacteristicDetails.length == 0) {
            CharactTable.value = [
                {
                    OQCCharacteristicsName: "",
                    OQCCharacteristicsDesc: "",
                    MeasurementLocation: "",
                    MeasurementMethod: "",
                },
            ];
        } else {
            CharactTable.value = data.OQCCharacteristicDetails.map((item: any) => ({
                OQCCharacteristicsName: item.characteristicName,
                OQCCharacteristicsDesc: item.characteristicDesc,
                MeasurementLocation: item.measurementLocation,
                MeasurementMethod: item.measurementMethod,
            }));
        }

        MeasurTable.value = data.OQCInspectionDetails.filter(
            (item: any) => item.measurementType == "计量"
        );
        CountTable.value = data.OQCInspectionDetails.filter(
            (item: any) => item.measurementType == "计数"
        );
        inspectVisible.value = true;
    });
};
const handleInspectClose = () => {
    inspectVisible.value = false;
};
const handleInspectZCConfirm = () => {
    // 暂存逻辑
    let data = {
        OQCName: headerForm.value.OQCName,
        OQCNumber: headerForm.value.OQCNumber,
        MfgOrderName: headerForm.value.MfgOrderName,
        OrderQty: headerForm.value.OrderQty,
        ShippingQty: headerForm.value.ShippingQty,
        PartNo: headerForm.value.PartNo,
        LotNo: headerForm.value.LotNo,
        TotalEvaluation: headerForm.value.TotalEvaluation,
        ProductName: headerForm.value.ProductName,
        ToCustomerName: headerForm.value.ToCustomerName,
        ProductType: headerForm.value.ProductType,
        CustomerPN: headerForm.value.CustomerPN,
        Date: headerForm.value.Date,
        DataStatus: 0,
        OperatorUser: userStore.getUserInfo,
        ApprovalStatus: "",
        ApprovalRemarks: "",
        InspectionStatus: "1",
        RemainingQty: headerForm.value.RemainingQty,
        QtyShiped: headerForm.value.QtyShiped,
        SpecificationNo: "",
        OperationType: "",
        oQCInstrumentDetails: [
            {
                ResourceName: "",
                Status: 0,
            },
        ],
        oQCCharacteristicsDetails: [
            ...CharactTable.value,
        ],
        oQCInspectionDetails: [],
        oQCDetail: {
            ...DetailInfoForm.value,
        }
    };
    console.log(data);


};
const handleInspectConfirm = () => {
    // 提交逻辑
};

const openMeasurementDialog = (row: any, index: any) => {
    currentRow.value = row;
    currentRowIndex.value = index;
    currentSampleSize.value = parseInt(row.SampleSize) || 0;
    measurementValues.value = [];
    for (let i = 0; i < currentSampleSize.value; i++) {
        measurementValues.value.push(row[`MeasuredValue${i + 1}`] || "");
    }

    dialogVisible.value = true;
};

const saveMeasurements = () => {
    for (let i = 0; i < currentSampleSize.value; i++) {
        currentRow.value[`MeasuredValue${i + 1}`] = measurementValues.value[i];
    }

    dialogVisible.value = false;
};

const calculateDefectCount = (row: any) => {
    // 获取MinValue和MaxValue的数值
    const minValue = parseFloat(row.MinValue);
    const maxValue = parseFloat(row.MaxValue);

    // 检查MinValue和MaxValue是否有效
    if (isNaN(minValue) || isNaN(maxValue)) {
        return 0; // 范围无效时返回0
    }

    let defectCount = 0;

    // 检查所有测量值
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];

        // 跳过空值
        if (value === null || value === undefined || value === "") {
            continue;
        }

        // 转换为数字
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            continue; // 非数字值不计入缺陷
        }

        // 检查是否不在范围内
        if (numValue < minValue || numValue > maxValue) {
            defectCount++;
        }
    }

    return defectCount;
};
const getResultText = (row: any) => {
    // 获取MinValue和MaxValue的数值
    const minValue = parseFloat(row.MinValue);
    const maxValue = parseFloat(row.MaxValue);

    // 检查MinValue和MaxValue是否有效
    if (isNaN(minValue) || isNaN(maxValue)) {
        return "范围无效";
    }

    // 检查所有测量值
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];

        // 跳过空值
        if (value === null || value === undefined || value === "") {
            continue;
        }

        // 转换为数字
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return "数据异常"; // 如果有非数字值，返回异常
        }

        // 检查是否在范围内
        if (numValue < minValue || numValue > maxValue) {
            row.Status = "不合格";
            return "不合格";
        }
    }

    // 检查是否有至少一个测量值
    const hasValues = Array.from({ length: 10 }, (_, i) => i + 1).some(
        (i) =>
            row[`MeasuredValue${i}`] !== null &&
            row[`MeasuredValue${i}`] !== undefined &&
            row[`MeasuredValue${i}`] !== ""
    );
    row.Status = hasValues ? "合格" : "无数据";
    return hasValues ? "合格" : "无数据";
};
const handleSampleSizeChange = (row: any) => {
    const newSize = parseInt(row.SampleSize) || 0;
    // 清空多余的测量值
    for (let i = newSize; i < 10; i++) {
        row[`MeasuredValue${i + 1}`] = null;
    }
};
const calculateSum = (row: any) => {
    let sum = 0;
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];
        if (value !== null && value !== undefined && value !== "") {
            sum += Number(value);
        }
    }
    return sum;
};
const calculateAverage = (row: any) => {
    let sum = 0;
    let count = 0;
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];
        if (value !== null && value !== undefined && value !== "") {
            sum += Number(value);
            count++;
        }
    }
    return count > 0 ? (sum / count).toFixed(2) : 0;
};
const formatMeasuredValues = (row: any) => {
    const values = [];
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];
        if (value !== null && value !== undefined && value !== "") {
            values.push(value);
        }
    }
    return values.join(", ");
};

const handleLook = (row: any) => {
    lookVisible.value = true;
};
const handletestClose = () => {
    testVisible.value = false;
};
const handleZCConfirm = () => {
    let data = tableData1.value.map((item: any) => {
        return {
            IQCDetailId: item.IQC_DetailName,
            IQC_InspectionDetailsName: item.IQC_InspectionDetailName,
            SampleSize: parseInt(item.SampleSize),
            DefectCount: parseInt(item.DefectCount),
            DefectDescription: "",
            MeasuredValue1: item.MeasuredValue1 || "",
            MeasuredValue2: item.MeasuredValue2 || "",
            MeasuredValue3: item.MeasuredValue3 || "",
            MeasuredValue4: item.MeasuredValue4 || "",
            MeasuredValue5: item.MeasuredValue5 || "",
            MeasuredValue6: item.MeasuredValue6 || "",
            MeasuredValue7: item.MeasuredValue7 || "",
            MeasuredValue8: item.MeasuredValue8 || "",
            MeasuredValue9: item.MeasuredValue9 || "",
            MeasuredValue10: item.MeasuredValue10 || "",
            Inspector: userStore.getUserInfo,
            Status: 0,
            DataStatus: 0,
        };
    });

    tableData2.value.forEach((item: any) => {
        data.push({
            IQCDetailId: item.IQC_DetailName,
            IQC_InspectionDetailsName: item.IQC_InspectionDetailName,
            SampleSize: parseInt(item.SampleSize),
            DefectCount: parseInt(item.DefectCount),
            DefectDescription: item.DefectDescription,
            MeasuredValue1: "",
            MeasuredValue2: "",
            MeasuredValue3: "",
            MeasuredValue4: "",
            MeasuredValue5: "",
            MeasuredValue6: "",
            MeasuredValue7: "",
            MeasuredValue8: "",
            MeasuredValue9: "",
            MeasuredValue10: "",
            Inspector: userStore.getUserInfo,
            Status: 0,
            DataStatus: 0,
        });
    });
    // console.log( data);
    // AyscIQCInspectionInterface(data).then((res: any) => {
    //     ElNotification({
    //         title: t("message.tipTitle"),
    //         message: res.msg,
    //         type: res.success ? "success" : "error",
    //     });
    //     testVisible.value = false;
    //     getData()
    // });
};
const handletestConfirm = () => {
    let data = tableData1.value.map((item: any) => {
        return {
            IQCDetailId: item.IQC_DetailName,
            IQC_InspectionDetailsName: item.IQC_InspectionDetailName,
            SampleSize: parseInt(item.SampleSize),
            DefectCount: parseInt(item.DefectCount),
            DefectDescription: "",
            MeasuredValue1: item.MeasuredValue1 || "",
            MeasuredValue2: item.MeasuredValue2 || "",
            MeasuredValue3: item.MeasuredValue3 || "",
            MeasuredValue4: item.MeasuredValue4 || "",
            MeasuredValue5: item.MeasuredValue5 || "",
            MeasuredValue6: item.MeasuredValue6 || "",
            MeasuredValue7: item.MeasuredValue7 || "",
            MeasuredValue8: item.MeasuredValue8 || "",
            MeasuredValue9: item.MeasuredValue9 || "",
            MeasuredValue10: item.MeasuredValue10 || "",
            Inspector: userStore.getUserInfo,
            Status: item.Status == "合格" ? 1 : 2,
            DataStatus: 0,
        };
    });
    let isEixt = data.findIndex((item: any) => {
        return item.Status !== 1;
    });

    if (isEixt !== -1) {
        ElNotification({
            title: t("message.tipTitle"),
            message: "计量结果，不通过！请检查",
            type: "error",
        });

        return;
    }
    tableData2.value.forEach((item: any) => {
        data.push({
            IQCDetailId: item.IQC_DetailName,
            IQC_InspectionDetailsName: item.IQC_InspectionDetailName,
            SampleSize: parseInt(item.SampleSize),
            DefectCount: parseInt(item.DefectCount),
            DefectDescription: item.DefectDescription,
            MeasuredValue1: "",
            MeasuredValue2: "",
            MeasuredValue3: "",
            MeasuredValue4: "",
            MeasuredValue5: "",
            MeasuredValue6: "",
            MeasuredValue7: "",
            MeasuredValue8: "",
            MeasuredValue9: "",
            MeasuredValue10: "",
            Inspector: userStore.getUserInfo,
            Status: item.DefectCount == 0 ? 1 : 2,
            DataStatus: 0,
        });
    });
    // console.log(data);

    // AyscIQCInspectionInterface(data).then((res: any) => {
    //     ElNotification({
    //         title: t("message.tipTitle"),
    //         message: res.msg,
    //         type: res.success ? "success" : "error",
    //     });
    //     testVisible.value = false;
    //     getData()
    // });
};
const handleSizeChange = (val: any) => {
    pageObj.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.currentPage = val;
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 250;
    });
};
const headerRowStyle = (row: any) => {
    console.log(row);
};
</script>
<style scoped>
.el-pagination {
    justify-content: center;
}

.table-container {
    display: flex;
    width: 100%;
    height: 100%;
}

.left {
    flex: 1;
}

.right {
    flex: 1;
}
</style>

<style lang="scss" scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.report-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
}

.info-section {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
}

.info-item {
    display: flex;
    margin-right: 30px;
    margin-bottom: 10px;
}

.info-label {
    font-weight: bold;
    margin-right: 5px;
    white-space: nowrap;
}

.table-container {
    overflow-x: auto;
}

.export-btn {
    margin-top: 20px;
    text-align: right;
}

.remark {
    margin-top: 15px;
    padding: 8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    color: #606266;
}

.el-table .header-row {
    background-color: #f0f9ff;
}

.el-table .header-row th {
    background-color: #f0f9ff !important;
}

.el-table .cell {
    padding: 4px 8px;
    font-size: 12px;
}

.el-table th {
    padding: 8px 0;
}

.el-table--border {
    border: 1px solid #ebeef5;
}

.el-table--border th,
.el-table--border td {
    border-right: 1px solid #ebeef5;
}

.el-table--border::after,
.el-table--group::after,
.el-table::before {
    background-color: #ebeef5;
}

.header-cell {
    font-weight: bold;
    background-color: #f5f7fa;
}

.content-cell {
    background-color: #ffffff;
}

.info-row {
    display: flex;
    margin-bottom: 10px;
}

.info-box {
    flex: 1;
    padding: 5px 10px;
    border: 1px solid #ebeef5;
    margin-right: 10px;
}

.info-box:last-child {
    margin-right: 0;
}

.info-box-title {
    font-weight: bold;
    margin-bottom: 5px;
}
</style>
