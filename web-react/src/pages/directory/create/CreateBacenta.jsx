import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { CREATE_BACENTA_MUTATION } from './CreateMutations'
import { CREATE_BACENTA_EQUIPMENT_CAMPAIGN } from '../../campaigns/CampaignQueries'
import { ChurchContext } from '../../../contexts/ChurchContext'
import { NEW_BACENTA_LEADER } from './MakeLeaderMutations'
import BacentaForm from '../reusable-forms/BacentaForm'
import { throwErrorMsg } from 'global-utils'

const CreateBacenta = () => {
  const { clickCard, constituencyId } = useContext(ChurchContext)
  const navigate = useNavigate()

  const initialValues = {
    name: '',
    leaderId: '',
    constituency: constituencyId ?? '',
    fellowships: [''],
    graduationStatus: '',
    vacationStatus: '',
  }

  const [NewBacentaLeader] = useMutation(NEW_BACENTA_LEADER)
  const [CreateBacenta] = useMutation(CREATE_BACENTA_MUTATION)
  const [CreateEquipmentCampaign] = useMutation(
    CREATE_BACENTA_EQUIPMENT_CAMPAIGN
  )

  //onSubmit receives the form state as argument
  const onSubmit = async (values, onSubmitProps) => {
    onSubmitProps.setSubmitting(true)
    clickCard({ id: values.constituency, __typename: 'Constituency' })
    try {
      const res = await CreateBacenta({
        variables: {
          name: values.name,
          constituencyId: values.constituency,
          leaderId: values.leaderId,
          fellowships: values.fellowships,
        },
      })

      clickCard(res.data.CreateBacenta)
      try {
        await NewBacentaLeader({
          variables: {
            leaderId: values.leaderId,
            bacentaId: res.data.CreateBacenta.id,
          },
        })
      } catch (error) {
        throwErrorMsg('There was an error adding leader', error)
      }

      try {
        await CreateEquipmentCampaign({
          variables: {
            bacentaId: res.data.CreateBacenta.id,
          },
        })
      } catch (error) {
        throwErrorMsg('There was an error creating a campaign', error)
      }

      onSubmitProps.setSubmitting(false)
      onSubmitProps.resetForm()
      navigate('/bacenta/displaydetails')
    } catch (error) {
      throwErrorMsg('There was an error creating bacenta', error)
    }
  }

  return (
    <BacentaForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      title="Start a New Bacenta"
      newBacenta={true}
    />
  )
}
export default CreateBacenta
