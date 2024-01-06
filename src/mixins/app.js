import { snakeCase } from 'lodash'
import slugify from 'slugify'
import { uploadImage } from '@/api/media'
import * as studentAPI from '@/api/student'
import * as userAPI from '@/api/user'
const FILE_URL = process.env.VUE_APP_BACKEND_URL + process.env.VUE_APP_API_PATH + '/file'
export default {
  data() {
    return {
      ckEditorConfig: {
        entities_latin: false,
        
        basicEntities: false,
        entities_greek: false,
        entities_processNumerical: false,
        forcePasteAsPlainText: false, 
        filebrowserImageUploadUrl: FILE_URL,
      },
      editorConfig: {
        plugins: "wordcount code image link",
        toolbar:
          "undo redo | styleselect | bold italic | forecolor backcolor | link image alignleft aligncenter alignright | code",
        height: 400,
        skin: "silver",
        // extended_valid_elements: "slot[name],cms-block[type|data|id|name],wr-render-block[type|data]",
        // valid_children: "a[div|p|img|span]",
        force_br_newline: false,
        force_p_newline: false,
        forced_root_block: "",
        convert_urls: false,
        cleanup_on_startup: false,
        trim_span_elements: false,
        verify_html: false,
        cleanup: false,
        valid_elements: "[]",
        valid_children: "[]",
        images_upload_handler: async (blobInfo, cbSuccess, cbFailure) => {
          let formData = new FormData();
          formData.append("file", blobInfo.blob());
          const rs = await uploadImage(formData, null).then(({ data }) => data);

          if (rs && rs.filename) {
            cbSuccess(this.getImagePath(rs.filename));
          } else {
            cbFailure("Has an error");
          }
        },
      },
      BACKEND_PATH:
        (process.env.VUE_APP_BACKEND_URL || "http://localhost:8000") +
        (process.env.VUE_APP_API_PATH || "/api/v1/private"),
    };
  },
  methods: {
    loadAllUsers() {
      userAPI.getAll().then(({ data }) => {
        if (data.success) {
          this.$store.dispatch("setData", {
            key: "allUsers",
            data: data.docs,
          });
        }
      });
    },

    loadCurrentUser(){
      userAPI.getDetail(this.$store.getters.user._id).then((response)=>{
        this.$store.dispatch("setData",{
          key:"currentUser",
          data: response.data.doc,
        })
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
      })
    },

    loadKhoaList(){
      studentAPI.getKhoaList().then(({data})=>{
        if (data.success){
          this.$store.dispatch("setData",{
            key:"khoaList",
            data: data.khoaLists,
          })
        }
      })
    },
  
    loadNghanhList(){
      studentAPI.getNghanhList().then(({data})=>{
        if (data.success){
          this.$store.dispatch("setData",{
            key:"nganhList",
            data: data.nganhLists,
          })
        }
      })
    },
    loadLopList(){
      studentAPI.getClassList().then(({data})=>{
        if (data.success){
          this.$store.dispatch("setData",{
            key:"lopList",
            data: data.classLists,
          })
        }
      })
    },
    setData(payload) {
      this.$store.dispatch("setData", payload);
    },
    getSlug(text) {
      text = text.toLowerCase();
      text = text.replace(/đ/g, "d");
      const slug = slugify(text, {
        lower: true,
        remove: /[~!@#$%^&*()+{};'"<>?/_]/g,
      });
      return slug;
    },
    getImagePath(path) {
      return process.env.VUE_APP_BACKEND_URL + "/upload/" + path;
    },
    getPrice(pack) {
      if (
        this.$store.getters.user &&
        this.$store.getters.user.is_partner &&
        pack.vip_price
      ) {
        return pack.vip_price;
      } else {
        return pack.price;
      }
    },
    csvExport(array) {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += [
        Object.keys(array[0]).join(";"),
        ...array.map((item) => Object.values(item).join(";")),
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", "keywords.csv");
      link.click();
    },
    goToDashBoard() {
      this.$router.push({ name: "app" });
      this.$store.dispatch("reRender");
    },
    handleCopyStr(str) {
      const el = document.createElement("textarea");
      el.value = str;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
        this.$notify({
          type: "success",
          message: "Đã sao chép vào clipboard.",
        });
      }
    },
    formatPrice(price) {
      price = Number(price);
      if (isNaN(price)) {
        price = 0;
      }
      price = price.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
      return price;
    },
    getGroups() {
      return this.$store.state.app.customerGroups;
    },
    acl(path) {
      if (this.userACL === "*") {
        return true;
      }

      path = path.split("/");
      path = path
        .map((p) => {
          return snakeCase(p);
        })
        .join("/");
      return Array.isArray(this.userACL) && this.userACL.includes(path);
    },
    renderBoolean(bool, trueText = "Yes", falseText = "No") {
      // eslint-disable-next-line
      return Boolean(bool) ? trueText : falseText;
    },
    ucfirst(str) {
      if (str && typeof str === "string") {
        str = str[0].toUpperCase() + str.substr(1);
      }
      return str;
    },
    hasModule(key) {
      return this.modules[key] || false;
    },
  },
  computed: {
    isAdminRole() {
      return this.$store.getters.user.role == "Admin";
    },
    taskStatusMap() {
      return this.$store.getters.taskStatusMap;
    },
    userACL() {
      return this.$store.getters["acl"];
    },
    modules() {
      return this.$store.getters["modules"];
    },
    isNewTheme() {
      return true;
    },
  },
};
