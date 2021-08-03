import React, { useContext } from 'react'
import { ChurchContext } from '../../contexts/ChurchContext'
import NavBar from '../../components/nav/NavBar'
import { useMutation, useQuery } from '@apollo/client'
import { RECORD_SERVICE } from './RecordServiceMutations'
import { DISPLAY_TOWN } from '../display/ReadQueries'
import ServiceForm from './ServiceForm'
import BaseComponent from 'components/base-component/BaseComponent'

const TownService = () => {
  const { townId } = useContext(ChurchContext)
  const {
    data: townData,
    loading: townLoading,
    error: townError,
  } = useQuery(DISPLAY_TOWN, { variables: { id: townId } })
  const [RecordService] = useMutation(RECORD_SERVICE)

  return (
    <BaseComponent
      loadingState={townLoading}
      errorState={townError}
      data={townData}
    >
      <NavBar />
      <ServiceForm
        RecordServiceMutation={RecordService}
        church={townData?.towns[0]}
        churchId={townId}
        churchType="town"
      />
    </BaseComponent>
  )
}

export default TownService
