import { extend, localize } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import en from 'vee-validate/dist/locale/en.json';

localize('en', en)

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule])
})
