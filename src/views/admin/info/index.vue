<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工单id" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入工单id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学校报修人" prop="reportorName">
        <el-input
          v-model="queryParams.reportorName"
          placeholder="请输入学校报修人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学校名称" prop="schoolName">
        <el-input
          v-model="queryParams.schoolName"
          placeholder="请输入学校名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="维修来源" prop="source">
        <el-select v-model="queryParams.source" placeholder="请选择维修来源" clearable>
          <el-option
            v-for="dict in dict.type.zjjyjyw_repair"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="报修类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择报修类型" clearable>
          <el-option
            v-for="dict in dict.type.zjjyjyw_warranty"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="紧急程度" prop="level">
        <el-select v-model="queryParams.level" placeholder="请选择紧急程度" clearable>
          <el-option
            v-for="dict in dict.type.zjjyjyw_level"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.zjjyjyw_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支局责任人" prop="responsibleUserName">
        <el-input
          v-model="queryParams.responsibleUserName"
          placeholder="请输入支局责任人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="isReportor">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['admin:info:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['admin:info:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['admin:info:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['admin:info:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" />
      <el-table-column label="工单id" align="center" prop="orderId" />
      <el-table-column label="学校报修人" align="center" prop="reportorName" />
      <el-table-column label="学校名称" align="center" prop="schoolName" />
      <el-table-column label="维修来源" align="center" prop="source">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.zjjyjyw_repair" :value="scope.row.source"/>
        </template>
      </el-table-column>
      <el-table-column label="报修类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.zjjyjyw_warranty" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="紧急程度" align="center" prop="level">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.zjjyjyw_level" :value="scope.row.level"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.zjjyjyw_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="支局责任人" align="center" prop="responsibleUserName" />
      <el-table-column label="维修人员" align="center" prop="maintenanceUserName" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['admin:info:query']"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,'edit')"
            v-hasPermi="['admin:info:edit']"
          >修改</el-button>
          <el-button
            v-if="scope.row.status=='1' && isResponse"
            size="mini"
            type="text"
            icon="el-icon-bottom"
            @click="handleUpdate(scope.row,'down')"
            v-hasPermi="['admin:info:edit']"
          >派单</el-button>
          <el-button
            v-if="scope.row.status=='2' && isMaintenance"
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleUpdate(scope.row,'receive')"
            v-hasPermi="['admin:info:edit']"
          >接单</el-button>
          <el-button
            v-if="scope.row.status=='3' && isMaintenance"
            size="mini"
            type="text"
            icon="el-icon-suitcase-1"
            @click="handleUpdate(scope.row,'done')"
            v-hasPermi="['admin:info:edit']"
          >维修</el-button>
          <el-button
          v-if="scope.row.status=='4' && isResponse"
            size="mini"
            type="text"
            icon="el-icon-thumb"
            @click="handleUpdate(scope.row,'audit')"
            v-hasPermi="['admin:info:edit']"
          >审核</el-button>
          <el-button
            v-if="scope.row.status=='5' && (isReportor || isResponse)"
            size="mini"
            type="text"
            icon="el-icon-circle-close"
            @click="handleUpdate(scope.row,'close')"
            v-hasPermi="['admin:info:edit']"
          >关闭</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-remove"
            @click="handleUpdate(scope.row,'cancel')"
            v-hasPermi="['admin:info:edit']"
          >取消</el-button> -->
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-refresh-left"
            @click="handleUpdate(scope.row,'back')"
            v-hasPermi="['admin:info:edit']"
          >退回</el-button> -->
          <el-button v-if="isReportor || isResponse"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['admin:info:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
      />

    <!-- 添加或修改工单报表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form v-if="method=='edit'" ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学校报修人">
          <el-input v-model="form.reportorName" placeholder="请输入学校报修人" :disabled="true"/>
        </el-form-item>
        <el-form-item label="学校名称" prop="schoolName">
          <el-input v-model="form.schoolName" placeholder="请输入学校名称" :disabled="true"/>
        </el-form-item>
        <el-form-item label="报修类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择报修类型">
            <el-option
              v-for="dict in dict.type.zjjyjyw_warranty"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="光路编号" prop="pathNum">
          <el-input v-model="form.pathNum" placeholder="请输入光路编号" :disabled="true"/>
        </el-form-item>
        <el-form-item label="端口编号" prop="portNum">
          <el-input v-model="form.portNum" placeholder="请输入端口编号" :disabled="true"/>
        </el-form-item>
        <el-form-item label="紧急程度" prop="level">
          <el-select v-model="form.level" placeholder="请选择紧急程度">
            <el-option
              v-for="dict in dict.type.zjjyjyw_level"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备信息" prop="deviceInfo">
          <el-input v-model="form.deviceInfo" placeholder="请输入设备信息" :disabled="true"/>
        </el-form-item>
        <el-form-item label="故障描述" prop="faultDesc">
          <el-input v-model="form.faultDesc" placeholder="请输入故障描述" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="图片" prop="pic">
          <image-upload v-model="form.pic"/>
        </el-form-item>
        <el-form-item label="支局责任人">
          <el-input v-model="form.responsibleUserName" placeholder="请输入支局责任人" :disabled="true"/>
        </el-form-item>
      </el-form>
      <el-form v-else ref="form" :model="form" :rules="rules" label-width="80px">
        <div v-if="method=='down'">
          <el-form-item label="维修人" prop="candi">
          <el-select v-model="form.candi" placeholder="请选择维修人" clearable
            :style="{width: '100%'}">
            <el-option v-for="(item, index) in maintenanceUsers" :key="index" :label="item.nick_name"
              :value="item.user_name"></el-option>
          </el-select>
        </el-form-item>
        </div>
        <div v-if="method=='receive'">确认接单？</div>
        <div v-if="method=='close'">确认关闭？</div>
        <el-form-item v-if="method=='audit'">
          <el-radio v-model="auditResult" label="pass">通过</el-radio>
          <el-radio v-model="auditResult" label="reject">不通过</el-radio>
        </el-form-item>
        <el-form-item v-if="(method!='receive' && method!='close' && method!='down' && method !='audit')||auditResult=='reject'" label="详情" prop="content">
          <el-input v-model="form.content" placeholder="请输入详情" />
        </el-form-item>
        <el-form-item v-if="method=='done'" label="图片" prop="pic">
          <image-upload v-model="form.pic"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情 -->
    <el-dialog :title="'查看工单'" :visible.sync="view" with="1000px" append-to-body>
      <div>工单信息</div>
      <el-row :gutter="20">
        <el-col :span="12">
          <span class="grid-content bg-purple">工单编号：</span>
          <span class="grid-content bg-purple">{{ form.orderId }}</span>
        </el-col>
        <el-col :span="12">
          <span class="grid-content bg-purple">学校名称：</span>
          <span class="grid-content bg-purple">{{ form.schoolName }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <span style="float:left" class="grid-content bg-purple">工单状态：</span>
          <dict-tag style="float:left" :options="dict.type.zjjyjyw_status" :value="form.status"/>
        </el-col>
        <el-col :span="12">
          <span class="grid-content bg-purple">责任人：</span>
          <span class="grid-content bg-purple">{{ form.responsibleUserName }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
            <span style="float:left" class="grid-content bg-purple">维修来源：</span>
            <dict-tag style="float:left" :options="dict.type.zjjyjyw_repair" :value="form.source"/>
        </el-col>
        <el-col :span="12">
          <span style="float:left" class="grid-content bg-purple">报修类型：</span>
          <dict-tag style="float:left" :options="dict.type.zjjyjyw_warranty" :value="form.type"/>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <span class="grid-content bg-purple">光路编号：</span>
          <span class="grid-content bg-purple">{{ form.pathNum }}</span>
        </el-col>
        <el-col :span="12">
          <span class="grid-content bg-purple">端口编号：</span>
          <span class="grid-content bg-purple">{{ form.portNum }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <span style="float:left" class="grid-content bg-purple">紧急程度：</span>
          <dict-tag style="float:left" :options="dict.type.zjjyjyw_level" :value="form.level"/>
        </el-col>
        <el-col :span="12">
          <span class="grid-content bg-purple">设备信息：</span>
          <span class="grid-content bg-purple">{{ form.deviceInfo }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <span class="grid-content bg-purple">故障描述：</span>
          <span class="grid-content bg-purple">{{ form.faultDesc }}</span>
        </el-col>
        <el-col :span="12">
          <span class="grid-content bg-purple">图片：</span>
          <image-preview :src="form.pic"></image-preview>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <span class="grid-content bg-purple">备注：</span>
          <span class="grid-content bg-purple">{{ form.remark }}</span>
        </el-col>
        <el-col :span="12">
          <span class="grid-content bg-purple">报修人：</span>
          <span class="grid-content bg-purple">{{ form.reportorName }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <span class="grid-content bg-purple">联系方式：</span>
          <span class="grid-content bg-purple">{{ form.reportor }}</span>
        </el-col>
        <el-col :span="12">
          <span class="grid-content bg-purple">创建时间：</span>
          <span class="grid-content bg-purple">{{ form.createTime }}</span>
        </el-col>
      </el-row>
      <div v-if="form.water!=null">
      <div>维修信息</div>
      <el-row :gutter="20">
        <el-col :span="12">
          <span class="grid-content bg-purple">维修人：</span>
          <span class="grid-content bg-purple">{{ form.water.maintenanceUserName }}</span>
        </el-col>
        <el-col :span="12">
          <span class="grid-content bg-purple">联系方式：</span>
          <span class="grid-content bg-purple">{{ form.water.phonenumber }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <span class="grid-content bg-purple">接单时间：</span>
          <span class="grid-content bg-purple">{{ form.water.dealBegDate }}</span>
        </el-col>
        <el-col :span="12">
          <span class="grid-content bg-purple">维修情况：</span>
          <span class="grid-content bg-purple">{{ form.water.content }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <span class="grid-content bg-purple">备注：</span>
          <span class="grid-content bg-purple">{{ form.water.remark }}</span>
        </el-col>
        <el-col :span="12">
          <span class="grid-content bg-purple">完成时间：</span>
          <span class="grid-content bg-purple">{{ form.water.dealEndDate }}</span>
        </el-col>
      </el-row>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo, addInfo, updateInfo, orderFlow, getUserInfo, getMaintenance } from "@/api/admin/info";
import Cookies from "js-cookie";

export default {
  name: "Info",
  dicts: ['zjjyjyw_status', 'zjjyjyw_level', 'zjjyjyw_warranty', 'zjjyjyw_repair'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 工单报表表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 编辑类型
      method: "edit",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderId: null,
        reportor: null,
        schoolName: null,
        source: null,
        type: null,
        level: null,
        status: null,
        responsibleUser: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        reportor: [
          { required: true, message: "学校报修人不能为空", trigger: "blur" }
        ],
        schoolName: [
          { required: true, message: "学校名称不能为空", trigger: "blur" }
        ],
        source: [
          { required: true, message: "维修来源不能为空", trigger: "change" }
        ],
        type: [
          { required: true, message: "报修类型不能为空", trigger: "change" }
        ],
        pathNum: [
          { required: true, message: "光路编号不能为空", trigger: "blur" }
        ],
        portNum: [
          { required: true, message: "端口编号不能为空", trigger: "blur" }
        ],
        level: [
          { required: true, message: "紧急程度不能为空", trigger: "change" }
        ],
        deviceInfo: [
          { required: true, message: "设备信息不能为空", trigger: "blur" }
        ],
        faultDesc: [
          { required: true, message: "故障描述不能为空", trigger: "blur" }
        ],
        responsibleUser: [
          { required: true, message: "支局责任人不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "详情不能为空", trigger: "blur" }
        ],
      },
      maintenanceUsers: [],
      auditResult: "pass",
      view: false,
      isReportor: false,
      isResponse: false,
      isMaintenance: false
    };
  },
  created() {
    // 验证用户是否是支局负责人
    this.isResponse = this.$auth.hasRole("person");
    this.isReportor = this.$auth.hasRole("report");
    this.isMaintenance = this.$auth.hasRole("maintenance");
    this.getList();
  },
  methods: {
    /** 查询工单报表列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.method="edit";
      this.form = {
        orderId: null,
        reportor: null,
        schoolId: null,
        schoolName: null,
        source: null,
        type: null,
        pathNum: null,
        portNum: null,
        level: null,
        status: null,
        deviceInfo: null,
        faultDesc: null,
        remark: null,
        pic: null,
        responsibleUser: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        responsibleUserName: null,
        reportorName: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.orderId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工单报表";
      //查询登录用户相关信息，填入表单
      const username = Cookies.get("username");
      getUserInfo(username).then(response => {
        var userInfo = response.data[0];
        var initForm = {}
        initForm.reportor = userInfo.reportor_mobile;
        initForm.responsibleUser = userInfo.responsible_mobile;
        initForm.schoolId = userInfo.dept_id;
        initForm.schoolName = userInfo.dept_name;
        initForm.pathNum = userInfo.path_num;
        initForm.portNum = userInfo.port_num;
        initForm.deviceInfo = userInfo.device_info;
        initForm.reportorName = userInfo.reportor;
        initForm.responsibleUserName = userInfo.responsible;
        initForm.level=null;
        initForm.type=null;
        this.form = initForm;
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row,method) {
      // this.reset();
      const orderId = row.orderId || this.ids
      this.open = true;
      this.method = method;
      if(method=='edit'){
        getInfo(orderId).then(response => {
        this.form = response.data;
        this.title = "修改工单报表";
        })
      } else {
        let water = {}
        water.orderId = row.orderId;
        water.method = method;
        this.form = water;
        if (method=='down') {
          //查询维修人员列表
          const username = Cookies.get("username");
          getMaintenance(15305755212).then(response => {
            this.maintenanceUsers = response.data;
          })
          this.title = "派单";
        } else if(method=='receive'){
          this.title = "接单";
        } else if(method=='done'){
          this.title = "维修";
        } else if(method=='audit'){
          this.title = "审核";
        } else if(method=='close'){
          this.title = "关闭";
        }
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.orderId != null ) {
            if(this.method=='edit'){
              updateInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              });
            } else {
              orderFlow(this.form).then(response => {
                this.$modal.msgSuccess("操作成功");
                this.open = false;
                this.getList();
              });
            }

          } else {
            addInfo(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const orderIds = row.orderId || this.ids;
      this.$modal.confirm('是否确认删除工单报表编号为"' + orderIds + '"的数据项？').then(function() {
        return delInfo(orderIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('admin/info/export', {
        ...this.queryParams
      }, `info_${new Date().getTime()}.xlsx`)
    },
    audit(result){
      if(result=="pass"){
        this.form.content="pass";
        this.auditResult="pass";
      } else {
        this.auditResult="reject";
        this.form.content="";
      }
    },
    handleView(row){
      const orderId = row.orderId || this.ids
      getInfo(orderId).then(response => {
        this.form = response.data;
        this.view = true;
      })
    }
  }
};
</script>
