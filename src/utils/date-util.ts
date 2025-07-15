// @ts-ignore
function formattedDate(value, type, inMs) {
  if (!type) return value

  if (!inMs) {
    value = value * 1000
  }
  const date = new Date(value)
  let options
  let result

  switch (type) {
    case 'date':
      options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
      break
    case 'time':
      options = {
        hour: 'numeric',
        minute: 'numeric',
      }
      break
    case 'dayName':
      options = { weekday: 'long' }
      break
    default:
      break
  }

  // @ts-ignore
  result = new Intl.DateTimeFormat('en-us', options).format(date)

  // Extract day name if type is "date"
  if (type === 'date') {
    const dayName = new Intl.DateTimeFormat('en-us', {
      weekday: 'long',
    }).format(date)
    return { formattedDate: result, dayName }
  }

  return result
}

export { formattedDate }
