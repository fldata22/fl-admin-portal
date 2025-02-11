//Global Constants
export const PHONE_NUM_REGEX = /^[+][(]{0,1}[1-9]{1,4}[)]{0,1}[-\s/0-9]*$/
export const MOMO_NUM_REGEX = /^[0][\s/0-9]{9}$/
export const DECIMAL_NUM_REGEX = /^-?\d*\.{1}\d*$/
export const DECIMAL_NUM_REGEX_POSITIVE_ONLY = /^\d*\.{1}\d*$/
export const USER_PLACEHOLDER = 'v1627893621/user_qvwhs7.png'
export const DEBOUNCE_TIMER = 500

export const GENDER_OPTIONS = [
  { key: 'Male', value: 'Male' },
  { key: 'Female', value: 'Female' },
]
export const MARITAL_STATUS_OPTIONS = [
  { key: 'Single', value: 'Single' },
  { key: 'Married', value: 'Married' },
]
export const VACATION_OPTIONS = [
  { key: 'Active', value: 'Active' },
  { key: 'Vacation', value: 'Vacation' },
]

export const TITLE_OPTIONS = [
  { key: 'Pastor', value: 'Pastor' },
  { key: 'Reverend', value: 'Reverend' },
  { key: 'Bishop', value: 'Bishop' },
]

export const SERVICE_DAY_OPTIONS = [
  { key: 'Tuesday', value: 'Tuesday' },
  { key: 'Wednesday', value: 'Wednesday' },
  { key: 'Thursday', value: 'Thursday' },
  { key: 'Friday', value: 'Friday' },
  { key: 'Saturday', value: 'Saturday' },
]

export const BUSSING_STATUS_OPTIONS = [
  { key: 'IC', value: 'IC' },
  { key: 'Graduated', value: 'Graduated' },
]

export const throwErrorMsg = (message, error) => {
  if (!message && !error) {
    return
  }
  if (!error) {
    // eslint-disable-next-line no-console
    console.error(message)
    // eslint-disable-next-line no-alert
    alert(`${message}`)
    return
  }

  if (!message) {
    // eslint-disable-next-line no-console
    console.error(error)
    // eslint-disable-next-line no-alert
    alert(`${error}`)
    return
  }

  // eslint-disable-next-line no-console
  console.error(message, ' ', error)
  // eslint-disable-next-line no-alert
  alert(`${message} ${error}`)
}

export const alertMsg = (message) => {
  // eslint-disable-next-line no-alert
  alert(message)
}

export const isAuthorised = (permittedRoles, userRoles) => {
  if (permittedRoles?.includes('all')) {
    return true
  }

  return permittedRoles?.some((r) => userRoles.includes(r))
}

export const authorisedLink = (currentUser, permittedRoles, link) => {
  if (isAuthorised(permittedRoles, currentUser.roles)) {
    return link
  }
  return '#'
}

export const capitalise = (str) => {
  return str?.charAt(0).toUpperCase() + str?.slice(1)
}
export const plural = (church) => {
  switch (church) {
    case 'stream':
      return 'streams'
    case 'Stream':
      return 'Streams'
    case 'council':
      return 'councils'
    case 'Council':
      return 'Councils'
    case 'town':
      return 'towns'
    case 'Town':
      return 'Towns'
    case 'campus':
      return 'campuses'
    case 'Campus':
      return 'Campuses'
    case 'Constituency':
      return 'Constituencies'
    case 'constituency':
      return 'constituencies'
    case 'senior high school':
      return 'senior high schools'
    case 'Senior High School':
      return 'Senior High Schools'
    case 'bacenta':
      return 'bacentas'
    case 'Bacenta':
      return 'Bacentas'
    case 'sonta':
      return 'sontas'
    case 'Sonta':
      return 'Sontas'
    case 'fellowship':
      return 'fellowships'
    case 'Fellowship':
      return 'Fellowships'
    default:
      return church
  }
}

export const parsePhoneNum = (phoneNumber) => {
  let rawNumber = phoneNumber
  if (rawNumber.includes('+2330')) {
    rawNumber = rawNumber.replace('+2330', '+233')
  }

  return rawNumber
    .replace(/\s/g, '')
    .replace('+', '')
    .replace('(', '')
    .replace(')', '')
    .replace('-', '')
}
export const repackDecimals = (decimal) => {
  if (decimal === 0) {
    return '0.0'
  }
  return parseFloat(decimal)
}

export const arrayOr = (array) => {
  return array.some((element) => element)
}

export const makeSelectOptions = (initialArray) => {
  if (!initialArray) {
    return null
  }

  return initialArray.map((data) => ({
    value: data.id,
    key: data.name ? data.name : data.fullName,
  }))
}

// debouncing function
export const debounce = (callback, delay = 500) => {
  let timeout

  return (...args) => {
    clearTimeout(timeout)
    // Clears timer if code haskk not yet executed

    timeout = setTimeout(() => {
      callback(...args) // pass in the arguments to the function and the scope
    }, delay)
  }
}

export const getHighestTitle = (member) => {
  if (!member.titleConnection.edges?.length) {
    return
  }
  let highestTitle

  member.titleConnection.edges.forEach((title) => {
    // Male Titles
    if (member.gender.gender === 'Male') {
      if (title.node.title === 'Pastor') {
        highestTitle = 'Pastor'
      }
      if (title.node.title === 'Reverend') {
        highestTitle = 'Reverend'
      }
      if (title.node.title === 'Bishop') {
        highestTitle = 'Bishop'
      }
    }

    // Female Titles
    if (member.gender.gender === 'Female') {
      if (title.node.title === 'Pastor') {
        highestTitle = 'Lady Pastor'
      }
      if (title.node.title === 'Reverend') {
        highestTitle = 'Lady Reverend'
      }
      if (title.node.title === 'Bishop') {
        highestTitle = 'Elect Mother'
      }
    }
  })

  return highestTitle
}

export const getNameWithTitle = (member) => {
  if (!member) {
    return null
  }
  const displayName = {
    name: `${member.fullName}`,
    title: getHighestTitle(member),
  }

  if (member.titleConnection.edges?.length) {
    return `${displayName.title} ${displayName.name}`
  }
  return displayName.name
}

export const average = (array) => {
  let i = 0
  let sum = 0
  const len = array.length
  while (i < len) {
    sum += array[i++]
  }
  return sum / len
}

export const parseMemberCount = (number) => {
  if (number === 1) {
    return `${number} Member`
  }
  return `${number} Members`
}
export const getMemberCount = (servant) => {
  if (!servant?.memberCount) {
    return
  }
  return `${parseMemberCount(servant?.memberCount)}, ${
    servant?.basontaMembershipCount
  } in Ministries`
}
export const getChurchCount = (servant) => {
  let churchesCount = ''

  if (servant?.leadsAdminsGatheringServiceCount) {
    if (churchesCount) {
      churchesCount += ','
    }

    if (servant.leadsAdminsGatheringServiceCount === 1) {
      churchesCount = `${servant.leadsAdminsGatheringServiceCount} Gathering Service`
    } else {
      churchesCount = `${servant.leadsAdminsGatheringServiceCount} Gathering Services`
    }
  }

  if (servant?.leadsAdminsCouncilCount) {
    if (churchesCount) {
      churchesCount += ','
    }

    if (servant.leadsAdminsCouncilCount === 1) {
      churchesCount = `${churchesCount} ${servant.leadsAdminsCouncilCount} Council`
    } else {
      churchesCount = `${churchesCount} ${servant.leadsAdminsCouncilCount} Councils`
    }
  }

  if (servant?.leadsAdminsConstituencyCount) {
    if (churchesCount) {
      churchesCount += ','

      if (servant.leadsAdminsConstituencyCount === 1) {
        churchesCount = `${churchesCount} ${servant.leadsAdminsConstituencyCount} Constituency`
      } else {
        churchesCount = `${churchesCount} ${servant.leadsAdminsConstituencyCount} Constituencies`
      }
    } else if (servant.leadsAdminsConstituencyCount === 1) {
      churchesCount = `${servant.leadsAdminsConstituencyCount} Constituency`
    } else {
      churchesCount = `${servant.leadsAdminsConstituencyCount} Constituencies`
    }
  }

  if (servant?.leadsBacentaCount) {
    if (churchesCount) {
      churchesCount += ','

      if (servant.leadsBacentaCount === 1) {
        churchesCount = `${churchesCount} ${servant.leadsBacentaCount} Bacenta`
      } else {
        churchesCount = `${churchesCount} ${servant.leadsBacentaCount} Bacentas`
      }
    } else if (servant.leadsBacentaCount === 1) {
      churchesCount = `${servant.leadsBacentaCount} Bacenta`
    } else {
      churchesCount = `${servant.leadsBacentaCount} Bacentas`
    }
  }

  if (servant?.leadsFellowshipCount) {
    if (churchesCount) {
      churchesCount += ','

      if (servant.leadsFellowshipCount === 1) {
        churchesCount = `${churchesCount} ${servant.leadsFellowshipCount} Fellowship`
      } else {
        churchesCount = `${churchesCount} ${servant.leadsFellowshipCount} Fellowships`
      }
    } else if (servant.leadsFellowshipCount === 1) {
      churchesCount = `${servant.leadsFellowshipCount} Fellowship`
    } else {
      churchesCount = `${servant.leadsFellowshipCount} Fellowships`
    }
  }

  return churchesCount
}

export const getSubChurchLevel = (churchType) => {
  switch (churchType) {
    case 'Constituency':
      return 'Bacenta'
    case 'Council':
      return 'Constituency'
    case 'Stream':
      return 'Council'
    case 'GatheringService':
      return 'Stream'
    default:
      break
  }
}

export const randomOTPGenerator = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  const charactersLength = characters.length

  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}
