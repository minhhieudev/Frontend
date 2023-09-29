<template>
  <div class="wrapper">
    <div class="item" v-for="index in codelength" :key="'code-input' + index">
      <input
        type="number"
        autocomplete="off"
        class="el-input__inner input"
        min="0"
        max="9"
        @paste="handlePaste"
        maxlength="1"
        @keydown="handleChangeValue"
        @focus="handleFocus"
        :data-id="index"
        @change="handleChange"
        ref="codes"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
function gotoElement(node, type = 'next') {
  const key = type === 'next' ? 'nextElementSibling' : 'previousElementSibling'
  try {
    return node.parentElement[key].children[0]
  } catch {
    return false
  }
}
export default {
  props: {
    codelength: {
      type: Number,
      default: 6
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.codes[0].focus()
      this.$emit('mounted', true)
    }, 200)
  },
  data() {
    return {
      code: ''
    }
  },
  computed: {
    isValid () {
      return this.code.length === this.codelength
    }
  },
  methods: {
    handleChange: _.debounce(function() {
      this.code = this.$refs.codes.map(ele => {
        return ele.value
      }).join('')
      this.$emit('change', this.code)
    }, 100),
    handleFocus(e) {
      e.target.select()
    },
    handlePaste(e) {
      e.stopPropagation()
      e.preventDefault()
      const { target } = e
      // only handle with first element
      if (target && target.dataset && Number(target.dataset.id) === 1) {
        const clipboardData = e.clipboardData || window.clipboardData
        const text = clipboardData.getData('Text').trim()
        if (!isNaN(text)) {
          this.$refs.codes.forEach((code, index) => {
            code.value = text[index] || ''
          })
          this.handleChange()
        }
      }
    },
    handleChangeValue(e) {
      const { target } = e
      if (target && (!isNaN(e.key) || e.code === 'Backspace')) {
        this.handleChange()
        target.value = e.key.replace(/[^\d]/gi, '')
        if (target.value) {
          const nextEle = gotoElement(target)
          if (nextEle) {
            nextEle.focus()
          }
          e.preventDefault()
        } else {
          if (e.code === 'Backspace') {
            const previousEle = gotoElement(target, 'prev')
            if (previousEle) {
              previousEle.focus()
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin: auto;
  text-align: center;
  .item {
    display: inline-block;
    margin: 5px;
    .input {
      width: 45px;
      font-size: 18px;
    }
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
