import React, { useContext } from 'react'
import FormikControl from 'components/formik-components/FormikControl'
import { Formik, Form } from 'formik'
import { Col, Container, Row, Button } from 'react-bootstrap'
import HeadingSecondary from 'components/HeadingSecondary'
//import BaseComponent from 'components/base-component/BaseComponent'
import { HeadingPrimary } from 'components/HeadingPrimary/HeadingPrimary'
import { MemberContext } from 'contexts/MemberContext'
import { useMutation } from '@apollo/client'
import { FELLOWSHIP_EQUIPMENT_RECORD_CREATION } from '../CampaignQueries'
import { ChurchContext } from 'contexts/ChurchContext'
//import { useNavigate } from 'react-router'
import { CampaignContext } from 'contexts/CampaignContext'

const FellowshipEquipmentForm = () => {
  const { currentUser } = useContext(MemberContext)
  const { fellowshipId } = useContext(ChurchContext)
  const church = currentUser.currentChurch
  const churchType = currentUser.currentChurch?.__typename

  const { setEquipmentRecordId } = useContext(CampaignContext)

  const [CreateEquipmentRecord] = useMutation(
    FELLOWSHIP_EQUIPMENT_RECORD_CREATION
  )
  const { theme } = useContext(MemberContext)
  //const navigate = useNavigate()

  const initialValues = {
    fellowshipId: ' ',
    offeringBags: '',
    date: new Date().toISOString().slice(0, 10),
  }

  const onSubmit = (values, onSubmitProps) => {
    onSubmitProps.setSubmitting(true)
    CreateEquipmentRecord({
      variables: {
        fellowshipId: fellowshipId,
        offeringBags: parseInt(values.offeringBags),
        date: values.date,
      },
    }).then((res) => {
      onSubmitProps.setSubmitting(false)
      onSubmitProps.resetForm()
      console.log(res.data)
      setEquipmentRecordId(res.data)
      //navigate('/campaigns/fellowship/equipment/form-details')
      console.log(res)
    })
  }

  return (
    <Formik
      initialValues={initialValues}
      //validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnMount={true}
    >
      {(formik) => (
        <Container>
          <HeadingPrimary className="text-center">
            Equipment Campaign Form
          </HeadingPrimary>
          <HeadingSecondary className="text-center">{`${church?.name} ${churchType}`}</HeadingSecondary>
          <Form>
            <Row className="row-cols-1 row-cols-md-2 mt-5">
              <Col className="mb-2">
                <small htmlFor="date" className="form-text ">
                  Date * <i className="text-secondary">(Day/Month/Year)</i>
                </small>
                <FormikControl
                  className="form-control"
                  control="input"
                  name="date"
                  type="date"
                  placeholder="dd/mm/yyyy"
                />
                <small htmlFor="date" className="form-text ">
                  Number of Offering Bags*{' '}
                </small>
                <FormikControl
                  className="form-control"
                  control="input"
                  name="offeringBags"
                  placeholder="0"
                />
                <div className="d-flex justify-content-center pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    className={`btn-main ${theme}`}
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    Submit
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      )}
    </Formik>
  )
}

export default FellowshipEquipmentForm
