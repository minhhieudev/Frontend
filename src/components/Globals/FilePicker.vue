<template>
  <div class="text-secondary">
    <!-- <el-button @click="show = true" icon="el-icon-upload2">Upload</el-button> -->

    <!-- <el-dialog
      title="File Manager"
      :visible.sync="show"
      width="80%"
      top="5vh"> -->
      <div class="wrap-border toolbar">
        <div class="">
          <el-button @click="newFolderPopup = true" icon="el-icon-folder">New Folder</el-button>
          <el-button class="mx-2" @click="uploadDialog = true" icon="el-icon-upload2">Upload</el-button>
        </div>
        <div>
          <el-button @click="handleLoad" class="larger-icon p-2" icon="el-icon-refresh-right"></el-button>
          <!-- <el-button class="larger-icon" icon="el-icon-info"></el-button> -->
        </div>
      </div>
      <el-container style="height: 500px" class="wrap-border p-2">
        <!-- side left -->
        <el-aside width="300px" class="wrap-border py-2">
          <el-tree
            ref="folderTree"
            :data="folderTree"
            node-key="key"
            :current-node-key="currentPath"
            @node-click="handleFolderClick"
          >
            <div class="custom-tree-node d-flex justify-content-between w-100 align-items-center" slot-scope="{ node }">
              <div class="d-flex align-items-center" :class="{ 'text-danger': node.isCurrent }">
                <span class="mx-2 larger-icon">
                  <i v-if="node.data.is_edit" class="el-icon-circle-check" ></i>
                  <i v-else-if="node.data.isLoading" class="el-icon-loading" ></i>
                  <i v-else-if="node.expanded && node.data.children.length" class="el-icon-folder-opened" ></i>
                  <i v-else class="el-icon-folder"></i>
                </span>
                <span v-if="!node.data.is_edit">
                  {{ node.data.name }}
                </span>
                <span v-else>
                  <el-input size="mini" style="height: 20px; width: auto" v-model="node.data.name"/>
                </span>
              </div>
              <span class="action-buttons" v-if="!node.data.is_edit">
                <!-- <i class="el-icon-edit" @click.stop="node.data.is_edit = true"></i> -->
                <i class="el-icon-delete mx-2 text-danger" @click.stop="removeFile(node.data)"></i>
              </span>
            </div>
          </el-tree>
        </el-aside>
        <!--//// side left -->
        <el-container>
          <!-- header -->
          <el-header height="40px" class="wrap-border d-flex py-2 px-1 align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <!-- <el-button @click="handleGoBack" icon="el-icon-back px-2" size="medium"></el-button> -->
              <el-breadcrumb separator-class="el-icon-arrow-right" class="ml-2">
                <el-breadcrumb-item v-for="(path, index) in breadcrumb" :key="index">
                  {{path}}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <div class="">
              <el-input v-model="search" clearable="" size="small" style="width: 150px" class="ml-2" placeholder="Search">
                <i class="el-icon-search el-input__icon" slot="prefix"></i>
              </el-input>
            </div>
          </el-header>
          <!--//// header -->
          <!-- list files -->
          <el-main class="d-flex p-0 px-2 justify-content-between text-center align-items-center wrap-border">
            <el-table
              highlight-current-row
              ref="singleTable"
              class="m-0"
              height="100%"
              :data="files.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
              empty-text="The folder is empty"
              @selection-change="handleFileSelectionChange"
              @row-click="handleRowClick"
              style="width: 100%; height: 100%">
              <el-table-column prop="name" label="Name">
                <span slot-scope="{row}">
                  <i v-if="row.type === 'folder'" class="el-icon-folder larger-icon"></i>
                  <i v-else-if="row.type === 'file'" class="el-icon-picture larger-icon"></i>
                  {{ row['name'] }}
                </span>
              </el-table-column>
              <el-table-column prop="size" label="Size" align="right"></el-table-column>
              <el-table-column prop="updatedAt" label="Modified" :formatter="formatDate" align="right"></el-table-column>
              <el-table-column label="Actions" width="100px" align="right">
                <template slot-scope="{row}">
                  <el-button v-if="row.type !== 'folder'" @click="removeFile(row)" size="mini" icon="el-icon-delete"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <!--//// list files -->
        </el-container>
      </el-container>

      <el-dialog
        ref="uploader"
        width="40%"
        title="Upload"
        :visible.sync="uploadDialog"
        append-to-body>
        <div class="w-100 text-center">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadImageActionURL"
            :headers="{ Authorization: jwtAuthToken, 'client-id': $store.getters['client'], 'hm-context': 'Admin' }"
            :auto-upload="false"
            :on-change="handleChangeUploader"
            list-type="picture"
            :file-list="filesUploading"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
          </el-upload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="uploadDialog = false">Cancel</el-button>
          <el-button :disabled="!filesUploading.length" type="primary" @click="handleUpload">Upload</el-button>
        </span>
      </el-dialog>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">Cancel</el-button>
        <el-button :disabled="!selectedFiles.length" type="primary" @click="handleSelectFile">Select</el-button>
      </span> -->
    <!-- </el-dialog> -->

    <el-dialog
      width="40%"
      :title="'Create New Folder Into ' + (currentPath || 'Root')"
      :visible.sync="newFolderPopup"
      append-to-body>
      <div class="d-flex">
        <el-input v-model="newFolderName" placeholder="New Folder"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newFolderPopup = false">Cancel</el-button>
        <el-button :disabled="!newFolderName.length" type="primary" @click="handleCreateFolder">Create</el-button>
      </span>
    </el-dialog>
    <!-- <input type="file" multiple class="d-none" ref="uploader" @change="handleChangeUploader"/> -->
  </div>
</template>

<script>
import { getFolderTree, getFiles, uploadImage, deleteFile, createFolder } from '@/api/upload'
import { loadFolder } from '@/api/file-manager'
import { getToken } from '@/utils/auth'

export default {
  props: ['multiple', 'value'],
  data() {
    return {
      newFolderPopup: false,
      createFolderDialog: false,
      show: false,
      uploadDialog: false,
      folderTree: [],
      currentPath: '/',
      files: [],
      openedFolderId: 0,
      selectedFiles: [],
      loadding: false,
      search: '',
      
      //upload
      jwtAuthToken: 'Bearer ' + getToken(),
      uploadImageActionURL: HM_ENV.API_URL + '/product/uploadImage',
      filesUploading: [],
     // formDataUploader: null,
      uploadProcessData: {}, 
      newFolderName: ''
    }
  },
  computed: {
    breadcrumb () {
      let paths = this.currentPath.split('/')
      return paths
    }
  },
  mounted() {
    this.loadFolder()
  },
  methods: {
    /* New methods */
    loadFolder(treeNode) {
      let path = '/'
      if (treeNode) {
        path = treeNode.key
        this.$set(treeNode.data, 'isLoading', true)
      }

      loadFolder(path).then(({ data }) => {
        if (data.success) {
          this.currentPath = data.currentPath
          const tree = this.$refs.folderTree

          if (path === '/') {
            this.folderTree = [{
              key: data.currentPath,
              name: data.currentFolder,
              children: data.folders,
              files: data.files
            }]
            this.$nextTick(() => {
              this.files = data.files
              treeNode = tree.getNode(this.currentPath)
              this.$set(treeNode.data, 'isLoaded', true)
              this.$set(treeNode, 'expanded', true)
            })
          } else {
            this.files = data.files
            this.$set(treeNode.data, 'isLoading', false)
            this.$set(treeNode.data, 'isLoaded', true)
            this.$set(treeNode.data, 'children', data.folders)
            this.$set(treeNode.data, 'files', data.files)
            this.$set(treeNode, 'expanded', true)
          }
          /* TODO - check IsTruncated and NextContinuationToken */
        }
      })
    },
    handleFolderClick(folder, treeNode) {
      if (folder.isLoaded) {
        this.files = folder.files || []
      } else {
        this.loadFolder(treeNode)
      }
    },
    /* End New Methods */
    formatDate (row, column, cellValue) {
      return (new Date(cellValue)).toLocaleDateString('en-US')
    },
    handleCreateFolder() {
      createFolder({ dir: this.currentPath , name: this.newFolderName }).then(rs => {
        this.handleLoad()
        this.newFolderPopup = false
        this.newFolderName = ''
      })
    },
    removeFile (row) {
      this.$confirm(`This will delete file "${row.name || row.label}".`, 'Confirm delete!', {
        type: 'warning',
        confirmButtonText: 'Delete'
      }).then(() => {
        deleteFile(row._id).then(() => {
          this.handleLoad()
        })
      }).catch(() => false )
    },
    activeEditFolder(node){
      console.log(node);
      console.log('active');
    },
    handleGoBack () {
      let pathArr = this.currentPath.split('/')
    //  if (pathArr.length > 1) {
        pathArr.pop()
        pathArr = pathArr.join('/')
        this.handleFolderClick(pathArr)
    },
    handleSelectFile () {
      if (this.multiple) {
        this.$emit('input', this.selectedFiles.map(file => file._id))
      } else {
        this.$emit('input', this.selectedFiles[0]._id)
      }
      this.show = false
    },
    handleUpload () { 
      let dir = '/tmp'
      if (this.currentPath) {
        dir = this.currentPath
      }

      if (this.filesUploading) {
        let formData = new FormData()
        this.filesUploading.forEach(file => {
          formData.append('upload_data', file.raw)
        });
        uploadImage(formData, this.uploadProcessData, dir).finally(() => {
          this.uploadDialog = false
          this.filesUploading = []
          this.handleFolderClick(this.currentPath)
        })
      }
    },
    handleChangeUploader (file, files) {
      this.filesUploading = files
      // console.log(e);
      // let files = e.target.files
      // if (files) {
        
      //   for (let i = 0; i< files.length; i++) {

      //   }
      //   this.uploadDialog = true
      // }
    },
    handleRowClick (row) {
      if (row.type === 'folder') {
        this.handleFolderClick(row.file_path)
      } else {
        if (this.multiple) {
          let selectedFiles = []
          let matched = false
          this.selectedFiles.forEach((file, index) => {
            if (file.path === row.path) {
              matched = true
            } else {
              selectedFiles.push(file)
            }
          });

          if (!matched) {
            selectedFiles.push(row)
          }
        } else {
          this.selectedFiles = [row]
          this.$refs['singleTable'].setCurrentRow(row);
        }
      }
    },
    handleFileSelectionChange (val) {
      //this.selectedFiles = val
    },
    handleLoad () {
      this.loadding = true
      getFolderTree().then(({data}) => {
        if (data.success) {
          this.folderTree = [data.folder_tree]
          this.loadListFile()
        }
      }).finally(() => {
      //  this.loadding = false
      })
    },
    loadListFile() {
      getFiles({path: this.currentPath}).then(({data}) => {
        if (data.success) {
          this.files = data.files
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrap-border {
    border: 1px solid #eee
  }
  .toolbar {
    width: 100%;
    height: 50px;
    background: #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 0.5em;
    padding-left: 0.5em;
  }
  .larger-icon {
    font-size: 20px;
  }
  
  .custom-tree-node {
    .action-buttons{
      display: none;
    }
    &:hover {
      .action-buttons{
        display: block;
      }
    }
  }
</style>
