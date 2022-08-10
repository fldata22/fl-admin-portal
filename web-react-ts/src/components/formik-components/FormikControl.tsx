import React from 'react'
import Input from './Input'
import Textarea from './Textarea'
import Select from './Select'
import SelectWithQuery from './SelectWithQuery'
import RadioButtons from './RadioButtons'
import CheckboxGroup from './CheckboxGroup'
import Combobox from './Combobox'
import ImageUpload from './ImageUpload'
import CheckboxWithQuery from './CheckboxWithQuery'
import SearchMember from './SearchMember'
import SearchFellowship from './SearchFellowship'
import SearchBacenta from './SearchBacenta'
import SearchConstituency from './SearchConstituency'
import SearchCouncil from './SearchCouncil'
import SearchStream from './SearchStream'

export const arrayError = (
  array: string | string[] | number[] | undefined,
  index: number
) => {
  if (array?.length) return array[index]

  return array
}

type FormikControlProps = {
  control:
    | 'input'
    | 'combobox'
    | 'memberSearch'
    | 'fellowshipSearch'
    | 'bacentaSearch'
    | 'constituencySearch'
    | 'councilSearch'
    | 'streamSearch'
    | 'textarea'
    | 'select'
    | 'selectWithQuery'
    | 'radio'
    | 'checkbox'
    | 'checkboxWithQuery'
    | 'imageUpload'
  name: string
  label?: string
  [key: string]: any
}

function FormikControl(props: FormikControlProps) {
  const { control, ...rest } = props

  switch (control) {
    case 'input':
      return <Input {...rest} />
    case 'combobox':
      return <Combobox {...rest} />
    case 'memberSearch':
      return <SearchMember {...rest} />
    case 'fellowshipSearch':
      return <SearchFellowship {...rest} />
    case 'bacentaSearch':
      return <SearchBacenta {...rest} />
    case 'constituencySearch':
      return <SearchConstituency {...rest} />
    case 'councilSearch':
      return <SearchCouncil {...rest} />
    case 'streamSearch':
      return <SearchStream {...rest} />
    case 'textarea':
      return <Textarea {...rest} />
    case 'select':
      return <Select {...rest} />
    case 'selectWithQuery':
      return <SelectWithQuery {...rest} />
    case 'radio':
      return <RadioButtons {...rest} />
    case 'checkbox':
      return <CheckboxGroup {...rest} />
    case 'checkboxWithQuery':
      return <CheckboxWithQuery {...rest} />
    case 'imageUpload':
      return <ImageUpload {...rest} />
    default:
      return null
  }
}

export default FormikControl
