
export function removeEmptyKey (obj) {
  let newObj = {};
  for (const key in obj) {
    if (key === '$regex' && !obj[key]) {
      return {}
    }

    if (typeof obj[key] === 'object' && obj[key]) {
      let n = removeEmptyKey(obj[key])

      if (Object.keys(n).length) {
        newObj[key] = n
      }
    } else {
      // console.log(key)
      if (obj[key] !== undefined  && obj[key] !== '' && obj[key] !== null ) {
        if (/^\$(gt|lt)e?/.test(key)) {
          if (!isNaN(obj[key])) {
            newObj[key] = +obj[key]
          }
        } else {
          if (Array.isArray(obj)) {
            newObj = obj
          } else {
            newObj[key] = obj[key]
          }
        }
      }
    }
  }

  return newObj
}

export function timeConversion (millisec) {
  const seconds = (millisec / 1000).toFixed(1)
  const minutes = (millisec / (1000 * 60)).toFixed(1)
  const hours = (millisec / (1000 * 60 * 60)).toFixed(1)
  const days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1)
  if (seconds < 60) {
      return seconds + " Sec"
  } else if (minutes < 60) {
      return minutes + " Min"
  } else if (hours < 24) {
      return hours + " Hour"
  } else {
      return days + " Day"
  }
}

export function mstoMinute (ms) {
  return ms / 60000;
}

export function minuteToMS (min) {
  return min * 60000;
}

function _normalizeProduct(productOrItem) {
  const product = {}
  Object.entries(STOCK_FIELDS).forEach(entry => {
    product[entry[1]] = productOrItem[entry[1]] || productOrItem[entry[0]]
  })

  if (typeof productOrItem.row_total === 'undefined') {
    product._isProduct = true
  }

  return product
}

export function formatHightlight(text, value) {
  return value.replace(text, '<strong class="color-text-primary">' +text+ '</strong>')
}
export function formatNumber(num, type = '', decimals = 4) {
  if(type === 'price') return '$' + num.toFixed(decimals)
  if(type === 'decimal')  return num.toFixed(decimals)
  return num
}
