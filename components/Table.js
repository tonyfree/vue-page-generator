let Table  = {
  options: {
    template: ''+
      '<div>'+
        '<el-table :data="tableData" style="width: 100%">'+
          '<el-table-column v-for="col in tableOptions" :prop="col.field" :label="col.title" fixed>'+
          '</el-table-column>' +
        '</el-table>'+
        '<el-dialog title="配置参数" :visible.sync="dialogVisible" width="40%">'+
          '<el-form style="max-height: 300px;overflow-y: auto;">'+
            '<el-row v-for="option in tableOptions">'+
              '<el-col :span="12">'+
                '<el-form-item label="表头列名" label-width="80px">'+
                  '<el-input v-model="option.title"></el-input>'+
                '</el-form-item>'+
              '</el-col>'+
              '<el-col :span="12">'+
                '<el-form-item label="对应字段" label-width="80px">'+
                    '<el-input v-model="option.field"></el-input>'+
                '</el-form-item>'+
              '</el-col>'+
            '</el-row>'+
            '<el-form-item>'+
              '<el-button type="primary" @click="addRow">增加列</el-button>'+
            '</el-form-item>'+
          '</el-form>'+
          '<el-form>'+
            '<el-form-item label="接口配置">'+
              '<el-input v-model="apiUrl"></el-input>'+
            '</el-form-item>'+
          '</el-form>'+
          '<el-form>'+
            '<el-form-item label="使用mock">'+
              '<el-switch v-model="useMock"></el-switch>'+
            '</el-form-item>'+
          '</el-form>'+
          '<span slot="footer" class="dialog-footer">'+
            '<el-button @click="dialogVisible = false">取 消</el-button>'+
            '<el-button type="primary" @click="add">确 定</el-button>'+
          '</span>'+
        '</el-dialog>'+
      '</div>',
    created: function () {
      let _this = this
      window.eventBus.$on('tableEdit', function(i) {
        if (_this.$parent.i === i) {
          _this.dialogVisible = true
        }
      })
    },
    mounted: function() {
      if (this.beforeCreate) return
      axios.post(this.apiUrl).then(res => {
        this.tableData = res.data.lists
      })
    },
    data: function() {
      return {
        tableData: [],
        // tableOptions: [{title:'',field:''},{title:'',field:''},{title:'',field:''}],
        // apiUrl: '',
        tableOptions: [{title:'设备名称',field:'name'},{title:'设备型号',field:'type'},{title:'设备价格',field:'price'}],
        apiUrl: 'http://rap2api.taobao.org/app/mock/95259/equipment/list',
        dialogVisible: false,
        beforeCreate: false,
        useMock: false
      }
    },
    methods: {
      addRow: function () {
        this.tableOptions.push({
          title: '',
          field: ''
        })
      },
      add: function () {
        // 校验
        if (!this.useMock && !this.apiUrl) {
          this.$message.error('请填写接口或使用mock');
          return false
        }
        // 传递消息给父组件
        window.eventBus.$emit('addTableComponent', {apiUrl:this.apiUrl,tableOptions:this.tableOptions})
        this.dialogVisible = false
      }
    }
  },
  create: function () {
    let TableComponent =  Vue.extend(this.options)
    let instance = new TableComponent()
    instance.dialogVisible = true
    instance.beforeCreate = true
    return instance
  }
}